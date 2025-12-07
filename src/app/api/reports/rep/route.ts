import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
    const session = await auth();
    if (!session || !['STAFFING_REP', 'SALES_REP', 'BRANCH_MANAGER', 'CEO', 'CAO', 'DOO', 'IT_SUPER_ADMIN'].includes(session.user?.role || '')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const userId = session.user.id;

        // My leads
        const myLeads = await prisma.lead.count({
            where: { assignedToId: userId }
        });

        // My activities today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const todayActivities = await prisma.activity.count({
            where: {
                userId,
                date: {
                    gte: today,
                    lt: tomorrow
                }
            }
        });

        // My quotes
        const myQuotes = await prisma.quote.count({
            where: { createdById: userId }
        });

        // My commissions
        const myCommissions = await prisma.commission.findMany({
            where: { userId }
        });

        const totalCommissions = myCommissions.reduce((sum, c) => sum + Number(c.amount), 0);
        const pendingCommissions = myCommissions.filter(c => c.status === 'PENDING').reduce((sum, c) => sum + Number(c.amount), 0);

        // Pipeline by stage
        const pipeline = await prisma.lead.groupBy({
            by: ['stage'],
            where: { assignedToId: userId },
            _count: { id: true }
        });

        const pipelineStats = pipeline.map(p => ({
            stage: p.stage,
            count: p._count.id
        }));

        // Recent activities
        const recentActivities = await prisma.activity.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 5,
            include: {
                lead: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        return NextResponse.json({
            stats: {
                myLeads,
                todayActivities,
                myQuotes,
                totalCommissions,
                pendingCommissions
            },
            pipeline: pipelineStats,
            recentActivities,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Rep Report Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}
