import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        data: [
            { version: 'v2.5.0', date: '2025-12-07', changes: ['Added AI Alerts', 'New Data Pipeline'], status: 'Current', deployedBy: 'CI/CD' },
            { version: 'v2.4.2', date: '2025-11-20', changes: ['Bug fixes', 'Performance improvements'], status: 'Previous', deployedBy: 'Admin' },
            { version: 'v2.4.0', date: '2025-11-01', changes: ['Initial SaaS Release'], status: 'Archived', deployedBy: 'Admin' }
        ]
    });
}
