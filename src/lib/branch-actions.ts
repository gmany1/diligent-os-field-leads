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

    if (role !== 'IT_SUPER_ADMIN' && role !== 'IT_ADMIN') {
        return { success: false, error: 'Unauthorized: Only IT Admins can delete branches' };
    }

    try {
        // SAFETY CHECK 1: Active Users
        const userCount = await prisma.user.count({
            where: { branchId: id }
        });

        if (userCount > 0) {
            return {
                success: false,
                error: `Cannot delete: Branch has ${userCount} assigned users. Reassign them first.`
            };
        }

        // SAFETY CHECK 2: Active Leads
        const leadCount = await prisma.lead.count({
            where: { branchId: id }
        });

        if (leadCount > 0) {
            // Note: Schema might restrict this via foreign key constraints anyway, but good to have explicit msg
            return {
                success: false,
                error: `Cannot delete: Branch has ${leadCount} associated leads. Archive or transfer them first.`
            };
        }

        await prisma.branch.delete({
            where: { id }
        });

        revalidatePath('/branches/manage');
        revalidatePath('/branches/all');
        return { success: true };

    } catch (error) {
        console.error('Failed to delete branch:', error);
        return { success: false, error: 'Failed to delete branch.' };
    }
}
