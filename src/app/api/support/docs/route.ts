import { NextResponse } from 'next/server';

let docs = [
    { id: '1', title: 'Getting Started', category: 'General', content: 'Welcome to DiligentOS...' },
    { id: '2', title: 'Lead Management', category: 'CRM', content: 'How to create and manage leads...' },
    { id: '3', title: 'Commission Rules', category: 'Finance', content: 'Understanding your payout structure...' }
];

export async function GET() {
    return NextResponse.json({ data: docs });
}

export async function POST(req: Request) {
    const body = await req.json();
    const newDoc = { id: Date.now().toString(), ...body };
    docs.push(newDoc);
    return NextResponse.json({ success: true, data: newDoc });
}

export async function PUT(req: Request) {
    const body = await req.json();
    const idx = docs.findIndex(d => d.id === body.id);
    if (idx >= 0) {
        docs[idx] = { ...docs[idx], ...body };
        return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    docs = docs.filter(d => d.id !== id);
    return NextResponse.json({ success: true });
}
