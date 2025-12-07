// ENDPOINTS FALTANTES PARA AGREGAR A route.ts

// POST /api/leads - Crear lead
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

// POST /api/activities - Crear actividad
app.post('/activities', async (c) => {
    try {
        const session = await auth()
        if (!session) return c.json({ error: 'Unauthorized' }, 401)

        const body = await c.req.json()
        const { type, description, leadId, date } = body

        if (!type || !description || !leadId) {
            return c.json({ error: 'Missing required fields' }, 400)
        }

        // Verify access to lead
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

// GET /api/activities - Listar actividades
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

// POST /api/quotes - Crear cotización
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
                pdfUrl: null // Will be generated later
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

// PATCH /api/quotes/:id - Actualizar cotización
app.patch('/quotes/:id', async (c) => {
    try {
        const session = await auth()
        if (!session) return c.json({ error: 'Unauthorized' }, 401)
        const id = c.req.param('id')

        // Verify access
        const quote = await prisma.quote.findFirst({
            where: { id },
            include: { lead: true }
        })

        if (!quote) {
            return c.json({ error: 'Quote not found' }, 404)
        }

        // Check if user has access to this quote's lead
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
