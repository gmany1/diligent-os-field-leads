'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

// const prisma = new PrismaClient();

export async function createUser(formData: FormData) {
    const session = await auth();
    if (session?.user?.role !== 'IT_ADMIN' && session?.user?.role !== 'MANAGER') {
        throw new Error('Unauthorized');
    }

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const role = formData.get('role') as any;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
            },
        });
        revalidatePath('/admin/users');
        return { success: true };
    } catch (error) {
        console.error('Failed to create user:', error);
        return { success: false, error: 'Failed to create user' };
    }
}

export async function deleteUser(userId: string) {
    const session = await auth();
    if (session?.user?.role !== 'IT_ADMIN') {
        throw new Error('Unauthorized');
    }

    try {
        await prisma.user.delete({
            where: { id: userId },
        });
        revalidatePath('/admin/users');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete user:', error);
        return { success: false, error: 'Failed to delete user' };
    }
}
