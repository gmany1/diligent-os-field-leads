import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Get recent changes from audit logs
        const changes = await prisma.auditLog.findMany({
            where: {
                action: {
                    in: ['CREATE', 'UPDATE', 'DELETE']
                }
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 50
        });

        const formattedChanges = changes.map(log => ({
            id: log.id,
            type: log.action,
            entity: log.entity,
            entityId: log.entityId,
            user: log.user?.name || 'System',
            userEmail: log.user?.email || 'N/A',
            details: log.details,
            timestamp: log.createdAt,
            status: 'COMPLETED'
        }));

        return NextResponse.json({
            data: formattedChanges,
            summary: {
                total: formattedChanges.length,
                creates: formattedChanges.filter(c => c.type === 'CREATE').length,
                updates: formattedChanges.filter(c => c.type === 'UPDATE').length,
                deletes: formattedChanges.filter(c => c.type === 'DELETE').length
            }
        });
    } catch (error) {
        console.error('Changes Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
