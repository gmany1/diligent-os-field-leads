import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import * as fs from 'fs/promises'
import * as path from 'path'

export const runtime = 'nodejs'

const DB_PATH = path.join(process.cwd(), 'data', 'db.json')

async function readDb() {
    try {
        const data = await fs.readFile(DB_PATH, 'utf-8')
        return JSON.parse(data)
    } catch (error) {
        console.error('Error reading DB:', error)
        return { leads: [], users: [] }
    }
}

const app = new Hono().basePath('/api/dashboard')

app.get('/stats', async (c) => {
    try {
        const db = await readDb()
        const leads = db.leads || []
        const users = db.users || []

        const role = c.req.query('role')
        const userId = c.req.query('userId')

        // Filter leads based on role/user if needed
        let filteredLeads = leads
        if (role === 'FIELD_LEAD_REP' && userId) {
            // In a real app, we'd filter by assignedTo. For now, we might mock or just return all for demo if userId isn't strictly linked.
            // But let's try to be somewhat realistic if we have data.
            // filteredLeads = leads.filter((l: any) => l.assignedTo === userId)
        }

        // Calculate Stats
        const wonLeads = filteredLeads.filter((l: any) => l.stage === 'WON' || l.status === 'WON')
        const activeLeads = filteredLeads.filter((l: any) => ['WARM', 'HOT', 'QUOTE', 'NEGOTIATION'].includes(l.stage || l.status))
        const lostLeads = filteredLeads.filter((l: any) => l.stage === 'LOST' || l.status === 'LOST')

        const revenue = wonLeads.reduce((sum: number, l: any) => sum + (Number(l.value) || 0), 0)
        const pipeline = activeLeads.reduce((sum: number, l: any) => sum + (Number(l.value) || 0), 0)

        const totalClosed = wonLeads.length + lostLeads.length
        const conversionRate = totalClosed > 0 ? (wonLeads.length / totalClosed) * 100 : 0

        // Calculate Average Margin (if available)
        const leadsWithMargin = wonLeads.filter((l: any) => l.margin)
        const avgMargin = leadsWithMargin.length > 0
            ? leadsWithMargin.reduce((sum: number, l: any) => sum + Number(l.margin), 0) / leadsWithMargin.length
            : 0

        return c.json({
            success: true,
            data: {
                revenue,
                pipeline,
                conversionRate: parseFloat(conversionRate.toFixed(1)),
                avgMargin: parseFloat(avgMargin.toFixed(1)),
                activeLeadsCount: activeLeads.length,
                wonLeadsCount: wonLeads.length,
                totalLeads: leads.length,
                totalUsers: users.length,
                users: users.map((u: any) => ({ id: u.id, name: u.name, email: u.email, role: u.role })) // Return safe user data
            }
        })
    } catch (e: any) {
        return c.json({ error: e.message }, 500)
    }
})

export const GET = handle(app)
