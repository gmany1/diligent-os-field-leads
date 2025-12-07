import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

// Helper for Scope (Duplicate of route.ts logic for now, or move to lib shared)
function getManagerScope(session: any) {
    const role = session.user.role;
    const branchId = (session.user as any).branchId;

    if (role === 'BRANCH_MANAGER' || role === 'MANAGER') {
        // Strict Branch Scoping
        return branchId ? { branchId } : { branchId: 'NONE' };
    }
    // If Executive/Admin viewing this endpoint, show all? 
    // Usually Manager Endpoint is for Managers. If Executive views it, maybe show all or ask for param.
    // Let's assume this endpoint returns data *for the user's scope*.
    if (['CEO', 'AREA_DIRECTOR', 'CAO', 'DOO', 'IT_SUPER_ADMIN', 'EXECUTIVE', 'IT_ADMIN'].includes(role)) {
        return {}; // See all
    }
    return { id: 'NONE' }; // Others deny
}

export async function GET() {
    const session = await auth();
    if (!session || !['EXECUTIVE', 'IT_ADMIN', 'MANAGER', 'BRANCH_MANAGER', 'CEO', 'AREA_DIRECTOR', 'CAO', 'DOO', 'IT_SUPER_ADMIN'].includes(session.user?.role || '')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const scope = getManagerScope(session);

        // 1. Activity Stats (Users in Branch)
        // Find users in scope first? Or filter Activity by user.branchId
        // Activity -> User -> Branch
        // Prisma: activity.groupBy({ by: ['type'], where: { user: scope } })

        // Note: scope is { branchId: '...' }. User has branchId.
        const activityStats = await prisma.activity.groupBy({
            by: ['type'],
            where: {
                user: scope // user: { branchId: '...' }
            },
            _count: { id: true }
        });

        // Format for frontend (matches view output structure roughly: type, count)
        const formattedActivity = activityStats.map(stat => ({
            type: stat.type,
            count: Number(stat._count.id), // BigInt handling
            user_name: 'Branch Aggregate' // grouped
        }));

        // 2. Pipeline Summary (Leads in Branch)
        const pipelineStats = await prisma.lead.groupBy({
            by: ['stage'],
            where: scope, // { branchId: '...' }
            _count: { _all: true }
        });

        const formattedPipeline = pipelineStats.map(stat => ({
            stage: stat.stage,
            count: Number(stat._count._all),
            value: 'Unknown'
        }));

        return NextResponse.json({
            activity: formattedActivity,
            pipeline: formattedPipeline,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Manager Report Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
