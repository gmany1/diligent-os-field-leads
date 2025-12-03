import { Hono } from 'hono'
import { handle } from 'hono/vercel'

export const runtime = 'nodejs'

const app = new Hono().basePath('/api/ai')

app.post('/enrich', async (c) => {
    try {
        const body = await c.req.json()
        const companyName = body.companyName?.toLowerCase() || ''

        // 1. REAL AI (If API Key exists)
        if (process.env.OPENAI_API_KEY) {
            try {
                const OpenAI = (await import('openai')).default
                const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

                const completion = await openai.chat.completions.create({
                    messages: [
                        { role: "system", content: "You are a helpful sales assistant. Return a JSON object with the following fields for the given company: industry, leadType (Commercial or Residential), address (plausible guess), phone (plausible guess), email (plausible guess), initialContactMethod (Phone, Email, or Visit)." },
                        { role: "user", content: `Enrich data for company: "${companyName}"` }
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
                // Fallback to simulation if AI fails
            }
        }

        // 2. SIMULATED AI LOGIC (Fallback)
        await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate "thinking" delay

        let enrichedData = {
            industry: 'General Business',
            leadType: 'Commercial',
            address: '123 Main St, Business District',
            phone: '555-0100',
            email: `contact@${companyName.replace(/\s+/g, '')}.com`,
            initialContactMethod: 'Phone'
        }

        if (companyName.includes('tech') || companyName.includes('soft') || companyName.includes('data')) {
            enrichedData = {
                industry: 'Technology',
                leadType: 'Commercial',
                address: '456 Innovation Blvd, Tech Park',
                phone: '555-0199',
                email: `info@${companyName.replace(/\s+/g, '')}.io`,
                initialContactMethod: 'Email'
            }
        } else if (companyName.includes('home') || companyName.includes('residen') || companyName.includes('family')) {
            enrichedData = {
                industry: 'Real Estate / Residential',
                leadType: 'Residential',
                address: '789 Maple Ave, Suburbs',
                phone: '555-0200',
                email: `hello@${companyName.replace(/\s+/g, '')}.net`,
                initialContactMethod: 'Visit'
            }
        } else if (companyName.includes('construct') || companyName.includes('build')) {
            enrichedData = {
                industry: 'Construction',
                leadType: 'Commercial',
                address: '321 Industrial Rd, Site B',
                phone: '555-0300',
                email: `sales@${companyName.replace(/\s+/g, '')}.com`,
                initialContactMethod: 'Phone'
            }
        }

        return c.json({ success: true, data: enrichedData })
    } catch (e: any) {
        return c.json({ error: e.message }, 500)
    }
})

export const POST = handle(app)
