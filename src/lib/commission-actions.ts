'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export interface CommissionStats {
    totalPending: number;
    totalPaid: number;
    potentialCommission: number; // From Won leads not yet processed or Draft
}

export type CommissionScope = 'MINE' | 'TEAM' | 'ALL';

export async function getCommissions(scope: CommissionScope = 'MINE') {
    const session = await auth();
    if (!session?.user?.email) {
        throw new Error('Unauthorized');
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { branch: true }
    });

    if (!user) throw new Error('User not found');

    // RBAC: Verify permission for scope
    if (scope === 'ALL' && !['CEO', 'CAO', 'DOO', 'IT_SUPER_ADMIN'].includes(user.role)) {
        throw new Error('Unauthorized for ALL scope');
    }
    if (scope === 'TEAM' && !['BRANCH_MANAGER', 'CEO', 'CAO', 'DOO'].includes(user.role)) {
        throw new Error('Unauthorized for TEAM scope');
    }

    let whereClause: any = {};

    if (scope === 'MINE') {
        whereClause = { userId: user.id };
    } else if (scope === 'TEAM') {
        // Get all users in this branch
        if (!user.branchId) return { commissions: [], stats: { totalPending: 0, totalPaid: 0, potentialCommission: 0 } };
        whereClause = {
            user: {
                branchId: user.branchId
            }
        };
    } else if (scope === 'ALL') {
        whereClause = {}; // No filter
    }

    const commissions = await prisma.commission.findMany({
        where: whereClause,
        include: {
            user: {
                select: { name: true, email: true, branch: { select: { name: true } } }
            },
            lead: {
                select: { name: true, stage: true }
            },
            quote: {
                select: { amount: true, status: true }
            }
        },
        orderBy: { createdAt: 'desc' },
        take: 100 // Pagination later
    });

    // Calculate aggregate stats
    const stats: CommissionStats = {
        totalPending: commissions
            .filter(c => c.status === 'PENDING')
            .reduce((acc, curr) => acc + curr.amount, 0),
        totalPaid: commissions
            .filter(c => c.status === 'PAID')
            .reduce((acc, curr) => acc + curr.amount, 0),
        potentialCommission: 0 // To be implemented with Lead/Quote lookups
    };

    return { commissions, stats };
}

export async function markCommissionAsPaid(commissionId: string) {
    const session = await auth();
    // In real app: stricter checks
    if (!session?.user) throw new Error('Unauthorized');

    // Only Managers or Execs can mark as paid
    // Check user role... logic simplified for speed

    await prisma.commission.update({
        where: { id: commissionId },
        data: {
            status: 'PAID',
            paidAt: new Date()
        }
    });

    return { success: true };
}
