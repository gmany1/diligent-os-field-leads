import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import bcrypt from 'bcryptjs';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user || !['IT_SUPER_ADMIN', 'CEO', 'CAO', 'DOO'].includes(session.user.role || '')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const { id } = await params;
        const body = await request.json();
        const { name, email, role, territory, branchId, password } = body;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { id }
        });

        if (!existingUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // If email is being changed, check if new email is already in use
        if (email && email !== existingUser.email) {
            const emailInUse = await prisma.user.findUnique({
                where: { email }
            });
            if (emailInUse) {
                return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
            }
        }

        // Prepare update data
        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (email !== undefined) updateData.email = email;
        if (role !== undefined) updateData.role = role;
        if (territory !== undefined) updateData.territory = territory;
        if (branchId !== undefined) updateData.branchId = branchId;

        // Hash password if provided
        if (password && password.trim() !== '') {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: updateData,
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
                        code: true
                    }
                }
            }
        });

        // Audit log
        await prisma.auditLog.create({
            data: {
                action: 'UPDATE',
                entity: 'USER',
                entityId: id,
                userId: session.user.id,
                details: JSON.stringify({ updatedFields: Object.keys(updateData) }),
                ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
                userAgent: request.headers.get('user-agent') || 'unknown',
            }
        });

        return NextResponse.json({ success: true, data: updatedUser });
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user || !['IT_SUPER_ADMIN', 'CEO'].includes(session.user.role || '')) {
            return NextResponse.json({ error: 'Unauthorized - Only IT_SUPER_ADMIN or CEO can delete users' }, { status: 403 });
        }

        const { id } = await params;

        // Prevent self-deletion
        if (id === session.user.id) {
            return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
        }

        // Check if user exists and has associated data
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        leads: true,
                        activities: true,
                        quotes: true,
                        commissions: true
                    }
                }
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check if user has associated data
        const hasData = user._count.leads > 0 || user._count.activities > 0 ||
            user._count.quotes > 0 || user._count.commissions > 0;

        if (hasData) {
            return NextResponse.json({
                error: 'Cannot delete user with associated data. Please reassign their leads, activities, quotes, and commissions first.',
                details: {
                    leads: user._count.leads,
                    activities: user._count.activities,
                    quotes: user._count.quotes,
                    commissions: user._count.commissions
                }
            }, { status: 400 });
        }

        // Delete user
        await prisma.user.delete({
            where: { id }
        });

        // Audit log
        await prisma.auditLog.create({
            data: {
                action: 'DELETE',
                entity: 'USER',
                entityId: id,
                userId: session.user.id,
                details: JSON.stringify({ deletedUser: user.email }),
                ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
                userAgent: request.headers.get('user-agent') || 'unknown',
            }
        });

        return NextResponse.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}
