import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // For Reps, we filter specifically for their ID from the raw tables for precision,
        // but we can also use global views if relevant (e.g. company targets).
        // Using tables for "My Data" to be strictly correct.

        const myLeadsCount = await prisma.lead.count({ where: { assignedToId: session.user.id } });
        const myLeadsByStage = await prisma.lead.groupBy({
            by: ['stage'],
            where: { assignedToId: session.user.id },
            _count: true
        });

        const myActivitiesToday = await prisma.activity.count({
            where: {
                userId: session.user.id,
                date: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0)),
                    lt: new Date(new Date().setHours(23, 59, 59, 999))
                }
            }
        });

        return NextResponse.json({
            leadsCount: myLeadsCount,
            leadsByStage: myLeadsByStage,
            activitiesToday: myActivitiesToday,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Rep Report Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
