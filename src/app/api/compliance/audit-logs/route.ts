import { NextResponse } from 'next/server';

export async function GET() {
    const logs = [
        { id: '1', action: 'LOGIN', user: 'jesus.ramos@diligentos.com', resource: 'Auth', timestamp: new Date().toISOString(), details: 'Successful login from 192.168.1.1' },
        { id: '2', action: 'VIEW_LEAD', user: 'sarah.j@diligentos.com', resource: 'Lead: 1024', timestamp: new Date(Date.now() - 3600000).toISOString(), details: 'Accessed sensitive PII' },
        { id: '3', action: 'EXPORT_REPORT', user: 'admin@diligentos.com', resource: 'Revenue Report', timestamp: new Date(Date.now() - 7200000).toISOString(), details: 'CSV Export' },
        { id: '4', action: 'UPDATE_ROLE', user: 'it.admin@diligentos.com', resource: 'User: mike.t', timestamp: new Date(Date.now() - 86400000).toISOString(), details: 'Promoted to Manager' },
        { id: '5', action: 'DELETE_LEAD', user: 'system', resource: 'Lead: 999', timestamp: new Date(Date.now() - 172800000).toISOString(), details: 'Automated retention policy' },
    ];
    return NextResponse.json({ data: logs });
}
