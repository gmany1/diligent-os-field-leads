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
}
