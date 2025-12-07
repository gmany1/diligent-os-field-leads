import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
    const session = await auth();
    if (!session || !['IT_SUPER_ADMIN', 'CEO'].includes(session.user?.role || '')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Get critical audit logs that could be incidents
        const incidents = await prisma.auditLog.findMany({
            where: {
                OR: [
                    { action: 'DELETE' },
                    { action: 'CCPA_DELETE_HARD' },
                    { action: 'CCPA_DELETE_SOFT' },
                    { action: { contains: 'FAILED' } }
                ]
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 100
        });

        // Transform to incident format
        const formattedIncidents = incidents.map(log => ({
            id: log.id,
            type: log.action.includes('DELETE') ? 'DATA_DELETION' :
                log.action.includes('FAILED') ? 'SYSTEM_ERROR' : 'SECURITY',
            severity: log.action.includes('HARD') ? 'HIGH' :
                log.action.includes('DELETE') ? 'MEDIUM' : 'LOW',
            title: `${log.action.replace(/_/g, ' ')} - ${log.entity}`,
            description: `Action: ${log.action} on ${log.entity} (ID: ${log.entityId})`,
            user: log.user?.name || 'System',
            userEmail: log.user?.email || 'N/A',
            ipAddress: log.ipAddress,
            userAgent: log.userAgent,
            details: log.details,
            status: 'RESOLVED',
            createdAt: log.createdAt,
            resolvedAt: log.createdAt
        }));

        // Add some mock incidents for demonstration
        const mockIncidents = [
            {
                id: 'mock-1',
                type: 'PERFORMANCE',
                severity: 'LOW',
                title: 'Database Query Slow',
                description: 'Query execution time exceeded 2 seconds',
                user: 'System Monitor',
                userEmail: 'system@diligentos.com',
                ipAddress: 'internal',
                userAgent: 'System Monitor v1.0',
                details: JSON.stringify({ query: 'SELECT * FROM leads', duration: '2.3s' }),
                status: 'MONITORING',
                createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
                resolvedAt: null
            },
            {
                id: 'mock-2',
                type: 'SECURITY',
                severity: 'MEDIUM',
                title: 'Multiple Failed Login Attempts',
                description: '5 failed login attempts detected from same IP',
                user: 'Security System',
                userEmail: 'security@diligentos.com',
                ipAddress: '192.168.1.100',
                userAgent: 'Mozilla/5.0',
                details: JSON.stringify({ attempts: 5, blocked: false }),
                status: 'INVESTIGATING',
                createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
                resolvedAt: null
            }
        ];

        const allIncidents = [...mockIncidents, ...formattedIncidents];

        return NextResponse.json({
            data: allIncidents,
            summary: {
                total: allIncidents.length,
                high: allIncidents.filter(i => i.severity === 'HIGH').length,
                medium: allIncidents.filter(i => i.severity === 'MEDIUM').length,
                low: allIncidents.filter(i => i.severity === 'LOW').length,
                open: allIncidents.filter(i => i.status !== 'RESOLVED').length
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('System Incidents Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}
