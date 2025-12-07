import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// Initial System Roles (aligned with Prisma Enum)
const SYSTEM_ROLES = [
    { id: 'CEO', name: 'Chief Executive Officer', desc: 'Full access to all business metrics and reports.', type: 'Executive', isSystem: true },
    { id: 'CAO', name: 'Chief Admin Officer', desc: 'Oversees administrative functions and compliance.', type: 'Executive', isSystem: true },
    { id: 'DOO', name: 'Director of Operations', desc: 'Manages operational workflows and branch performance.', type: 'Executive', isSystem: true },
    { id: 'AREA_DIRECTOR', name: 'Area Director', desc: 'Regional oversight of multiple branches.', type: 'Management', isSystem: true },
    { id: 'BRANCH_MANAGER', name: 'Branch Manager', desc: 'Manages a specific branch and its team.', type: 'Management', isSystem: true },
    { id: 'STAFFING_REP', name: 'Staffing Representative', desc: 'Handles recruitment and personnel.', type: 'Staff', isSystem: true },
    { id: 'SALES_REP', name: 'Sales Representative', desc: 'Field agent focused on lead generation.', type: 'Field', isSystem: true },
    { id: 'IT_SUPER_ADMIN', name: 'IT Super Admin', desc: 'Full system configuration and maintenance access.', type: 'System', isSystem: true },
];

const LEGACY_ROLES = [
    { id: 'EXECUTIVE', name: 'Executive (Legacy)', desc: 'Legacy role, please migrate.', type: 'Legacy', isSystem: true },
    { id: 'MANAGER', name: 'Manager (Legacy)', desc: 'Legacy role, please migrate.', type: 'Legacy', isSystem: true },
    { id: 'FIELD_LEAD_REP', name: 'Field Lead Rep (Legacy)', desc: 'Legacy role, please migrate.', type: 'Legacy', isSystem: true },
    { id: 'IT_ADMIN', name: 'IT Admin (Legacy)', desc: 'Legacy role, please migrate.', type: 'Legacy', isSystem: true },
];

// Simulating database storage for custom roles and overrides
// In a real app, this would be a 'RoleDefinition' table
let customRoles: any[] = [];
let roleOverrides: Record<string, Partial<typeof SYSTEM_ROLES[0]>> = {};

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Get real user counts
        const usersByRole = await prisma.user.groupBy({
            by: ['role'],
            _count: { role: true },
        });

        // Merge System + Custom
        const allRoles = [...SYSTEM_ROLES, ...LEGACY_ROLES, ...customRoles].map(role => {
            // Apply overrides (e.g. edited descriptions)
            const base = { ...role, ...roleOverrides[role.id] };
            const count = usersByRole.find(r => r.role === base.id)?._count.role || 0;
            return { ...base, _count: { users: count } };
        });

        return NextResponse.json({ data: allRoles });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const newRole = {
            id: body.name.toUpperCase().replace(/\s+/g, '_'), // Auto-generate ID
            name: body.name,
            desc: body.desc,
            type: body.type || 'Custom',
            isSystem: false,
            createdAt: new Date().toISOString()
        };
        customRoles.push(newRole);
        return NextResponse.json({ success: true, data: newRole });
    } catch (e) {
        return NextResponse.json({ error: 'Failed to create role' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, ...updates } = body;

        // Check if it's a custom role
        const customIndex = customRoles.findIndex(r => r.id === id);
        if (customIndex >= 0) {
            customRoles[customIndex] = { ...customRoles[customIndex], ...updates };
        } else {
            // It's a system role, store override
            roleOverrides[id] = { ...roleOverrides[id], ...updates };
        }

        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        // Only allow deleting custom roles
        const initialLength = customRoles.length;
        customRoles = customRoles.filter(r => r.id !== id);

        if (customRoles.length === initialLength) {
            return NextResponse.json({ error: 'Cannot delete system roles or role not found' }, { status: 403 });
        }

        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
    }
}
