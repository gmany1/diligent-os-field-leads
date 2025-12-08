import { prisma } from '@/lib/prisma';
import { log } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET() {
    const checks = {
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        database: 'unknown',
        healthy: false,
    };

    try {
        // Check Database connection
        await prisma.$queryRaw`SELECT 1`;
        checks.database = 'connected';
        checks.healthy = true;
    } catch (e) {
        checks.database = 'disconnected';
        checks.healthy = false;
        log.error('Health Check Failed', e);

        return Response.json(checks, { status: 503 });
    }

    return Response.json(checks, { status: 200 });
}
