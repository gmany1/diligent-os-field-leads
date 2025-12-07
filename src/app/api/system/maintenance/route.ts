import { NextResponse } from 'next/server';

let status = { active: false, message: 'Scheduled maintenance window', scheduledFor: null };

export async function GET() {
    return NextResponse.json({ data: status });
}

export async function POST(req: Request) {
    const body = await req.json();
    status = { ...status, ...body };
    return NextResponse.json({ success: true, data: status });
}
