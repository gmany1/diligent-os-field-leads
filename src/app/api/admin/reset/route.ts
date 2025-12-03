import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
    try {
        const hashedPassword = await bcrypt.hash('password123', 10);

        // Delete existing users to ensure clean slate
        await prisma.user.deleteMany({
            where: {
                email: { in: ['admin@diligentos.com', 'rep@diligentos.com'] }
            }
        });

        // Create Admin User
        const admin = await prisma.user.create({
            data: {
                email: 'admin@diligentos.com',
                name: 'IT Admin',
                password: hashedPassword,
                role: 'IT_ADMIN',
            },
        });

        // Create Field Rep User
        const rep = await prisma.user.create({
            data: {
                email: 'rep@diligentos.com',
                name: 'Field Rep',
                password: hashedPassword,
                role: 'FIELD_LEAD_REP',
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Users DELETED and RECREATED successfully',
            users: [admin.email, rep.email],
            newHashPrefix: hashedPassword.substring(0, 10) + '...'
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
