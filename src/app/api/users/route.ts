import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { auth } from '@/auth';

export async function GET(request: Request) {
    try {
        const session = await auth();
        // Only executives and IT admins can view all users
        if (!session?.user || !['CEO', 'CAO', 'DOO', 'IT_SUPER_ADMIN', 'BRANCH_MANAGER'].includes(session.user.role || '')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                territory: true,
                branchId: true,
                createdAt: true,
                updatedAt: true,
                branch: {
                    select: {
                        id: true,
                        name: true,
                        code: true,
                        city: true,
                        state: true
                    }
                },
                _count: {
                    select: {
                        leads: true,
                        activities: true,
                        quotes: true,
                        commissions: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth();
        // RBAC: Only IT_SUPER_ADMIN or executives can create users
        if (!session?.user || !['IT_SUPER_ADMIN', 'CEO', 'CAO', 'DOO'].includes(session.user.role || '')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const body = await request.json();
        const { name, email, password, role, territory } = body;

        if (!email || !password || !role) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
                territory,
            },
        });

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json({ data: userWithoutPassword }, { status: 201 });
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}
