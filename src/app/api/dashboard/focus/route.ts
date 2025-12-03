import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user) return NextResponse.json({ leads: [] });

        // Logic: Find leads assigned to this user that are HOT or WARM
        // and sort by last update (oldest first = neglected leads)
        const priorityLeads = await prisma.lead.findMany({
            where: {
                assignedToId: user.id,
                stage: { in: ['HOT', 'WARM', 'QUOTE'] }
            },
            orderBy: { updatedAt: 'asc' },
            take: 5,
            select: {
                id: true,
                name: true,
                stage: true,
                phone: true,
                updatedAt: true
            }
        });

        return NextResponse.json({ leads: priorityLeads });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch focus leads' }, { status: 500 });
    }
}
