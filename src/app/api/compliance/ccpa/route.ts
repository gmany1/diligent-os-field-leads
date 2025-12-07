import { NextResponse } from 'next/server';

export async function GET() {
    const requests = [
        { id: 'REQ-001', type: 'Right to Access', requester: 'jane.doe@example.com', status: 'Completed', submitted: '2025-12-01', due: '2025-01-15' },
        { id: 'REQ-002', type: 'Right to Delete', requester: 'bob.smith@test.com', status: 'In Progress', submitted: '2025-12-05', due: '2025-01-19' },
        { id: 'REQ-003', type: 'Do Not Sell', requester: 'privacy@corp.org', status: 'Pending', submitted: '2025-12-06', due: '2025-12-20' },
    ];
    return NextResponse.json({ data: requests });
}
