const fs = require('fs');
const path = require('path');

const endpoints = {
    'compliance/audit-logs': {
        content: `
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // In a real app, fetch from prisma.auditLog
    // Mocking for now as AuditLog table might be empty or specific
    const logs = [
      { id: '1', action: 'LOGIN', user: 'jesus.ramos@diligentos.com', resource: 'Auth', timestamp: new Date().toISOString(), details: 'Successful login from 192.168.1.1' },
      { id: '2', action: 'VIEW_LEAD', user: 'sarah.j@diligentos.com', resource: 'Lead: 1024', timestamp: new Date(Date.now() - 3600000).toISOString(), details: 'Accessed sensitive PII' },
      { id: '3', action: 'EXPORT_REPORT', user: 'admin@diligentos.com', resource: 'Revenue Report', timestamp: new Date(Date.now() - 7200000).toISOString(), details: 'CSV Export' },
      { id: '4', action: 'UPDATE_ROLE', user: 'it.admin@diligentos.com', resource: 'User: mike.t', timestamp: new Date(Date.now() - 86400000).toISOString(), details: 'Promoted to Manager' },
      { id: '5', action: 'DELETE_LEAD', user: 'system', resource: 'Lead: 999', timestamp: new Date(Date.now() - 172800000).toISOString(), details: 'Automated retention policy' },
    ];
    return NextResponse.json({ data: logs });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
`
    },
    'compliance/pii-access': {
        content: `
import { NextResponse } from 'next/server';

export async function GET() {
  const accesses = [
    { id: '1', user: 'sarah.j', subject: 'Client: John Doe', field: 'SSN', reason: 'Credit Check', time: new Date().toISOString() },
    { id: '2', user: 'mike.t', subject: 'Lead: Acme Corp', field: 'Bank Info', reason: 'Billing Setup', time: new Date(Date.now() - 18000000).toISOString() },
    { id: '3', user: 'compliance.bot', subject: 'Audit Batch', field: 'All', reason: 'Daily Scan', time: new Date(Date.now() - 43200000).toISOString() },
  ];
  return NextResponse.json({ data: accesses });
}
`
    },
    'compliance/ccpa': {
        content: `
import { NextResponse } from 'next/server';

export async function GET() {
  const requests = [
    { id: 'REQ-001', type: 'Right to Access', requester: 'jane.doe@example.com', status: 'Completed', submitted: '2025-12-01', due: '2025-01-15' },
    { id: 'REQ-002', type: 'Right to Delete', requester: 'bob.smith@test.com', status: 'In Progress', submitted: '2025-12-05', due: '2025-01-19' },
    { id: 'REQ-003', type: 'Do Not Sell', requester: 'privacy@corp.org', status: 'Pending', submitted: '2025-12-06', due: '2025-12-20' },
  ];
  return NextResponse.json({ data: requests });
}
`
    },
    'system/logs': {
        content: `
import { NextResponse } from 'next/server';

export async function GET() {
  const sysLogs = [
    { id: 101, level: 'ERROR', service: 'PaymentGateway', message: 'Timeout connecting to Stripe API', timestamp: new Date().toISOString() },
    { id: 102, level: 'WARN', service: 'EmailSender', message: 'Rate limit approaching (80%)', timestamp: new Date(Date.now() - 5000).toISOString() },
    { id: 103, level: 'INFO', service: 'CronJob', message: 'Daily backup completed successfully', timestamp: new Date(Date.now() - 60000).toISOString() },
    { id: 104, level: 'DEBUG', service: 'AuthMiddleware', message: 'Token refresh grant issued', timestamp: new Date(Date.now() - 120000).toISOString() },
  ];
  return NextResponse.json({ data: sysLogs });
}
`
    },
    'admin/backups': {
        content: `
import { NextResponse } from 'next/server';

export async function GET() {
  const backups = [
    { id: 'bk_20251207', name: 'Daily Automated Backup', size: '1.2 GB', type: 'Full', status: 'Completed', date: new Date().toISOString() },
    { id: 'bk_20251206', name: 'Daily Automated Backup', size: '1.2 GB', type: 'Full', status: 'Completed', date: new Date(Date.now() - 86400000).toISOString() },
    { id: 'bk_20251205', name: 'Pre-Deployment Snapshot', size: '450 MB', type: 'Incremental', status: 'Completed', date: new Date(Date.now() - 172800000).toISOString() },
  ];
  return NextResponse.json({ data: backups });
}

export async function POST() {
    // Simulate creating a backup
    return NextResponse.json({ success: true, message: 'Backup started successfully' });
}
`
    },
    'admin/env': {
        content: `
import { NextResponse } from 'next/server';

// In memory store for demo purposes (since we can't easily write to .env in runtime)
let envVars = [
    { key: 'NEXT_PUBLIC_API_URL', value: 'https://api.diligentos.com', description: 'Main API Endpoint' },
    { key: 'DATABASE_URL', value: 'postgres://***:***@db.host:5432/main', description: 'Primary DB Connection' },
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
    return NextResponse.json({ success: true });
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
    envVars = envVars.filter(e => e.key !== key);
    return NextResponse.json({ success: true });
}
`
    }
};

Object.entries(endpoints).forEach(([endpointUrl, config]) => {
    const fullPath = path.join(__dirname, '..', 'src', 'app', 'api', endpointUrl, 'route.ts');
    try {
        const dir = path.dirname(fullPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(fullPath, config.content.trim());
        console.log(\`Created API: \${endpointUrl}\`);
    } catch (err) {
        console.error(\`Error creating \${endpointUrl}: \${err.message}\`);
    }
});
