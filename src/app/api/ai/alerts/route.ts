import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
    const session = await auth();
    if (!session || !['CEO', 'CAO', 'DOO', 'IT_SUPER_ADMIN', 'BRANCH_MANAGER'].includes(session.user?.role || '')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const alerts = [];

        // 1. Stalled leads (no activity in 7+ days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const stalledLeads = await prisma.lead.findMany({
            where: {
                stage: {
                    in: ['HOT', 'WARM', 'QUOTE']
                },
                updatedAt: {
                    lt: sevenDaysAgo
                }
            },
            include: {
                assignedTo: {
                    select: {
                        name: true,
                        email: true
                    }
                },
                branch: {
                    select: {
                        name: true
                    }
                }
            },
            take: 10
        });

        stalledLeads.forEach(lead => {
            alerts.push({
                id: `stalled-${lead.id}`,
                type: 'STALLED_LEAD',
                severity: 'HIGH',
                title: `Stalled Lead: ${lead.name}`,
                description: `No activity for ${Math.floor((Date.now() - lead.updatedAt.getTime()) / (1000 * 60 * 60 * 24))} days`,
                leadId: lead.id,
                leadName: lead.name,
                assignedTo: lead.assignedTo?.name || 'Unassigned',
                branch: lead.branch?.name || 'No branch',
                createdAt: lead.updatedAt
            });
        });

        // 2. Quotes pending for too long (7+ days)
        const pendingQuotes = await prisma.quote.findMany({
            where: {
                status: 'SENT',
                createdAt: {
                    lt: sevenDaysAgo
                }
            },
            include: {
                lead: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                createdBy: {
                    select: {
                        name: true
                    }
                }
            },
            take: 10
        });

        pendingQuotes.forEach(quote => {
            alerts.push({
                id: `quote-${quote.id}`,
                type: 'PENDING_QUOTE',
                severity: 'MEDIUM',
                title: `Pending Quote: ${quote.lead.name}`,
                description: `Quote sent ${Math.floor((Date.now() - quote.createdAt.getTime()) / (1000 * 60 * 60 * 24))} days ago, no response`,
                leadId: quote.leadId,
                leadName: quote.lead.name,
                amount: quote.amount,
                createdBy: quote.createdBy?.name || 'Unknown',
                createdAt: quote.createdAt
            });
        });

        // 3. High-value leads without quotes (HOT stage, 30+ days old)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const hotLeadsNoQuote = await prisma.lead.findMany({
            where: {
                stage: 'HOT',
                createdAt: {
                    lt: thirtyDaysAgo
                },
                quotes: {
                    none: {}
                }
            },
            include: {
                assignedTo: {
                    select: {
                        name: true
                    }
                },
                branch: {
                    select: {
                        name: true
                    }
                }
            },
            take: 10
        });

        hotLeadsNoQuote.forEach(lead => {
            alerts.push({
                id: `no-quote-${lead.id}`,
                type: 'NO_QUOTE',
                severity: 'HIGH',
                title: `Hot Lead Without Quote: ${lead.name}`,
                description: `Lead has been HOT for ${Math.floor((Date.now() - lead.createdAt.getTime()) / (1000 * 60 * 60 * 24))} days without a quote`,
                leadId: lead.id,
                leadName: lead.name,
                assignedTo: lead.assignedTo?.name || 'Unassigned',
                branch: lead.branch?.name || 'No branch',
                createdAt: lead.createdAt
            });
        });

        // 4. Unpaid commissions (older than 30 days)
        const unpaidCommissions = await prisma.commission.findMany({
            where: {
                status: 'PENDING',
                createdAt: {
                    lt: thirtyDaysAgo
                }
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                },
                lead: {
                    select: {
                        name: true
                    }
                }
            },
            take: 10
        });

        unpaidCommissions.forEach(commission => {
            alerts.push({
                id: `commission-${commission.id}`,
                type: 'UNPAID_COMMISSION',
                severity: 'MEDIUM',
                title: `Unpaid Commission: ${commission.user.name}`,
                description: `Commission of $${commission.amount} pending for ${Math.floor((Date.now() - commission.createdAt.getTime()) / (1000 * 60 * 60 * 24))} days`,
                userId: commission.userId,
                userName: commission.user.name,
                amount: commission.amount,
                leadName: commission.lead?.name || 'Unknown',
                createdAt: commission.createdAt
            });
        });

        // Sort by severity and date
        const severityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
        alerts.sort((a, b) => {
            if (severityOrder[a.severity] !== severityOrder[b.severity]) {
                return severityOrder[a.severity] - severityOrder[b.severity];
            }
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        return NextResponse.json({
            data: alerts,
            summary: {
                total: alerts.length,
                high: alerts.filter(a => a.severity === 'HIGH').length,
                medium: alerts.filter(a => a.severity === 'MEDIUM').length,
                low: alerts.filter(a => a.severity === 'LOW').length
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('AI Alerts Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}
