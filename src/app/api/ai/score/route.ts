import { Hono } from 'hono'
import { handle } from 'hono/vercel'

export const runtime = 'nodejs'

const app = new Hono().basePath('/api/ai')

app.post('/score', async (c) => {
    try {
        const body = await c.req.json()
        const lead = body.lead

        if (!lead) {
            return c.json({ error: 'Lead data is required' }, 400)
        }

        // 1. REAL AI (If API Key exists)
        if (process.env.OPENAI_API_KEY) {
            try {
                const OpenAI = (await import('openai')).default
                const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

                const completion = await openai.chat.completions.create({
                    messages: [
                        { role: "system", content: "You are a sales expert. Score this lead from 0-100 based on likelihood to close. Return JSON with 'score' (number) and 'reason' (short string)." },
                        { role: "user", content: `Score this lead: ${JSON.stringify(lead)}` }
                    ],
                    model: "gpt-4o-mini",
                    response_format: { type: "json_object" }
                })

                const content = completion.choices[0].message.content
                if (content) {
                    return c.json({ success: true, data: JSON.parse(content) })
                }
            } catch (aiError) {
                console.error('OpenAI Error:', aiError)
            }
        }

        // 2. SIMULATED LOGIC (Fallback)
        let score = 50
        let reason = "Standard lead."

        if (lead.industry?.toLowerCase().includes('tech')) score += 20
        if (lead.industry?.toLowerCase().includes('medical')) score += 15
        if (lead.status === 'HOT') score += 30
        if (lead.status === 'WARM') score += 15
        if (!lead.email) score -= 10

        score = Math.min(100, Math.max(0, score))

        return c.json({
            success: true,
            data: {
                score,
                reason: "Calculated based on industry and completeness (Simulated)."
            }
        })

    } catch (e: any) {
        return c.json({ error: e.message }, 500)
    }
})

export const POST = handle(app)
