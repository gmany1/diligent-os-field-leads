import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { prisma } from '@/lib/prisma'

import { auth } from '@/auth'
import { logger } from '@/lib/logger'
import { register, httpRequestDurationMicroseconds, httpRequestsTotal } from '@/lib/metrics'

export const runtime = 'nodejs'

type Variables = {
  requestId: string
}

const app = new Hono<{ Variables: Variables }>().basePath('/api')

// --- MIDDLEWARE: Logger & Metrics ---
app.use('*', async (c, next) => {
  const start = performance.now()
  const requestId = crypto.randomUUID()
  const method = c.req.method
  const url = c.req.path

  c.set('requestId', requestId)

  let userId = 'anonymous'
  try {
    const session = await auth()
    if (session?.user?.email) {
      userId = session.user.email
    }
  } catch (e) {
    // Ignore auth errors in logging
  }

  await next()

  const duration = (performance.now() - start) / 1000
  const status = c.res.status

  httpRequestDurationMicroseconds.labels(method, url, status.toString()).observe(duration)
  httpRequestsTotal.labels(method, url, status.toString()).inc()

  logger.info({
    requestId,
    method,
    url,
    status,
    duration,
    userId,
  }, 'API Request')
})

app.onError((err, c) => {
  logger.error({ err, url: c.req.path }, 'HONO ERROR')
  return c.json({ error: err.message, stack: process.env.NODE_ENV === 'development' ? err.stack : undefined }, 500)
})

// --- METRICS ---
app.get('/metrics', async (c) => {
  try {
    c.header('Content-Type', register.contentType)
    return c.body(await register.metrics())
  } catch (e) {
    return c.json({ error: 'Metrics Error' }, 500)
  }
})

app.get('/hello', (c) => {
  return c.json({
    message: 'Hello from Hono on Next.js with Prisma!',
  })
})

// --- HELPER: RBAC Scope ---
function getScope(session: any) {
  const role = session?.user?.role
  const branchId = (session?.user as any)?.branchId
  const userId = session?.user?.id

  // Global Roles
  if (['CEO', 'AREA_DIRECTOR', 'CAO', 'DOO', 'IT_SUPER_ADMIN', 'EXECUTIVE', 'IT_ADMIN'].includes(role)) {
    return {}
  }
  // Branch Roles
  if (role === 'BRANCH_MANAGER' || role === 'MANAGER') {
    return branchId ? { branchId } : { branchId: 'NONE' }
  }
  // Rep Roles
  if (['STAFFING_REP', 'SALES_REP', 'FIELD_LEAD_REP'].includes(role)) {
    // Reps see OWN leads
    return userId ? { assignedToId: userId } : { id: 'NONE' }
  }
  return { id: 'NONE' } // Default deny
}

// --- STATS ---
app.get('/stats', async (c) => {
  try {
    const session = await auth()
    if (!session) return c.json({ error: 'Unauthorized' }, 401)
    const scope = getScope(session)

    const { searchParams } = new URL(c.req.url)
    const branch = searchParams.get('branch')

    const where: any = { ...scope }
    // Allow filtering further if Global, or if filtering within own scope
    if (branch && branch !== 'ALL') {
      where.branchId = branch
    }

    const totalLeads = await prisma.lead.count({ where })

    // Quotes count
    const activeQuotes = await prisma.quote.count({
      where: {
        AND: [
          { status: 'SENT' },
          { lead: where }
        ]
      }
    })

    // Activities
    const pendingActions = await prisma.activity.count({
      where: {
        lead: where
      }
    })

    // Commissions
    const commissions = await prisma.commission.findMany({
      where: {
        lead: where
      }
    })
    const totalCommissions = commissions.reduce((sum: number, c: any) => sum + Number(c.amount), 0)

    // Pipeline
    const quotes = await prisma.quote.findMany({
      where: {
        status: 'SENT',
        lead: where
      }
    })
    const pipelineValue = quotes.reduce((sum: number, q: any) => sum + Number(q.amount), 0)

    // Conversion
    const wonLeads = await prisma.lead.count({
      where: { ...where, stage: 'WON' }
    })
    const conversionRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100) : 0

    return c.json({
      data: {
        totalLeads,
        activeQuotes,
        pendingActions,
        totalCommissions,
        pipelineValue,
        conversionRate,
        revenue: pipelineValue * 0.8,
        pipeline: pipelineValue,
        activeLeadsCount: totalLeads,
        avgMargin: 22,
        retention: 95
      }
    })
  } catch (e: any) {
    logger.error({ err: e }, 'STATS ERROR')
    return c.json({ error: e.message }, 500)
  }
})

// --- LEADS ---
app.get('/leads', async (c) => {
  try {
    const session = await auth()
    if (!session) return c.json({ error: 'Unauthorized' }, 401)
    const scope = getScope(session)

    const { searchParams } = new URL(c.req.url)
    const search = searchParams.get('search')?.toLowerCase() || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const branch = searchParams.get('branch')

    const where: any = { ...scope }

    if (branch && branch !== 'ALL') {
      where.branchId = branch
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { phone: { contains: search } },
      ]
    }

    const total = await prisma.lead.count({ where })
    const leads = await prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        activities: true,
        quotes: true,
        branch: true
      }
    })

    return c.json({
      data: leads,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (e: any) {
    logger.error({ err: e }, 'LEADS ERROR')
    return c.json({ error: e.message }, 500)
  }
})

app.post('/leads', async (c) => {
  try {
    const session = await auth()
    if (!session) return c.json({ error: 'Unauthorized' }, 401)

    const body = await c.req.json()
    const { name, phone, email, address, industry, source, notes, branchId, vacancies, vacanciesNote } = body

    if (!name) {
      return c.json({ error: 'Name is required' }, 400)
    }

    const lead = await prisma.lead.create({
      data: {
        name,
        phone,
        email,
        address,
        industry,
        source: source || 'MANUAL',
        notes,
        branchId,
        vacancies: vacancies || 0,
        vacanciesNote,
        stage: 'COLD',
        assignedToId: session.user.id
      },
      include: {
        branch: true,
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    // Audit log
    await prisma.auditLog.create({
      data: {
        action: 'CREATE',
        entity: 'LEAD',
        entityId: lead.id,
        userId: session.user.id,
        details: JSON.stringify({ name: lead.name }),
        ipAddress: c.req.header('x-forwarded-for') || 'unknown',
        userAgent: c.req.header('user-agent'),
      }
    })

    return c.json({ success: true, data: lead }, 201)
  } catch (e: any) {
    logger.error({ err: e }, 'CREATE LEAD ERROR')
    return c.json({ error: e.message }, 500)
  }
})

app.get('/leads/:id', async (c) => {
  try {
    const session = await auth()
    if (!session) return c.json({ error: 'Unauthorized' }, 401)
    const scope = getScope(session)

    const id = c.req.param('id')
    const lead = await prisma.lead.findFirst({
      where: {
        id,
        ...scope
      },
      include: {
        activities: { orderBy: { createdAt: 'desc' } },
        quotes: true,
        branch: true
      }
    })

    if (!lead) return c.json({ error: 'Lead not found or unauthorized' }, 404)
    return c.json(lead)
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

app.delete('/leads/:id', async (c) => {
  try {
    const session = await auth()
    if (!session) return c.json({ error: 'Unauthorized' }, 401)
    const id = c.req.param('id')
    // Ideally we should check if they can delete this specific lead using scope too,
    // but for now we rely on the fact they saw it in the UI + explicit RBAC checks if implemented.
    // Let's add scope check quickly:
    const scope = getScope(session)
    const lead = await prisma.lead.findFirst({ where: { id, ...scope } })
    if (!lead) return c.json({ error: 'Unauthorized to delete this lead' }, 403)

    await prisma.lead.delete({ where: { id } })

    await prisma.auditLog.create({
      data: {
        action: 'DELETE',
        entity: 'LEAD',
        entityId: id,
        userId: session.user.id,
        details: JSON.stringify({ requester: session.user.email }),
        ipAddress: c.req.header('x-forwarded-for') || 'unknown',
        userAgent: c.req.header('user-agent'),
      }
    })

    return c.json({ success: true })
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

app.patch('/leads/:id', async (c) => {
  try {
    const session = await auth()
    if (!session) return c.json({ error: 'Unauthorized' }, 401)
    const id = c.req.param('id')
    const scope = getScope(session)

    // Check access
    const lead = await prisma.lead.findFirst({ where: { id, ...scope } })
    if (!lead) return c.json({ error: 'Unauthorized to edit this lead' }, 403)

    const body = await c.req.json()
    const updatedLead = await prisma.lead.update({
      where: { id },
      data: body
    })

    return c.json({ success: true, data: updatedLead })
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// --- QUOTES ---
app.get('/quotes', async (c) => {
  try {
    const session = await auth()
    if (!session) return c.json({ error: 'Unauthorized' }, 401)
    const scope = getScope(session)

    const leadId = c.req.query('leadId')
    const where: any = {
      lead: scope // Quote -> Lead -> Scope
    }
    if (leadId) where.leadId = leadId

    const quotes = await prisma.quote.findMany({
      where,
      include: { lead: true }
    })
    return c.json(quotes)
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

app.post('/quotes', async (c) => {
  try {
    const session = await auth()
    if (!session) return c.json({ error: 'Unauthorized' }, 401)

    const body = await c.req.json()
    const { amount, leadId, status } = body

    if (!amount || !leadId) {
      return c.json({ error: 'Missing required fields' }, 400)
    }

    // Verify access to lead
    const scope = getScope(session)
    const lead = await prisma.lead.findFirst({ where: { id: leadId, ...scope } })
    if (!lead) {
      return c.json({ error: 'Lead not found or unauthorized' }, 403)
    }

    const quote = await prisma.quote.create({
      data: {
        amount: parseFloat(amount),
        status: status || 'DRAFT',
        leadId,
        createdById: session.user.id,
        pdfUrl: null
      },
      include: {
        lead: {
          select: {
            id: true,
            name: true
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    // Update lead stage if needed
    if (status === 'SENT' && lead.stage === 'HOT') {
      await prisma.lead.update({
        where: { id: leadId },
        data: { stage: 'QUOTE' }
      })
    }

    return c.json({ success: true, data: quote }, 201)
  } catch (e: any) {
    logger.error({ err: e }, 'CREATE QUOTE ERROR')
    return c.json({ error: e.message }, 500)
  }
})

app.patch('/quotes/:id', async (c) => {
  try {
    const session = await auth()
    if (!session) return c.json({ error: 'Unauthorized' }, 401)
    const id = c.req.param('id')

    const quote = await prisma.quote.findFirst({
      where: { id },
      include: { lead: true }
    })

    if (!quote) {
      return c.json({ error: 'Quote not found' }, 404)
    }

    const scope = getScope(session)
    const lead = await prisma.lead.findFirst({
      where: { id: quote.leadId, ...scope }
    })

    if (!lead) {
      return c.json({ error: 'Unauthorized' }, 403)
    }

    const body = await c.req.json()
    const updatedQuote = await prisma.quote.update({
      where: { id },
      data: body,
      include: {
        lead: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return c.json({ success: true, data: updatedQuote })
  } catch (e: any) {
    logger.error({ err: e }, 'UPDATE QUOTE ERROR')
    return c.json({ error: e.message }, 500)
  }
})

// --- ACTIVITIES ---
app.get('/activities', async (c) => {
  try {
    const session = await auth()
    if (!session) return c.json({ error: 'Unauthorized' }, 401)
    const scope = getScope(session)

    const { searchParams } = new URL(c.req.url)
    const leadId = searchParams.get('leadId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: any = {
      lead: scope
    }

    if (leadId) {
      where.leadId = leadId
    }

    const total = await prisma.activity.count({ where })
    const activities = await prisma.activity.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        lead: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return c.json({
      data: activities,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (e: any) {
    logger.error({ err: e }, 'ACTIVITIES ERROR')
    return c.json({ error: e.message }, 500)
  }
})

app.post('/activities', async (c) => {
  try {
    const session = await auth()
    if (!session) return c.json({ error: 'Unauthorized' }, 401)

    const body = await c.req.json()
    const { type, description, leadId, date } = body

    if (!type || !description || !leadId) {
      return c.json({ error: 'Missing required fields' }, 400)
    }

    const scope = getScope(session)
    const lead = await prisma.lead.findFirst({ where: { id: leadId, ...scope } })
    if (!lead) {
      return c.json({ error: 'Lead not found or unauthorized' }, 403)
    }

    const activity = await prisma.activity.create({
      data: {
        type,
        description,
        leadId,
        userId: session.user.id,
        date: date ? new Date(date) : new Date()
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        lead: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return c.json({ success: true, data: activity }, 201)
  } catch (e: any) {
    logger.error({ err: e }, 'CREATE ACTIVITY ERROR')
    return c.json({ error: e.message }, 500)
  }
})

// --- CCPA ---
app.get('/privacy/export', async (c) => {
  try {
    const session = await auth()
    const role = session?.user?.role
    const userId = session?.user?.email || 'unknown'

    if (!['CEO', 'AREA_DIRECTOR', 'CAO', 'DOO', 'IT_SUPER_ADMIN', 'EXECUTIVE', 'IT_ADMIN'].includes(role as string)) {
      return c.json({ error: 'Unauthorized' }, 403)
    }

    const { searchParams } = new URL(c.req.url)
    const leadId = searchParams.get('leadId')

    if (!leadId) return c.json({ error: 'Missing leadId' }, 400)

    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        activities: true,
        quotes: true,
        commissions: true
      }
    })

    if (!lead) return c.json({ error: 'Lead not found' }, 404)

    await prisma.auditLog.create({
      data: {
        action: 'CCPA_EXPORT',
        entity: 'LEAD',
        entityId: leadId,
        userId: session?.user?.id ?? null,
        details: JSON.stringify({ requester: userId }),
        ipAddress: c.req.header('x-forwarded-for') || 'unknown',
        userAgent: c.req.header('user-agent'),
      }
    })

    return c.json({
      legal_notice: 'CONFIDENTIAL: Contains PII.',
      exportedAt: new Date(),
      data: lead
    })

  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

app.post('/privacy/delete', async (c) => {
  try {
    const session = await auth()
    const role = session?.user?.role
    const userId = session?.user?.email || 'unknown'

    if (!['CEO', 'AREA_DIRECTOR', 'CAO', 'DOO', 'IT_SUPER_ADMIN', 'EXECUTIVE', 'IT_ADMIN'].includes(role as string)) {
      return c.json({ error: 'Unauthorized' }, 403)
    }

    const body = await c.req.json()
    const { leadId, type } = body

    if (!leadId) return c.json({ error: 'Missing leadId' }, 400)
    const deleteType = type === 'HARD' ? 'HARD' : 'SOFT'

    if (deleteType === 'HARD') {
      await prisma.$transaction([
        prisma.activity.deleteMany({ where: { leadId } }),
        prisma.quote.deleteMany({ where: { leadId } }),
        prisma.commission.deleteMany({ where: { leadId } }),
        prisma.lead.delete({ where: { id: leadId } })
      ])
    } else {
      await prisma.lead.update({
        where: { id: leadId },
        data: {
          name: 'DELETED_USER',
          phone: null,
          email: null,
          address: null,
          notes: 'DATA CLEARED',
          source: 'ANONYMIZED'
        }
      })
    }

    await prisma.auditLog.create({
      data: {
        action: deleteType === 'HARD' ? 'CCPA_DELETE_HARD' : 'CCPA_DELETE_SOFT',
        entity: 'LEAD',
        entityId: leadId,
        userId: session?.user?.id ?? null,
        details: JSON.stringify({ requester: userId }),
        ipAddress: c.req.header('x-forwarded-for') || 'unknown',
        userAgent: c.req.header('user-agent'),
      }
    })

    return c.json({ success: true, type: deleteType })

  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})


// --- REPORTS ---
app.get('/reports/manager', async (c) => {
  try {
    const session = await auth()
    if (!session) return c.json({ error: 'Unauthorized' }, 401)

    // Authorization Check
    const role = (session.user as any).role || ''
    const allowedRoles = ['BRANCH_MANAGER', 'MANAGER', 'CEO', 'AREA_DIRECTOR', 'CAO', 'DOO', 'EXECUTIVE', 'IT_SUPER_ADMIN']

    if (!allowedRoles.includes(role)) {
      return c.json({ error: 'Unauthorized. Manager access required.' }, 403)
    }

    const scope = getScope(session)

    // Pipeline Stats (Leads by Stage)
    const pipelineCounts = await prisma.lead.groupBy({
      by: ['stage'],
      where: {
        ...scope
      },
      _count: {
        _all: true
      }
    })
    const pipeline = pipelineCounts.map(p => ({ stage: p.stage, count: p._count._all }))

    // Activity Stats
    const activityCounts = await prisma.activity.groupBy({
      by: ['type'],
      where: {
        lead: {
          ...scope
        }
      },
      _count: {
        _all: true
      }
    })
    const activity = activityCounts.map(a => ({ type: a.type, count: a._count._all }))

    return c.json({ pipeline, activity })

  } catch (e: any) {
    logger.error({ err: e }, 'MANAGER REPORT ERROR')
    return c.json({ error: e.message }, 500)
  }
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
export const PATCH = handle(app)
