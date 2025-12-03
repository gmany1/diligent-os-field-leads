
import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Testing AI System Architect Logic ---');

    try {
        // 1. Gather Context
        const leadCount = await prisma.lead.count();
        const userCount = await prisma.user.count();
        console.log(`Context: ${leadCount} leads, ${userCount} users.`);

        // 2. Check API Key
        if (!process.env.OPENAI_API_KEY) {
            console.log('❌ OPENAI_API_KEY not found in environment.');
            return;
        }

        // 3. Call OpenAI
        console.log('🤖 Asking AI Architect for suggestions...');
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: "You are a Senior Software Architect for a CRM system. Analyze the metrics and suggest 3 technical or product improvements. Return JSON with 'suggestions' array [{title, description, priority}]." },
                { role: "user", content: `System Metrics: ${leadCount} leads, ${userCount} users. Database: SQLite. Stack: Next.js 16. Recent Errors: 0.` }
            ],
            model: "gpt-4o-mini",
            response_format: { type: "json_object" }
        });

        const content = completion.choices[0].message.content;
        const result = JSON.parse(content || '{}');

        console.log('\n--- AI Suggestions ---');
        result.suggestions.forEach((s: any, i: number) => {
            console.log(`${i + 1}. [${s.priority}] ${s.title}`);
            console.log(`   ${s.description}`);
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
