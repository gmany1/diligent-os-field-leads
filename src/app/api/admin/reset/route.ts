import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import * as fs from 'fs/promises'
import * as path from 'path'

export const runtime = 'nodejs'

const DB_PATH = path.join(process.cwd(), 'data', 'db.json')

const app = new Hono().basePath('/api/admin/reset')

const resetHandler = async (c: any) => {
    try {
        // Read current DB to get counts
        const currentDbRaw = await fs.readFile(DB_PATH, 'utf-8')
        const currentDb = JSON.parse(currentDbRaw)

        const deletedCounts = {
            leads: currentDb.leads?.length || 0,
            quotes: currentDb.quotes?.length || 0,
            activities: currentDb.activities?.length || 0
        }

        // Reset DB to initial state
        const initialDb = {
            users: [
                {
                    id: "user_field_rep_1",
                    name: "Field Rep",
                    email: "rep@diligentos.com",
                    role: "FIELD_REP"
                },
                {
                    id: "user_admin_1",
                    name: "IT Admin",
                    email: "admin@diligentos.com",
                    role: "IT_ADMIN"
                }
            ],
            leads: [],
            quotes: [],
            activities: [],
            commissions: [],
            commissionRules: {
                "standard": {
                    "rate": 0.10,
                    "description": "Standard 10% commission on all sales"
                }
            }
        }

        await fs.writeFile(DB_PATH, JSON.stringify(initialDb, null, 2), 'utf-8')

        return c.json({
            success: true,
            message: 'Database reset successfully',
            deletedCounts
        })
    } catch (e: any) {
        console.error('RESET ERROR:', e)
        return c.json({ error: e.message }, 500)
    }
}

app.delete('/', resetHandler)
app.delete('', resetHandler)

export const DELETE = handle(app)
