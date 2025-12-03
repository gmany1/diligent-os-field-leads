import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        // For now, just return latest activities for the user's leads
        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user) return NextResponse.json({ activities: [] });

        const activities = await prisma.activity.findMany({
            where: {
                lead: {
                    assignedToId: user.id
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 10,
            include: {
                lead: {
                    select: { name: true }
                }
            }
        });

        return NextResponse.json(activities);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
    }
}
