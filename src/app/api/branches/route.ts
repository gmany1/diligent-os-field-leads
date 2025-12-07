import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const branches = await prisma.branch.findMany({
            select: {
                id: true,
                name: true,
                code: true,
                city: true,
                state: true,
                _count: {
                    select: {
                        users: true,
                        leads: true
                    }
                }
            },
            orderBy: { name: 'asc' }
        });

        return NextResponse.json(branches);
    } catch (error) {
        console.error('Error fetching branches:', error);
        return NextResponse.json({ error: 'Failed to fetch branches' }, { status: 500 });
    }
}
