import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
    const session = await auth();
    if (!session || !['EXECUTIVE', 'IT_ADMIN', 'MANAGER', 'CEO', 'AREA_DIRECTOR', 'CAO', 'DOO', 'BRANCH_MANAGER', 'IT_SUPER_ADMIN'].includes(session.user?.role || '')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Get pipeline stats by stage
        const leads = await prisma.lead.groupBy({
            by: ['stage'],
            _count: {
                id: true
            }
        });

        const pipelineStats = leads.map(item => ({
            stage: item.stage,
            count: item._count.id
        }));

        // Get total leads for conversion calculation
        const totalLeads = await prisma.lead.count();
        const wonLeads = await prisma.lead.count({ where: { stage: 'WON' } });
        const lostLeads = await prisma.lead.count({ where: { stage: 'LOST' } });
        const quotedLeads = await prisma.lead.count({ where: { stage: 'QUOTE' } });

        const conversionStats = {
            total_leads: totalLeads,
            won_leads: wonLeads,
            lost_leads: lostLeads,
            quoted_leads: quotedLeads,
            conversion_rate: totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(2) : '0.00'
        };

        return NextResponse.json({
            pipeline: pipelineStats,
            conversion: conversionStats,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Executive Report Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}
