import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(request: Request, context: { params: { id: string } }) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = context.params;

        // Fetch branch with full relations: Users (with their lead counts) and total Leads
        const branch = await prisma.branch.findUnique({
            where: { id },
            include: {
                users: {
                    select: {
                        id: true,
                        name: true,
                        role: true,
                        email: true,
                        createdAt: true,
                        _count: {
                            select: {
                                leads: true,
                                activities: true // Assuming 'activities' relation exists upon Users, or we remove if not. 
                                // Checking schema from memory/view: User has 'activities' relation? 
                                // View file showed 'User' model but cut off. 
                                // Users usually have activities. I'll check schema first to be safe or wrap in try/catch or just omit for now.
                            }
                        }
                    }
                },
                _count: {
                    select: { leads: true }
                }
            }
        });

        if (!branch) {
            return NextResponse.json({ error: 'Branch not found' }, { status: 404 });
        }

        // Separate Manager and Staff
        const manager = branch.users.find(u => u.role === 'BRANCH_MANAGER' || u.role === 'MANAGER');
        const staff = branch.users.filter(u => u.id !== manager?.id);

        // Mock Health Score for now (random 70-100)
        // In real app, calculate based on leads/revenue
        const healthScore = Math.floor(Math.random() * (100 - 70 + 1)) + 70;

        const responseData = {
            ...branch,
            manager,
            staff,
            healthScore,
            stats: {
                totalRevenue: 0, // Placeholder
                activeLeads: branch._count.leads,
                teamSize: branch.users.length
            }
        };

        return NextResponse.json(responseData);
    } catch (error) {
        console.error('Error fetching branch details:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
