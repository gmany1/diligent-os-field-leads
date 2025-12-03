import { Hono } from 'hono'
import { handle } from 'hono/vercel'

export const runtime = 'nodejs'

const app = new Hono().basePath('/api/ai')

app.post('/email', async (c) => {
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
                        { role: "system", content: "You are a sales copywriter. Write a short, punchy cold email to this lead. Return JSON with 'subject' and 'body'." },
                        { role: "user", content: `Write email for: ${JSON.stringify(lead)}` }
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
        return c.json({
            success: true,
            data: {
                subject: `Opportunity for ${lead.name}`,
                body: `Hi,\n\nI noticed ${lead.name} is doing great work in the ${lead.industry || 'industry'} space. I'd love to chat about how we can help you grow.\n\nBest,\n[Your Name]`
            }
        })

    } catch (e: any) {
        return c.json({ error: e.message }, 500)
    }
})

export const POST = handle(app)
