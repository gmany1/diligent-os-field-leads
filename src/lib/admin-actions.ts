'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { Role } from '@prisma/client';

export async function updateUserRole(userId: string, newRole: string) {
    const session = await auth();
    if (session?.user?.role !== 'IT_ADMIN') {
        throw new Error('Unauthorized');
    }

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { role: newRole as Role },
        });
        revalidatePath('/admin/users');
        return { success: true };
    } catch (error) {
        console.error('Failed to update role:', error);
        return { success: false, error: 'Failed to update role' };
    }
}
