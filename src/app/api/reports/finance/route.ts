import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
    const session = await auth();
    if (!session || !['EXECUTIVE', 'IT_ADMIN'].includes(session.user?.role || '')) {
        // Assuming Finance role doesn't exist yet, so IT/Exec view it
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const commissionStats: any[] = await prisma.$queryRaw`SELECT * FROM vw_commissions_summary`;

        return NextResponse.json({
            commissions: commissionStats,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Finance Report Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
