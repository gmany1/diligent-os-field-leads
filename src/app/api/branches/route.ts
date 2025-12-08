import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const branches = await prisma.branch.findMany({
            where: { status: 'ACTIVE' },
            select: {
                id: true,
                name: true,
                code: true,
                city: true,
                state: true,
                status: true,
                _count: {
                    select: {
                        users: true,
                        leads: true
                    }
                }
            },
            orderBy: { name: 'asc' }
        });

        // Enrich with calculated stats (Revenue, Health)
        // In a clear scalable app, this would be a separate aggregation query.
        const enhancedBranches = await Promise.all(branches.map(async (b) => {
            const leadsWon = await prisma.lead.count({
                where: { branchId: b.id, stage: 'WON' }
            });

            // Mock Revenue Calculation: $1500 avg per closed deal
            const revenue = leadsWon * 1500;

            // Health Score: Simple heuristic
            // Base 60 + points for users and revenue
            const healthScore = Math.min(100, 60 + (b._count.users * 2) + (leadsWon * 5));

            return {
                ...b,
                stats: {
                    revenue,
                    leadsWon,
                    healthScore
                }
            };
        }));

        return NextResponse.json(enhancedBranches);
    } catch (error) {
        console.error('Error fetching branches:', error);
        return NextResponse.json({ error: 'Failed to fetch branches' }, { status: 500 });
    }
}
