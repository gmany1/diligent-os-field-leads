import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        data: Array.from({ length: 50 }).map((_, i) => ({
            id: `CR-${5000 + i}`,
            title: `System Change Request #${i + 1}`,
            type: i % 3 === 0 ? 'Feature' : 'Fix',
            status: i < 5 ? 'Pending Review' : 'Approved',
            requester: 'Development Team',
            date: new Date(Date.now() - i * 86400000).toISOString()
        }))
    });
}
