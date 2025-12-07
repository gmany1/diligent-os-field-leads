import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const versions = [
            {
                id: '1',
                version: '1.0.0',
                name: 'Initial Release',
                releaseDate: new Date('2025-12-01'),
                features: ['User management', 'Lead tracking', 'Basic reporting'],
                status: 'CURRENT'
            },
            {
                id: '2',
                version: '0.9.0',
                name: 'Beta Release',
                releaseDate: new Date('2025-11-15'),
                features: ['Core functionality', 'Authentication', 'Database setup'],
                status: 'DEPRECATED'
            }
        ];

        return NextResponse.json({
            data: versions,
            current: versions[0],
            summary: {
                currentVersion: '1.0.0',
                releaseDate: versions[0].releaseDate,
                totalVersions: versions.length
            }
        });
    } catch (error) {
        console.error('Versions Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
