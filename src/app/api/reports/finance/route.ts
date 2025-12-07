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
        // Total revenue from accepted quotes
        const acceptedQuotes = await prisma.quote.findMany({
            where: { status: 'ACCEPTED' }
        });

        const totalRevenue = acceptedQuotes.reduce((sum, q) => sum + Number(q.amount), 0);

        // Total commissions
        const allCommissions = await prisma.commission.findMany();
        const totalCommissions = allCommissions.reduce((sum, c) => sum + Number(c.amount), 0);
        const paidCommissions = allCommissions.filter(c => c.status === 'PAID').reduce((sum, c) => sum + Number(c.amount), 0);
        const pendingCommissions = totalCommissions - paidCommissions;

        // Revenue by month (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const revenueByMonth = await prisma.quote.groupBy({
            by: ['createdAt'],
            where: {
                status: 'ACCEPTED',
                createdAt: {
                    gte: sixMonthsAgo
                }
            },
            _sum: {
                amount: true
            }
        });

        // Top performing branches
        const branchPerformance = await prisma.branch.findMany({
            include: {
                leads: {
                    where: {
                        stage: 'WON'
                    },
                    include: {
                        quotes: {
                            where: {
                                status: 'ACCEPTED'
                            }
                        }
                    }
                }
            }
        });

        const branchStats = branchPerformance.map(branch => {
            const revenue = branch.leads.reduce((sum, lead) => {
                const leadRevenue = lead.quotes.reduce((qSum, quote) => qSum + Number(quote.amount), 0);
                return sum + leadRevenue;
            }, 0);

            return {
                branchName: branch.name,
                wonLeads: branch.leads.length,
                revenue
            };
        }).sort((a, b) => b.revenue - a.revenue);

        return NextResponse.json({
            summary: {
                totalRevenue,
                totalCommissions,
                paidCommissions,
                pendingCommissions,
                profitMargin: totalRevenue > 0 ? ((totalRevenue - totalCommissions) / totalRevenue * 100).toFixed(2) : '0.00'
            },
            revenueByMonth,
            branchPerformance: branchStats,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Finance Report Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}
