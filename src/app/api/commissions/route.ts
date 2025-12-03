import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const commissions = await prisma.commission.findMany({
            where: {
                userId: session.user.id,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(commissions);
    } catch (error) {
        console.error('Failed to fetch commissions:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
