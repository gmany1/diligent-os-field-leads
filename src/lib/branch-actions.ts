'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { Prisma } from '@prisma/client';

// Define standard response type
type ActionResponse = {
    success: boolean;
    error?: string;
    data?: any;
};

export async function createBranch(data: {
    name: string;
    code: string;
    address: string;
    city: string;
    state: string;
}): Promise<ActionResponse> {
    const session = await auth();
    const role = session?.user?.role;

    if (role !== 'IT_SUPER_ADMIN' && role !== 'IT_ADMIN' && role !== 'CEO') {
        return { success: false, error: 'Unauthorized: Insufficient permissions' };
    }

    try {
        // Enforce uppercase code
        const safeCode = data.code.toUpperCase().trim();

        // Check uniqueness
        const existing = await prisma.branch.findUnique({
            where: { code: safeCode }
        });

        if (existing) {
            return { success: false, error: `Branch code '${safeCode}' already exists.` };
        }

        const branch = await prisma.branch.create({
            data: {
                ...data,
                code: safeCode,
                // Ensure required fields are present if schema demands, mostly handled by input types
            }
        });

        revalidatePath('/branches/manage');
        revalidatePath('/branches/all');
        return { success: true, data: branch };

    } catch (error) {
        console.error('Failed to create branch:', error);
        return { success: false, error: 'Failed to create branch. Database error.' };
    }
}

export async function updateBranch(id: string, data: {
    name?: string;
    address?: string;
    city?: string;
    state?: string;
}): Promise<ActionResponse> {
    const session = await auth();
    const role = session?.user?.role;

    if (role !== 'IT_SUPER_ADMIN' && role !== 'IT_ADMIN' && role !== 'CEO') {
        return { success: false, error: 'Unauthorized' };
    }

    try {
        const branch = await prisma.branch.update({
            where: { id },
            data
        });

        revalidatePath('/branches/manage');
        revalidatePath('/branches/all');
        revalidatePath(`/branches/${id}`); // Update the Nexus page specifically
        return { success: true, data: branch };
    } catch (error) {
        console.error('Failed to update branch:', error);
        return { success: false, error: 'Failed to update branch.' };
    }
}

export async function deleteBranch(id: string): Promise<ActionResponse> {
    const session = await auth();
    const role = session?.user?.role;

    if (role !== 'IT_SUPER_ADMIN' && role !== 'IT_ADMIN' && role !== 'CEO') {
        return { success: false, error: 'Unauthorized: Only IT Admins/CEO can archive branches' };
    }

    try {
        // Soft Delete: Mark as ARCHIVED
        // We do NOT block even if users/leads exist, preserving history.

        await prisma.branch.update({
            where: { id },
            data: { status: 'ARCHIVED' }
        });

        // Optional: We could also deactivate all users in this branch, but let's keep it simple for now as requested.

        revalidatePath('/branches/manage');
        revalidatePath('/branches/all');
        return { success: true };

    } catch (error) {
        console.error('Failed to archive branch:', error);
        return { success: false, error: 'Failed to archive branch.' };
    }
}
