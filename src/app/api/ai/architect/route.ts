import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        // 1. Gather System Context
        const leadCount = await prisma.lead.count();
        const userCount = await prisma.user.count();
        const recentErrors = 0; // Placeholder for real error log count

        // 2. Call AI
        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json({
                suggestions: [
                    { title: "Configure OpenAI", description: "Add OPENAI_API_KEY to .env to enable smart suggestions.", priority: "HIGH" },
                    { title: "Database Backup", description: "Schedule daily backups for your SQLite database.", priority: "MEDIUM" }
                ]
            });
        }

        const OpenAI = (await import('openai')).default;
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: "You are a Senior Software Architect for a CRM system. Analyze the metrics and suggest 3 technical or product improvements. Return JSON with 'suggestions' array [{title, description, priority}]." },
                { role: "user", content: `System Metrics: ${leadCount} leads, ${userCount} users. Database: SQLite. Stack: Next.js 16. Recent Errors: ${recentErrors}.` }
            ],
            model: "gpt-4o-mini",
            response_format: { type: "json_object" }
        });

        const content = completion.choices[0].message.content;
        return NextResponse.json(JSON.parse(content || '{}'));

    } catch (error) {
        console.error('AI Architect Error:', error);
        return NextResponse.json({ error: 'Failed to generate suggestions' }, { status: 500 });
    }
}
