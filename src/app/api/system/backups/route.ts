import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
    const session = await auth();
    if (!session || !['IT_SUPER_ADMIN', 'CEO'].includes(session.user?.role || '')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Mock backup data - in production this would come from actual backup system
        const backups = [
            {
                id: '1',
                name: 'daily-backup-2025-12-07',
                type: 'FULL',
                size: '2.4 GB',
                status: 'COMPLETED',
                createdAt: new Date(),
                location: 's3://backups/daily-backup-2025-12-07.sql.gz'
            },
            {
                id: '2',
                name: 'daily-backup-2025-12-06',
                type: 'FULL',
                size: '2.3 GB',
                status: 'COMPLETED',
                createdAt: new Date(Date.now() - 86400000),
                location: 's3://backups/daily-backup-2025-12-06.sql.gz'
            },
            {
                id: '3',
                name: 'weekly-backup-2025-12-01',
                type: 'FULL',
                size: '2.1 GB',
                status: 'COMPLETED',
                createdAt: new Date(Date.now() - 518400000),
                location: 's3://backups/weekly-backup-2025-12-01.sql.gz'
            }
        ];

        return NextResponse.json({
            data: backups,
            summary: {
                total: backups.length,
                lastBackup: backups[0].createdAt,
                totalSize: '6.8 GB',
                status: 'HEALTHY'
            }
        });
    } catch (error) {
        console.error('Backups Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
