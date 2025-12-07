import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
    const session = await auth();
    if (!session || !['IT_SUPER_ADMIN', 'CEO'].includes(session.user?.role || '')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Database stats
        const totalUsers = await prisma.user.count();
        const totalLeads = await prisma.lead.count();
        const totalActivities = await prisma.activity.count();
        const totalQuotes = await prisma.quote.count();
        const totalCommissions = await prisma.commission.count();
        const totalAuditLogs = await prisma.auditLog.count();

        // Recent audit logs
        const recentAudits = await prisma.auditLog.findMany({
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

        // User activity (last 24 hours)
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);

        const activeUsers = await prisma.auditLog.groupBy({
            by: ['userId'],
            where: {
                createdAt: {
                    gte: oneDayAgo
                }
            },
            _count: {
                id: true
            }
        });

        // System health metrics
        const failedLogins = await prisma.auditLog.count({
            where: {
                action: 'LOGIN_FAILED',
                createdAt: {
                    gte: oneDayAgo
                }
            }
        });

        // Data growth (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const newLeads = await prisma.lead.count({
            where: {
                createdAt: {
                    gte: sevenDaysAgo
                }
            }
        });

        const newUsers = await prisma.user.count({
            where: {
                createdAt: {
                    gte: sevenDaysAgo
                }
            }
        });

        return NextResponse.json({
            database: {
                totalUsers,
                totalLeads,
                totalActivities,
                totalQuotes,
                totalCommissions,
                totalAuditLogs
            },
            activity: {
                activeUsers24h: activeUsers.length,
                failedLogins24h: failedLogins,
                newLeads7d: newLeads,
                newUsers7d: newUsers
            },
            recentAudits,
            systemHealth: {
                status: 'healthy',
                uptime: process.uptime(),
                memoryUsage: process.memoryUsage()
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('IT Report Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}
