'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { logAudit } from '@/lib/audit';

// const prisma = new PrismaClient();

import { RegisterUserSchema } from '@/lib/schemas';

// ...

export async function createUser(formData: FormData) {
    const session = await auth();
    // TODO: Use RBAC helper
    if (session?.user?.role !== 'IT_ADMIN' && session?.user?.role !== 'MANAGER') {
        throw new Error('Unauthorized');
    }

    const rawData = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        role: formData.get('role'),
        territory: formData.get('territory'),
    };

    const validatedFields = RegisterUserSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return { success: false, error: 'Invalid fields: ' + JSON.stringify(validatedFields.error.flatten().fieldErrors) };
    }

    const { name, email, password, role, territory } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role, // Zod validation ensures this matches Enum or is valid string if using string
                territory
            },
        });

        await logAudit({
            action: 'CREATE',
            entity: 'USER',
            entityId: email, // Using email as identifier since ID is not returned by void create if not selected, wait create returns object
            userId: session?.user?.id,
            details: { role, targetEmail: email }
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

        await logAudit({
            action: 'DELETE',
            entity: 'USER',
            entityId: userId,
            userId: session?.user?.id,
        });

        revalidatePath('/admin/users');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete user:', error);
        return { success: false, error: 'Failed to delete user' };
    }
}
