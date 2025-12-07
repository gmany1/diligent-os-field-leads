import { NextResponse } from 'next/server';

export async function GET() {
    const accesses = [
        { id: '1', user: 'sarah.j', subject: 'Client: John Doe', field: 'SSN', reason: 'Credit Check', time: new Date().toISOString() },
        { id: '2', user: 'mike.t', subject: 'Lead: Acme Corp', field: 'Bank Info', reason: 'Billing Setup', time: new Date(Date.now() - 18000000).toISOString() },
        { id: '3', user: 'compliance.bot', subject: 'Audit Batch', field: 'All', reason: 'Daily Scan', time: new Date(Date.now() - 43200000).toISOString() },
    ];
    return NextResponse.json({ data: accesses });
}
