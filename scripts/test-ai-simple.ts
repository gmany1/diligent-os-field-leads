
import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';

const prisma = new PrismaClient();

async function main() {
    console.log('START_TEST');
    try {
        const leadCount = await prisma.lead.count();
        const userCount = await prisma.user.count();
        console.log(`METRICS: ${leadCount} leads, ${userCount} users`);

        if (!process.env.OPENAI_API_KEY) {
            console.log('NO_API_KEY');
            return;
        }

        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: "You are a Senior Software Architect. Suggest 3 improvements. Return JSON with 'suggestions' array [{title, description, priority}]." },
                { role: "user", content: `Metrics: ${leadCount} leads, ${userCount} users. Stack: Next.js 16.` }
            ],
            model: "gpt-4o-mini",
            response_format: { type: "json_object" }
        });

        console.log('AI_RESPONSE:', completion.choices[0].message.content);

    } catch (error) {
        console.error('ERROR:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
