import { NextResponse } from 'next/server';

// In memory store for demo purposes (since we can't easily write to .env in runtime)
let envVars = [
    { key: 'NEXT_PUBLIC_API_URL', value: 'https://api.diligentos.com', description: 'Main API Endpoint' },
    { key: 'DATABASE_URL', value: 'postgres://user:pass@db.host:5432/main', description: 'Primary DB Connection' },
    { key: 'AUTH_SECRET', value: '************************', description: 'NextAuth Secret' },
    { key: 'LOG_LEVEL', value: 'info', description: 'Winston Logger Level' },
    { key: 'FEATURE_BETA_ACCESS', value: 'true', description: 'Enable beta features globally' },
];

export async function GET() {
    return NextResponse.json({ data: envVars });
}

export async function POST(req: Request) {
    const body = await req.json();
    const { key, value, description } = body;
    envVars.push({ key, value, description });
    return NextResponse.json({ success: true, data: { key, value, description } });
}

export async function PUT(req: Request) {
    const body = await req.json();
    const { key, value } = body;
    const idx = envVars.findIndex(e => e.key === key);
    if (idx >= 0) {
        envVars[idx].value = value;
        return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');
    if (key) {
        envVars = envVars.filter(e => e.key !== key);
    }
    return NextResponse.json({ success: true });
}
