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
        const ccpaStats: any[] = await prisma.$queryRaw`SELECT * FROM vw_ccpa_activity`;

        return NextResponse.json({
            ccpaActivity: ccpaStats,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Compliance Report Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
