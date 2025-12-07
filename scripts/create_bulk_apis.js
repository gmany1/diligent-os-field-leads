const fs = require('fs');
const path = require('path');

const apis = {
    'system/versions': `
import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        data: [
            { version: 'v2.5.0', date: '2025-12-07', changes: ['Added AI Alerts', 'New Data Pipeline'], status: 'Current', deployedBy: 'CI/CD' },
            { version: 'v2.4.2', date: '2025-11-20', changes: ['Bug fixes', 'Performance improvements'], status: 'Previous', deployedBy: 'Admin' },
            { version: 'v2.4.0', date: '2025-11-01', changes: ['Initial SaaS Release'], status: 'Archived', deployedBy: 'Admin' }
        ]
    });
}`,
    'system/maintenance': `
import { NextResponse } from 'next/server';

let status = { active: false, message: 'Scheduled maintenance window', scheduledFor: null };

export async function GET() {
    return NextResponse.json({ data: status });
}

export async function POST(req) {
    const body = await req.json();
    status = { ...status, ...body };
    return NextResponse.json({ success: true, data: status });
}`,
    'settings/profile': `
import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        data: {
            name: 'Jesus Ramos',
            email: 'jesus.ramos@diligentos.com',
            role: 'CEO',
            avatar: null,
            bio: 'Building the future of field sales.',
            phone: '+1 (555) 012-3456',
            notifications: { email: true, push: false }
        }
    });
}`,
    'support/incidents': `
import { NextResponse } from 'next/server';

// User facing support tickets
export async function GET() {
    return NextResponse.json({
        data: [
            { id: 'TKT-1024', subject: 'Unable to sync calendar', status: 'Open', created: new Date().toISOString(), priority: 'Medium' },
            { id: 'TKT-0992', subject: 'Login issues on mobile', status: 'Resolved', created: new Date(Date.now() - 86400000).toISOString(), priority: 'High' }
        ]
    });
}`,
    'admin/changes': `
import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        data: Array.from({ length: 50 }).map((_, i) => ({
            id: \`CR-\${5000 + i}\`,
            title: \`System Change Request #\${i + 1}\`,
            type: i % 3 === 0 ? 'Feature' : 'Fix',
            status: i < 5 ? 'Pending Review' : 'Approved',
            requester: 'Development Team',
            date: new Date(Date.now() - i * 86400000).toISOString()
        }))
    });
}`,
    'support/docs': `
import { NextResponse } from 'next/server';

let docs = [
    { id: '1', title: 'Getting Started', category: 'General', content: 'Welcome to DiligentOS...' },
    { id: '2', title: 'Lead Management', category: 'CRM', content: 'How to create and manage leads...' }
];

export async function GET() {
    return NextResponse.json({ data: docs });
}

export async function POST(req) {
    const body = await req.json();
    const newDoc = { id: Date.now().toString(), ...body };
    docs.push(newDoc);
    return NextResponse.json({ success: true, data: newDoc });
}

export async function PUT(req) {
    const body = await req.json();
    const idx = docs.findIndex(d => d.id === body.id);
    if (idx >= 0) {
        docs[idx] = { ...docs[idx], ...body };
        return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function DELETE(req) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    docs = docs.filter(d => d.id !== id);
    return NextResponse.json({ success: true });
}`
};

Object.entries(apis).forEach(([endpoint, content]) => {
    const fullPath = path.join(__dirname, '..', 'src', 'app', 'api', endpoint, 'route.ts');
    try {
        const dir = path.dirname(fullPath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(fullPath, content.trim());
        console.log(\`Created API: \${endpoint}\`);
    } catch (e) {
        console.error('Error:', e);
    }
});
