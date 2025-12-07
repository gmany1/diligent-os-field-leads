import { PrismaClient, Role, LeadStage, LeadSource, ActivityType, QuoteStatus, CommissionStatus } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

const BRANCHES = [
    { id: 'BR-001', name: 'Los Angeles', address: '2820 S Vermont Ave STE 21', city: 'Los Angeles', state: 'CA', code: 'LAX' },
    { id: 'BR-002', name: 'Norwalk', address: '11902 Firestone Blvd', city: 'Norwalk', state: 'CA', code: 'NWK' },
    { id: 'BR-003', name: 'El Monte', address: '9814 Garvey Ave', city: 'El Monte', state: 'CA', code: 'ELM' },
    { id: 'BR-004', name: 'Moreno Valley', address: '12220 Pigeon Pass Rd Suite I', city: 'Moreno Valley', state: 'CA', code: 'MOV' },
    { id: 'BR-005', name: 'San Antonio', address: '8546 Broadway Suite 212', city: 'San Antonio', state: 'TX', code: 'SAT' },
];

const ORGANIZATION = [
    // Executive Leadership (Global)
    {
        name: 'Robert Johnson', // Updated from Sal Ingles
        email: 'ceo@diligentos.com',
        role: Role.CEO,
        branchId: null, // Global
        password: 'password123'
    },
    {
        name: 'James Smith',
        email: 'doo@diligentos.com',
        role: Role.DOO,
        branchId: null,
        password: 'password123'
    },
    {
        name: 'David Chen',
        email: 'it.admin@diligentos.com',
        role: Role.IT_SUPER_ADMIN,
        branchId: null,
        password: 'password123'
    },
    // Branch Managers
    {
        name: 'Sarah Williams',
        email: 'manager.la@diligentos.com',
        role: Role.BRANCH_MANAGER,
        branchId: 'BR-001',
        password: 'password123'
    },
    {
        name: 'Michael Brown',
        email: 'manager.norwalk@diligentos.com',
        role: Role.BRANCH_MANAGER,
        branchId: 'BR-002',
        password: 'password123'
    },
    {
        name: 'Jennifer Davis',
        email: 'manager.elmonte@diligentos.com',
        role: Role.BRANCH_MANAGER,
        branchId: 'BR-003',
        password: 'password123'
    },
    {
        name: 'Christopher Martinez',
        email: 'manager.moreno@diligentos.com',
        role: Role.BRANCH_MANAGER,
        branchId: 'BR-004',
        password: 'password123'
    },
    // Staffing Reps
    {
        name: 'Amanda Rodriguez',
        email: 'staffing.la@diligentos.com',
        role: Role.STAFFING_REP,
        branchId: 'BR-001',
        password: 'password123'
    },
    {
        name: 'Daniel Lopez',
        email: 'staffing.norwalk@diligentos.com',
        role: Role.STAFFING_REP,
        branchId: 'BR-002',
        password: 'password123'
    },
    {
        name: 'Jessica Wilson',
        email: 'staffing.sa@diligentos.com',
        role: Role.STAFFING_REP,
        branchId: 'BR-005', // San Antonio
        password: 'password123'
    },
    {
        name: 'Kevin Anderson',
        email: 'sales.rep@diligentos.com',
        role: Role.SALES_REP,
        branchId: 'BR-003', // El Monte
        password: 'password123'
    },
    // Legacy / Basic Users
    {
        name: 'Admin User',
        email: 'admin@diligentos.com',
        role: Role.IT_ADMIN,
        branchId: null,
        password: 'password123'
    },
    {
        name: 'Field Rep',
        email: 'rep@diligentos.com',
        role: Role.FIELD_LEAD_REP,
        branchId: null,
        password: 'password123'
    }
];

// Helper to get random item from array
const random = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

// Helper to generate large number of leads
const generateLeads = (count: number, users: any[]) => {
    const leads = [];
    const industries = ['Manufacturing', 'Healthcare', 'Retail', 'Technology', 'Logistics', 'Hospitality', 'Construction', 'Finance'];

    for (let i = 0; i < count; i++) {
        // Assign to a Staffing Rep or Manager (users with a branchId)
        const possibleAssignees = users.filter(u => u.branchId !== null);
        const asignee = random(possibleAssignees);
        const branch = BRANCHES.find(b => b.id === asignee.branchId);

        if (!branch) continue;

        const stage = random(Object.values(LeadStage));
        const status = ['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'CLOSED'][Math.floor(Math.random() * 6)];

        leads.push({
            name: `${industries[Math.floor(Math.random() * industries.length)]} Corp ${i + 1}`,
            stage: stage as LeadStage,
            branchId: branch.id,
            branchString: branch.id, // For legacy support
            source: random(Object.values(LeadSource)) as LeadSource,
            assignedToEmail: asignee.email, // We'll resolve ID later
            notes: `Auto-generated lead for ${branch.name} market needs.`,
            value: Math.floor(Math.random() * 50000) + 5000
        });
    }
    return leads;
};

async function main() {
    console.log('🌱 Starting Comprehensive Seed...');

    // 1. Seed Branches
    for (const b of BRANCHES) {
        await prisma.branch.upsert({
            where: { code: b.code },
            update: {},
            create: {
                id: b.id,
                name: b.name,
                address: b.address,
                city: b.city,
                state: b.state,
                code: b.code
            }
        });
        console.log(`Created Branch: ${b.name}`);
    }

    // 2. Seed Organization Users
    const hashedPassword = await hash('password123', 10);
    const userMap = new Map(); // Store email -> id mapping

    for (const u of ORGANIZATION) {
        const user = await prisma.user.upsert({
            where: { email: u.email },
            update: {
                role: u.role,
                branchId: u.branchId,
                name: u.name,
                password: hashedPassword
            },
            create: {
                email: u.email,
                name: u.name,
                password: hashedPassword,
                role: u.role,
                branchId: u.branchId
            }
        });
        userMap.set(u.email, user.id);
        console.log(`Created/Updated User: ${u.name} [${u.role}]`);
    }

    // 3. Seed Sample Leads (Specific High Value Ones)
    console.log('🌱 Seeding High Value Leads...');

    // LA Lead
    await prisma.lead.create({
        data: {
            name: 'LA Downtown Gym',
            stage: 'COLD',
            branchId: 'BR-001',
            branchString: 'Los Angeles',
            source: 'MANUAL',
            notes: 'Requires large staffing crew for night shift.'
        }
    });

    // San Antonio Lead
    await prisma.lead.create({
        data: {
            name: 'Alamo Logistics Center',
            stage: 'HOT',
            branchId: 'BR-005',
            branchString: 'San Antonio',
            assignedToId: userMap.get('staffing.sa@diligentos.com'),
            notes: 'Urgent need for 50+ workers.'
        }
    });

    // El Monte Lead
    await prisma.lead.create({
        data: {
            name: 'San Gabriel Valley Tech Park',
            stage: 'WARM',
            branchId: 'BR-003',
            branchString: 'El Monte',
            notes: 'Pending final contract review.'
        }
    });

    // 4. Seed Volume Leads (for dashboard charts)
    console.log('🌱 Seeding Volume Leads (50+)...');
    const volumeLeads = generateLeads(50, ORGANIZATION);

    for (const lead of volumeLeads) {
        const createdLead = await prisma.lead.create({
            data: {
                name: lead.name,
                stage: lead.stage,
                branchId: lead.branchId,
                branchString: lead.branchString,
                source: lead.source,
                assignedToId: userMap.get(lead.assignedToEmail),
                notes: lead.notes,
                potentialValue: lead.value
            }
        });

        // Add some random activity
        if (Math.random() > 0.5) {
            await prisma.activity.create({
                data: {
                    type: random([ActivityType.CALL, ActivityType.EMAIL, ActivityType.MEETING]),
                    description: 'Initial outreach and follow-up',
                    leadId: createdLead.id,
                    userId: userMap.get(lead.assignedToEmail) || userMap.get('ceo@diligentos.com') // Fallback to CEO if user not found
                }
            });
        }
    }

    console.log('✅ Leads Seeded.');
    console.log('✅ Seed Complete.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
