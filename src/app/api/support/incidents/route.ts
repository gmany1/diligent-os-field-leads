import { NextResponse } from 'next/server';

// User facing support tickets
export async function GET() {
    return NextResponse.json({
        data: [
            { id: 'TKT-1024', subject: 'Unable to sync calendar', status: 'Open', created: new Date().toISOString(), priority: 'Medium' },
            { id: 'TKT-0992', subject: 'Login issues on mobile', status: 'Resolved', created: new Date(Date.now() - 86400000).toISOString(), priority: 'High' },
            { id: 'TKT-0850', subject: 'Report export failing', status: 'Closed', created: new Date(Date.now() - 172800000).toISOString(), priority: 'Low' }
        ]
    });
}
