import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

const app = new Hono().basePath('/api')

app.onError((err, c) => {
  console.error('HONO ERROR:', err)
  return c.json({ error: err.message, stack: err.stack }, 500)
})

app.get('/hello', (c) => {
  return c.json({
    message: 'Hello from Hono on Next.js with Prisma!',
  })
})

// --- STATS ---
// --- STATS ---
app.get('/stats', async (c) => {
  try {
    const { searchParams } = new URL(c.req.url)
    const role = searchParams.get('role')
    const branch = searchParams.get('branch')

    const where: any = {}
    if (branch && branch !== 'ALL') {
      where.branch = branch
    }

    // Role-based filtering (simplified)
    if (role === 'FIELD_LEAD_REP') {
      // Ideally filter by assignedToId if we had the user ID from session
    }

    const totalLeads = await prisma.lead.count({ where })
    const activeQuotes = await prisma.quote.count({
      where: {
        ...where, // Assuming Quote has relation to Lead, we might need nested query or just rely on global stats for MVP if Quote doesn't have branch directly
        status: 'SENT'
      }
    })
    const pendingActions = await prisma.activity.count({
      where: {
        lead: where // Filter activities by lead's branch
      }
    })

    // Calculate Total Commissions
    const commissions = await prisma.commission.findMany({
      where: {
        lead: where
      }
    })
    const totalCommissions = commissions.reduce((sum: number, c: any) => sum + Number(c.amount), 0)

    // Calculate Pipeline Value
    const quotes = await prisma.quote.findMany({
      where: {
        status: 'SENT',
        lead: where
      }
    })
    const pipelineValue = quotes.reduce((sum: number, q: any) => sum + Number(q.amount), 0)

    // Calculate Conversion Rate
    const wonLeads = await prisma.lead.count({
      where: { ...where, stage: 'WON' }
    })
    const conversionRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100) : 0

    return c.json({
      data: { // Wrap in data to match frontend expectation
        totalLeads,
        activeQuotes,
        pendingActions,
        totalCommissions,
        pipelineValue,
        conversionRate,
        revenue: pipelineValue * 0.8, // Mock revenue as 80% of pipeline for now
        pipeline: pipelineValue,
        activeLeadsCount: totalLeads,
        avgMargin: 22, // Mock
        retention: 95 // Mock
      }
    })
  } catch (e: any) {
    console.error('STATS ERROR:', e)
    return c.json({ error: e.message }, 500)
  }
})

// --- LEADS ---
app.get('/leads', async (c) => {
  try {
    const { searchParams } = new URL(c.req.url)
    const search = searchParams.get('search')?.toLowerCase() || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const branch = searchParams.get('branch')

    const where: any = {}

    if (branch && branch !== 'ALL') {
      where.branch = branch
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { phone: { contains: search } },
        // { email: { contains: search } } // Email is on User, not Lead in current schema? Wait, Lead has no email in schema?
        // Let's check schema again. Lead has name, address, phone. No email?
        // Schema: name, address, phone.
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
        quotes: true
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
    console.error('LEADS ERROR:', e)
    return c.json({ error: e.message }, 500)
  }
})

app.get('/leads/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        activities: { orderBy: { createdAt: 'desc' } },
        quotes: true
      }
    })

    if (!lead) return c.json({ error: 'Lead not found' }, 404)
    return c.json(lead)
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

app.post('/leads', async (c) => {
  try {
    const body = await c.req.json()

    // Create lead
    const lead = await prisma.lead.create({
      data: {
        name: body.name,
        address: body.address,
        phone: body.phone,
        stage: 'COLD',
        branch: body.branch,
        industry: body.industry,
        // assignedToId: ... // Need a user ID. For now, maybe optional or hardcoded if auth not fully ready
      }
    })

    return c.json(lead)
  } catch (e: any) {
    console.error('CREATE LEAD ERROR:', e)
    return c.json({ error: e.message }, 500)
  }
})

app.put('/leads/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()

    const updateData: any = { ...body }
    delete updateData.id
    delete updateData.createdAt
    delete updateData.updatedAt

    const lead = await prisma.lead.update({
      where: { id },
      data: updateData
    })

    // Hand-off Logic: If stage changed to WON, create a notification/task
    if (updateData.stage === 'WON') {
      await prisma.activity.create({
        data: {
          type: 'HANDOFF',
          description: `✅ CLIENT WON: ${lead.name} (Branch: ${lead.branch || 'Unassigned'}). Ready for recruitment onboarding.`,
          leadId: lead.id,
          userId: 'system' // System generated
        }
      })
    }

    return c.json(lead)
  } catch (e: any) {
    console.error('UPDATE LEAD ERROR:', e)
    return c.json({ error: e.message }, 500)
  }
})

app.delete('/leads/:id', async (c) => {
  try {
    const id = c.req.param('id')
    await prisma.lead.delete({ where: { id } })
    return c.json({ success: true })
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// --- ACTIVITIES ---
app.post('/activities', async (c) => {
  try {
    const body = await c.req.json()
    const activity = await prisma.activity.create({
      data: {
        type: body.type || 'NOTE',
        description: body.content || body.description,
        leadId: body.leadId,
        userId: body.userId || 'unknown' // Needs valid user ID
      }
    })
    return c.json(activity)
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// --- QUOTES ---
app.get('/quotes', async (c) => {
  try {
    const leadId = c.req.query('leadId')
    const where = leadId ? { leadId } : {}
    const quotes = await prisma.quote.findMany({ where })
    return c.json(quotes)
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
export const PATCH = handle(app)
