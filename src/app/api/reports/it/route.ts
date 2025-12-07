import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
    const session = await auth();
    if (!session || !['EXECUTIVE', 'IT_ADMIN'].includes(session.user?.role || '')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const systemHealth: any[] = await prisma.$queryRaw`SELECT * FROM vw_system_health`;
        // Also get DB metrics if possible, or simple count
        const totalAuditLogs = await prisma.auditLog.count();

        return NextResponse.json({
            health: systemHealth[0] || {},
            totalAuditLogs,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('IT Report Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
