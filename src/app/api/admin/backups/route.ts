import { NextResponse } from 'next/server';

export async function GET() {
    const backups = [
        { id: 'bk_20251207', name: 'Daily Automated Backup', size: '1.2 GB', type: 'Full', status: 'Completed', date: new Date().toISOString() },
        { id: 'bk_20251206', name: 'Daily Automated Backup', size: '1.2 GB', type: 'Full', status: 'Completed', date: new Date(Date.now() - 86400000).toISOString() },
        { id: 'bk_20251205', name: 'Pre-Deployment Snapshot', size: '450 MB', type: 'Incremental', status: 'Completed', date: new Date(Date.now() - 172800000).toISOString() },
    ];
    return NextResponse.json({ data: backups });
}

export async function POST() {
    // Simulate creating a backup
    return NextResponse.json({ success: true, message: 'Backup started successfully' });
}
