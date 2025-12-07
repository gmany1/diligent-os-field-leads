import { PrismaClient, Role } from '@prisma/client';
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
    // Wait, San Antonio manager is not in your explicit list, but we have a branch. 
    // I will add a placeholder for completeness matching the branch list if desired, 
    // but I will stick STRICTLY to your provided list first.

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
        branchId: 'BR-003', // El Monte per request
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

async function main() {
    console.log('🌱 Starting Seed...');

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

    for (const u of ORGANIZATION) {
        await prisma.user.upsert({
            where: { email: u.email },
            update: {
                // Force update details to ensure they match the list provided
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
        console.log(`Created/Updated User: ${u.name} [${u.role}]`);
    }

    // 3. Seed Sample Leads
    console.log('🌱 Seeding Sample Leads...');

    // Sample: LA Lead (Visible to Sarah Williams & Amanda Rodriguez)
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

    // Sample: San Antonio Lead (Visible to Jessica Wilson)
    await prisma.lead.create({
        data: {
            name: 'Alamo Logistics Center',
            stage: 'HOT',
            branchId: 'BR-005',
            branchString: 'San Antonio',
            notes: 'Urgent need for 50+ workers.'
        }
    });

    // Sample: El Monte Lead (Visible to Jennifer Davis & Kevin Anderson)
    await prisma.lead.create({
        data: {
            name: 'San Gabriel Valley Tech Park',
            stage: 'WARM',
            branchId: 'BR-003',
            branchString: 'El Monte',
            notes: 'Pending final contract review.'
        }
    });

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
