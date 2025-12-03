import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
    try {
        const hashedPassword = await bcrypt.hash('password123', 10);

        // Create or update Admin User
        const admin = await prisma.user.upsert({
            where: { email: 'admin@diligentos.com' },
            update: {
                password: hashedPassword,
                role: 'IT_ADMIN',
                name: 'IT Admin'
            },
            create: {
                email: 'admin@diligentos.com',
                name: 'IT Admin',
                password: hashedPassword,
                role: 'IT_ADMIN',
            },
        });

        // Create or update Field Rep User
        const rep = await prisma.user.upsert({
            where: { email: 'rep@diligentos.com' },
            update: {
                password: hashedPassword,
                role: 'FIELD_LEAD_REP',
                name: 'Field Rep'
            },
            create: {
                email: 'rep@diligentos.com',
                name: 'Field Rep',
                password: hashedPassword,
                role: 'FIELD_LEAD_REP',
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Users reset successfully',
            users: [admin.email, rep.email]
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
