import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(request: Request) {
    try {
        const session = await auth();
        const { searchParams } = new URL(request.url);
        const role = searchParams.get('role');
        const userId = searchParams.get('userId') || session?.user?.id;

        // Build where clause based on role
        let where: any = {};
        if (role === 'FIELD_LEAD_REP' && userId) {
            where.assignedToId = userId;
        }
        // Managers might see their branch, but for now we'll show all or filter by branch if we had it.

        const leads = await prisma.lead.findMany({
            where,
            include: {
                quotes: true
            }
        });

        const users = await prisma.user.findMany({
            select: { id: true, name: true, email: true, role: true }
        });

        // Calculate Stats
        const wonLeads = leads.filter((l: any) => l.stage === 'WON');
        const activeLeads = leads.filter((l: any) => ['WARM', 'HOT', 'QUOTE', 'NEGOTIATION'].includes(l.stage));
        const lostLeads = leads.filter((l: any) => l.stage === 'LOST');

        // Revenue: Sum of accepted quotes or won leads value (if we had a value field on Lead, but we have Quotes)
        // Let's assume revenue comes from accepted quotes for now, or we can add a 'value' field to Lead if needed.
        // The previous code assumed 'l.value'. Let's check schema. Quote has amount.
        // We'll sum up amounts of accepted quotes for WON leads.
        const revenue = leads.reduce((sum: number, lead: any) => {
            if (lead.stage === 'WON') {
                const wonQuote = lead.quotes.find((q: any) => q.status === 'ACCEPTED');
                return sum + (wonQuote ? Number(wonQuote.amount) : 0);
            }
            return sum;
        }, 0);

        // Pipeline: Sum of active quotes
        const pipeline = leads.reduce((sum: number, lead: any) => {
            if (['WARM', 'HOT', 'QUOTE'].includes(lead.stage)) {
                // Sum all draft/sent quotes? Or just the latest? Let's sum all non-rejected.
                const activeQuotes = lead.quotes.filter((q: any) => ['DRAFT', 'SENT'].includes(q.status));
                const leadValue = activeQuotes.reduce((qSum: number, q: any) => qSum + Number(q.amount), 0);
                return sum + leadValue;
            }
            return sum;
        }, 0);

        const totalClosed = wonLeads.length + lostLeads.length;
        const conversionRate = totalClosed > 0 ? (wonLeads.length / totalClosed) * 100 : 0;

        // Funnel Data
        const funnelData = [
            { name: 'New', value: leads.filter(l => l.stage === 'COLD').length, fill: '#6366f1' },
            { name: 'Contacted', value: leads.filter(l => l.stage === 'WARM').length, fill: '#8b5cf6' },
            { name: 'Proposal', value: leads.filter(l => l.stage === 'QUOTE').length, fill: '#ec4899' },
            { name: 'Won', value: wonLeads.length, fill: '#10b981' },
        ];

        // Source Effectiveness
        const sourceStats = leads.reduce((acc: any, lead) => {
            const source = lead.source || 'Unknown';
            if (!acc[source]) {
                acc[source] = { name: source, total: 0, won: 0, value: 0 };
            }
            acc[source].total += 1;
            if (lead.stage === 'WON') {
                acc[source].won += 1;
                // Add value if available
            }
            return acc;
        }, {});

        const sourceEffectiveness = Object.values(sourceStats).map((s: any) => ({
            ...s,
            conversionRate: s.total > 0 ? parseFloat(((s.won / s.total) * 100).toFixed(1)) : 0
        }));

        return NextResponse.json({
            success: true,
            data: {
                revenue,
                pipeline,
                conversionRate: parseFloat(conversionRate.toFixed(1)),
                activeLeadsCount: activeLeads.length,
                wonLeadsCount: wonLeads.length,
                totalLeads: leads.length,
                totalUsers: users.length,
                users,
                funnelData,
                sourceEffectiveness
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
