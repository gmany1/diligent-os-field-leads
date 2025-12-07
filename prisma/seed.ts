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
        name: 'Sal Ingles',
        email: 'sal.ingles@diligentos.com',
        role: Role.CEO,
        branchId: null, // Global
        password: 'password123'
    },
    {
        name: 'Ana Perez',
        email: 'ana.perez@diligentos.com',
        role: Role.CAO,
        branchId: null,
        password: 'password123'
    },
    {
        name: 'Ana I Gonzalez',
        email: 'ana.gonzalez@diligentos.com',
        role: Role.DOO,
        branchId: null,
        password: 'password123'
    },
    // Technology
    {
        name: 'Jorge Ayala',
        email: 'jorge.ayala@diligentos.com',
        role: Role.IT_SUPER_ADMIN,
        branchId: null,
        password: 'password123'
    },
    // Branch Managers
    {
        name: 'Jesus Ramos',
        email: 'jesus.ramos@diligentos.com',
        role: Role.BRANCH_MANAGER,
        branchId: 'BR-001',
        password: 'password123'
    },
    {
        name: 'Doris Ibarra',
        email: 'doris.ibarra@diligentos.com',
        role: Role.BRANCH_MANAGER,
        branchId: 'BR-003',
        password: 'password123'
    },
    {
        name: 'Erika Galvez',
        email: 'erika.galvez@diligentos.com',
        role: Role.BRANCH_MANAGER,
        branchId: 'BR-004',
        password: 'password123'
    },
    {
        name: 'Dullian Lopez',
        email: 'dullian.lopez@diligentos.com',
        role: Role.BRANCH_MANAGER,
        branchId: 'BR-005',
        password: 'password123'
    },
    // Staff (Por asignar branch - vamos a asignar aleatorio o uno default para testing)
    {
        name: 'Saira Baires',
        email: 'saira.baires@diligentos.com',
        role: Role.STAFFING_REP,
        branchId: 'BR-001', // Assigned for test
        password: 'password123'
    },
    {
        name: 'Maria Centeno',
        email: 'maria.centeno@diligentos.com',
        role: Role.STAFFING_REP,
        branchId: 'BR-001',
        password: 'password123'
    },
    {
        name: 'Alondra Gonzalez',
        email: 'alondra.gonzalez@diligentos.com',
        role: Role.STAFFING_REP,
        branchId: 'BR-003',
        password: 'password123'
    },
    {
        name: 'Manuel Cardenas',
        email: 'manuel.cardenas@diligentos.com',
        role: Role.SALES_REP,
        branchId: 'BR-005',
        password: 'password123'
    }
];

// Combine basic test users with real org structure
const TEST_USERS = [
    {
        name: 'CEO User',
        email: 'ceo@diligentos.com',
        role: Role.CEO,
        branchId: null,
        password: 'password123'
    },
    {
        name: 'Admin User',
        email: 'admin@diligentos.com',
        role: Role.IT_ADMIN,
        branchId: null,
        password: 'password123'
    },
    {
        name: 'Branch Manager',
        email: 'manager@diligentos.com',
        role: Role.BRANCH_MANAGER,
        branchId: null, // Will be set manually if needed, or left global for testing
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
        // Use BR code as ID to match user expectations
        await prisma.branch.upsert({
            where: { code: b.code },
            update: {},
            create: {
                id: b.id, // Force our ID
                name: b.name,
                address: b.address,
                city: b.city,
                state: b.state,
                code: b.code
            }
        });
        console.log(`Created Branch: ${b.name}`);
    }

    // 2. Seed Real Organization Users
    const hashedPassword = await hash('password123', 10);

    // Merge Real Org and Test Users
    const ALL_USERS = [...ORGANIZATION, ...TEST_USERS];

    for (const u of ALL_USERS) {
        await prisma.user.upsert({
            where: { email: u.email },
            update: {
                role: u.role,
                branchId: u.branchId,
                name: u.name,
                // Only update password if strictly necessary (optional)
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

    // Lead in LA (BR-001)
    await prisma.lead.create({
        data: {
            name: 'LA Gym Franchise',
            stage: 'COLD',
            branchId: 'BR-001',
            branchString: 'Los Angeles', // Legacy
            source: 'MANUAL',
            notes: 'Expansion project in Downtown'
        }
    });

    // Lead in San Antonio (BR-005)
    // Find Manuel first to assign
    const manuel = await prisma.user.findUnique({ where: { email: 'manuel.cardenas@diligentos.com' } });
    if (manuel) {
        await prisma.lead.create({
            data: {
                name: 'Texas BBQ Chain',
                stage: 'HOT',
                branchId: 'BR-005',
                branchString: 'San Antonio',
                assignedToId: manuel.id,
                notes: 'High value contract'
            }
        });
    }

    // Lead in El Monte (BR-003)
    await prisma.lead.create({
        data: {
            name: 'El Monte Logistics',
            stage: 'WARM',
            branchId: 'BR-003',
            branchString: 'El Monte',
            notes: 'Warehouse staffing needs'
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
