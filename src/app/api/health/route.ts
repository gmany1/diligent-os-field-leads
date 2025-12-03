import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const start = Date.now();

        // 1. Check Database
        let dbStatus = 'healthy';
        let dbLatency = 0;
        try {
            await prisma.$queryRaw`SELECT 1`;
            dbLatency = Date.now() - start;
        } catch (e) {
            dbStatus = 'unhealthy';
            console.error('Health Check DB Error:', e);
        }

        // 2. Check Memory Usage
        const memoryUsage = process.memoryUsage();
        const memoryUsedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);

        // 3. Uptime
        const uptime = process.uptime();

        // 4. Check OpenAI API (Optional but recommended)
        let aiStatus = 'unknown';
        if (process.env.OPENAI_API_KEY) {
            try {
                // Simple model list check to verify key and connectivity
                const OpenAI = (await import('openai')).default;
                const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
                await openai.models.list();
                aiStatus = 'healthy';
            } catch (e) {
                aiStatus = 'degraded';
                console.error('Health Check AI Error:', e);
            }
        } else {
            aiStatus = 'missing_key';
        }

        return NextResponse.json({
            status: dbStatus === 'healthy' ? 'healthy' : 'degraded',
            timestamp: new Date().toISOString(),
            checks: {
                database: {
                    status: dbStatus,
                    latency: `${dbLatency}ms`
                },
                memory: {
                    status: memoryUsedMB < 500 ? 'healthy' : 'warning',
                    used: `${memoryUsedMB}MB`
                },
                uptime: {
                    status: 'healthy',
                    seconds: Math.round(uptime)
                },
                ai: {
                    status: aiStatus
                }
            }
        });
    } catch (error) {
        return NextResponse.json({
            status: 'unhealthy',
            error: 'Internal Health Check Error'
        }, { status: 500 });
    }
}
