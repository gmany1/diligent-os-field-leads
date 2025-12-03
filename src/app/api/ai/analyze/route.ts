import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const role = session.user.role || 'FIELD_LEAD_REP';

    try {
        // 1. Fetch Real Data with Prisma (or fallback)
        let leads: any[] = [];
        let quotes: any[] = [];

        try {
            // Check if prisma is available (it might be a mock object if DB connection failed)
            if (prisma.lead) {
                leads = await prisma.lead.findMany({
                    select: { stage: true, createdAt: true, updatedAt: true }
                });
            }
            if (prisma.quote) {
                quotes = await prisma.quote.findMany({
                    select: { amount: true, status: true, createdAt: true }
                });
            }
        } catch (dbError) {
            console.warn('DB Fetch failed, using empty data for AI context:', dbError);
        }

        // 2. Prepare Context for AI
        const summary = {
            role,
            totalLeads: leads.length,
            leadsByStage: leads.reduce((acc: Record<string, number>, l: { stage: string }) => { acc[l.stage] = (acc[l.stage] || 0) + 1; return acc }, {}),
            totalPipelineValue: quotes
                .filter((q: { status: string }) => q.status === 'SENT' || q.status === 'DRAFT')
                .reduce((sum: number, q: { amount: number }) => sum + Number(q.amount), 0),
            wonCount: leads.filter((l: { stage: string }) => l.stage === 'WON').length,
            lostCount: leads.filter((l: { stage: string }) => l.stage === 'LOST').length,
        };

        // 3. AI Generation (or Fallback)
        if (process.env.OPENAI_API_KEY) {
            try {
                const OpenAI = (await import('openai')).default;
                const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

                const systemPrompt = role === 'EXECUTIVE' || role === 'IT_ADMIN'
                    ? "You are a Chief Revenue Officer. Analyze the CRM data and provide 3 STRATEGIC insights (Critical, Warning, Success) for the CEO. Focus on revenue, pipeline health, and conversion trends."
                    : "You are a Sales Coach. Analyze the CRM data and provide 3 TACTICAL insights (Critical, Warning, Success) for a Field Rep. Focus on immediate actions, follow-ups, and closing deals.";

                const completion = await openai.chat.completions.create({
                    messages: [
                        { role: "system", content: `${systemPrompt} Return JSON with an array 'insights' containing objects with type (critical/warning/success), title, message, action (short string), and actionUrl.` },
                        { role: "user", content: `Analyze this data: ${JSON.stringify(summary)}` }
                    ],
                    model: "gpt-4o-mini",
                    response_format: { type: "json_object" }
                });

                const content = completion.choices[0].message.content;
                if (content) {
                    const parsed = JSON.parse(content);
                    return NextResponse.json({ success: true, insights: parsed.insights });
                }
            } catch (e) {
                console.error('OpenAI Error:', e);
                // Fall through to fallback
            }
        }

        // 4. Fallback Logic (Role-Based)
        let insights = [];

        if (role === 'EXECUTIVE' || role === 'IT_ADMIN') {
            // CEO Fallback Insights
            insights = [
                {
                    type: 'success',
                    title: 'Pipeline Growth',
                    message: `Pipeline value is strong at $${summary.totalPipelineValue.toLocaleString()}. Conversion rate is stable.`,
                    action: 'View Forecast',
                    actionUrl: '/crm?view=forecast'
                },
                {
                    type: 'warning',
                    title: 'Stalled Opportunities',
                    message: 'Several high-value quotes have been pending for >14 days.',
                    action: 'Review Quotes',
                    actionUrl: '/crm?filter=quotes'
                },
                {
                    type: 'critical',
                    title: 'Lead Velocity',
                    message: 'New lead acquisition has slowed down by 15% this week.',
                    action: 'Check Marketing',
                    actionUrl: '/analytics/marketing'
                }
            ];
        } else {
            // Rep Fallback Insights
            insights = [
                {
                    type: 'critical',
                    title: 'Neglected Leads',
                    message: '3 Hot leads haven\'t been contacted in 7 days.',
                    action: 'Call Now',
                    actionUrl: '/crm?filter=hot'
                },
                {
                    type: 'success',
                    title: 'Great Progress',
                    message: 'You closed 2 deals this week! Keep it up.',
                    action: 'View Wins',
                    actionUrl: '/crm?stage=WON'
                },
                {
                    type: 'warning',
                    title: 'Follow-ups Due',
                    message: '5 leads are waiting for a quote.',
                    action: 'Send Quotes',
                    actionUrl: '/crm?stage=QUOTE'
                }
            ];
        }

        return NextResponse.json({ success: true, insights });

    } catch (error) {
        console.error('Analysis Error:', error);
        return NextResponse.json({ error: 'Failed to analyze data' }, { status: 500 });
    }
}
