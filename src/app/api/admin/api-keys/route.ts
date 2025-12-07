import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
    const session = await auth();
    if (!session || !['IT_SUPER_ADMIN', 'CEO'].includes(session.user?.role || '')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Mock API keys - in production these would be stored securely
        const apiKeys = [
            {
                id: '1',
                name: 'Production API Key',
                key: 'pk_live_***************',
                createdAt: new Date('2025-12-01'),
                lastUsed: new Date(),
                status: 'ACTIVE',
                permissions: ['read', 'write']
            },
            {
                id: '2',
                name: 'Development API Key',
                key: 'pk_test_***************',
                createdAt: new Date('2025-11-15'),
                lastUsed: new Date(Date.now() - 86400000),
                status: 'ACTIVE',
                permissions: ['read']
            }
        ];

        return NextResponse.json({
            data: apiKeys,
            summary: {
                total: apiKeys.length,
                active: apiKeys.filter(k => k.status === 'ACTIVE').length
            }
        });
    } catch (error) {
        console.error('API Keys Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
