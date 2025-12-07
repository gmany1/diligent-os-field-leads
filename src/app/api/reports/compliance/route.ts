import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
    const session = await auth();
    if (!session || !['CEO', 'CAO', 'DOO', 'IT_SUPER_ADMIN'].includes(session.user?.role || '')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Total audit logs
        const totalAudits = await prisma.auditLog.count();

        // Audits by action type
        const auditsByAction = await prisma.auditLog.groupBy({
            by: ['action'],
            _count: {
                id: true
            }
        });

        const actionStats = auditsByAction.map(a => ({
            action: a.action,
            count: a._count.id
        }));

        // CCPA actions
        const ccpaExports = await prisma.auditLog.count({
            where: { action: 'CCPA_EXPORT' }
        });

        const ccpaDeletes = await prisma.auditLog.count({
            where: {
                action: {
                    in: ['CCPA_DELETE_SOFT', 'CCPA_DELETE_HARD']
                }
            }
        });

        // Recent CCPA actions
        const recentCCPA = await prisma.auditLog.findMany({
            where: {
                action: {
                    in: ['CCPA_EXPORT', 'CCPA_DELETE_SOFT', 'CCPA_DELETE_HARD']
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 10,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        // PII access logs (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const piiAccess = await prisma.auditLog.count({
            where: {
                entity: 'LEAD',
                action: {
                    in: ['READ', 'UPDATE', 'EXPORT']
                },
                createdAt: {
                    gte: thirtyDaysAgo
                }
            }
        });

        // Data retention stats
        const oldLeads = await prisma.lead.count({
            where: {
                updatedAt: {
                    lt: thirtyDaysAgo
                }
            }
        });

        // Users with access to PII
        const usersWithPIIAccess = await prisma.user.count({
            where: {
                role: {
                    in: ['CEO', 'CAO', 'DOO', 'IT_SUPER_ADMIN', 'BRANCH_MANAGER', 'STAFFING_REP', 'SALES_REP']
                }
            }
        });

        return NextResponse.json({
            summary: {
                totalAudits,
                ccpaExports,
                ccpaDeletes,
                piiAccess30d: piiAccess,
                usersWithPIIAccess
            },
            auditsByAction: actionStats,
            recentCCPA,
            dataRetention: {
                oldLeads,
                retentionPeriodDays: 365
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Compliance Report Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}
