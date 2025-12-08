import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import BranchDetailsClient from '@/components/branches/BranchDetailsClient';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function BranchPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session?.user) {
        redirect('/login');
    }

    // In strict RBAC, checking if user has access to THIS branch would happen here.
    // For now, allowing all authorized users to view (or relying on menu-config to hide it).

    const { id } = await params;

    const branch = await prisma.branch.findUnique({
        where: { id },
        include: {
            users: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    createdAt: true,
                    _count: {
                        select: { leads: true }
                    }
                },
                orderBy: {
                    role: 'asc' // Managers (B) usually before Staff (S) alphabetically, helpful default
                }
            },
            _count: {
                select: { leads: true }
            }
        }
    });

    if (!branch) {
        return notFound();
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Pass initial data to client component */}
            <BranchDetailsClient branch={branch} />
        </div>
    );
}
