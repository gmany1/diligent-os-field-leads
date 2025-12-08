import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import UserNexusClient from '@/components/users/UserNexusClient';
import { auth } from '@/auth';

export default async function UserNexusPage({ params }: { params: { id: string } }) {
    const session = await auth();
    if (!session?.user) {
        redirect('/login');
    }

    const { id } = params;

    // Fetch User Data for Server Side Rendering (SSR) SEO & Speed
    // We fetch basic data here, but for the full 'Nexus' experience with complex stats,
    // the Client Component might fetch from the API we built, OR we can pass it all here.
    // Let's pass the initial data here to avoid loading spinners on first paint.
    const user = await prisma.user.findUnique({
        where: { id },
        include: {
            branch: true,
            _count: {
                select: { leads: true }
            }
        }
    });

    if (!user) {
        return notFound();
    }

    // Calculating same stats as API for consistency, or we could just fetch the API internally.
    // For performance, direct DB access is better in server component.
    const leadsWon = await prisma.lead.count({ where: { assignedToId: id, stage: 'WON' } });
    const totalLeads = user._count.leads || 0;
    const conversionRate = totalLeads > 0 ? ((leadsWon / totalLeads) * 100).toFixed(1) + '%' : '0.0%';

    // Fetch recent activity
    const recentActivity = await prisma.auditLog.findMany({
        where: { userId: id },
        orderBy: { createdAt: 'desc' },
        take: 10
    });

    const extendedUser = {
        ...user,
        stats: {
            totalLeads,
            leadsWon,
            conversionRate,
            // Mock commission
            currentCommission: (leadsWon * 150).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
        },
        recentActivity
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <UserNexusClient user={extendedUser} />
        </div>
    );
}
