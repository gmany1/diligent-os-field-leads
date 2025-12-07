import { NextResponse } from 'next/server';

export async function GET() {
    const sysLogs = [
        { id: 101, level: 'ERROR', service: 'PaymentGateway', message: 'Timeout connecting to Stripe API', timestamp: new Date().toISOString() },
        { id: 102, level: 'WARN', service: 'EmailSender', message: 'Rate limit approaching (80%)', timestamp: new Date(Date.now() - 5000).toISOString() },
        { id: 103, level: 'INFO', service: 'CronJob', message: 'Daily backup completed successfully', timestamp: new Date(Date.now() - 60000).toISOString() },
        { id: 104, level: 'DEBUG', service: 'AuthMiddleware', message: 'Token refresh grant issued', timestamp: new Date(Date.now() - 120000).toISOString() },
        { id: 105, level: 'INFO', service: 'System', message: 'Application started v2.5.0', timestamp: new Date(Date.now() - 3600000).toISOString() },
    ];
    return NextResponse.json({ data: sysLogs });
}
