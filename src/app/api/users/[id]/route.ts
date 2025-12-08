import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        // Fetch User with deeply nested relations for the "Nexus" view
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                branch: true,
                documents: true, // Fetch documents
                _count: {
                    select: {
                        leads: true,
                        // defined in schema? usually yes if user relation exists on Lead
                    }
                }
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Calculate Stats (Mocking logic where real aggregation queries would be complex)
        // In real app: count leads by status='WON', calculate conversion rate
        const totalLeads = user._count.leads || 0;
        const leadsWon = await prisma.lead.count({
            where: { assignedToId: id, stage: 'WON' }
        });

        const conversionRate = totalLeads > 0 ? ((leadsWon / totalLeads) * 100).toFixed(1) : '0.0';

        // Fetch recent Audit Logs for this user (Actions they performed)
        // Assuming AuditLog model has 'userId' field
        let recentActivity: any[] = [];
        try {
            recentActivity = await prisma.auditLog.findMany({
                where: { userId: id },
                orderBy: { createdAt: 'desc' },
                take: 10
            });
        } catch (e) {
            console.warn('AuditLog fetch failed or model missing', e);
        }

        return NextResponse.json({
            ...user,
            stats: {
                totalLeads,
                leadsWon,
                conversionRate: `${conversionRate}%`,
                // Mock commission for now
                currentCommission: (leadsWon * 150).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
            },
            recentActivity
        });

    } catch (error) {
        console.error('Error fetching user details:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
