import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // 1. Total Leads
        const totalLeads = await prisma.lead.count();

        // 2. Active Quotes (Status = SENT or DRAFT)
        const activeQuotes = await prisma.quote.count({
            where: {
                status: { in: ['SENT', 'DRAFT'] }
            }
        });

        // 3. Pipeline Value (Sum of amounts of active quotes)
        const pipelineAggregate = await prisma.quote.aggregate({
            _sum: { amount: true },
            where: { status: { in: ['SENT', 'DRAFT'] } }
        });
        const pipelineValue = pipelineAggregate._sum.amount ? Number(pipelineAggregate._sum.amount) : 0;

        // 4. Conversion Rate (WON / (WON + LOST))
        const wonLeads = await prisma.lead.count({ where: { stage: 'WON' } });
        const lostLeads = await prisma.lead.count({ where: { stage: 'LOST' } });
        const closedLeads = wonLeads + lostLeads;
        const conversionRate = closedLeads > 0 ? (wonLeads / closedLeads) * 100 : 0;

        // 5. Leads by Stage (for Chart)
        const leadsByStage = await prisma.lead.groupBy({
            by: ['stage'],
            _count: { stage: true }
        });

        // Format for Recharts
        // Format for Recharts
        const stageData = leadsByStage.map((item: any) => ({
            name: item.stage,
            value: item._count.stage
        }));

        // 6. Recent Trends (Last 6 Months)
        // Grouping by month in SQLite is tricky with raw SQL, so we'll fetch createdAt and aggregate in JS for now (safe for small scale)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const recentLeads = await prisma.lead.findMany({
            where: { createdAt: { gte: sixMonthsAgo } },
            select: { createdAt: true }
        });

        const trendsMap = new Map<string, number>();
        recentLeads.forEach((lead: { createdAt: Date }) => {
            const month = lead.createdAt.toISOString().slice(0, 7); // YYYY-MM
            trendsMap.set(month, (trendsMap.get(month) || 0) + 1);
        });

        const trendData = Array.from(trendsMap.entries())
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => a.date.localeCompare(b.date));

        return NextResponse.json({
            totalLeads,
            activeQuotes,
            pipelineValue,
            conversionRate,
            stageData,
            trendData
        });

    } catch (error) {
        console.error('Analytics Error:', error);
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}
