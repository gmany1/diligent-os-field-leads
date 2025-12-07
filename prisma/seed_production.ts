import { PrismaClient, Role, LeadStage } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Datos realistas
const BRANCHES = [
    { name: 'Los Angeles', address: '1234 Wilshire Blvd', city: 'Los Angeles', state: 'CA', code: 'BR-001' },
    { name: 'Norwalk', address: '5678 Pioneer Blvd', city: 'Norwalk', state: 'CA', code: 'BR-002' },
    { name: 'El Monte', address: '9012 Valley Blvd', city: 'El Monte', state: 'CA', code: 'BR-003' },
    { name: 'Moreno Valley', address: '3456 Alessandro Blvd', city: 'Moreno Valley', state: 'CA', code: 'BR-004' },
    { name: 'San Antonio', address: '7890 Broadway St', city: 'San Antonio', state: 'TX', code: 'BR-005' },
];

const USERS = [
    { email: 'ceo@diligentos.com', name: 'Robert Johnson', role: Role.CEO, password: 'password123', branchCode: 'BR-001' },
    { email: 'cao@diligentos.com', name: 'Maria Garcia', role: Role.CAO, password: 'password123', branchCode: 'BR-001' },
    { email: 'doo@diligentos.com', name: 'James Smith', role: Role.DOO, password: 'password123', branchCode: 'BR-001' },
    { email: 'it.admin@diligentos.com', name: 'David Chen', role: Role.IT_SUPER_ADMIN, password: 'password123', branchCode: 'BR-001' },

    // Branch Managers
    { email: 'manager.la@diligentos.com', name: 'Sarah Williams', role: Role.BRANCH_MANAGER, password: 'password123', branchCode: 'BR-001' },
    { email: 'manager.norwalk@diligentos.com', name: 'Michael Brown', role: Role.BRANCH_MANAGER, password: 'password123', branchCode: 'BR-002' },
    { email: 'manager.elmonte@diligentos.com', name: 'Jennifer Davis', role: Role.BRANCH_MANAGER, password: 'password123', branchCode: 'BR-003' },
    { email: 'manager.moreno@diligentos.com', name: 'Christopher Martinez', role: Role.BRANCH_MANAGER, password: 'password123', branchCode: 'BR-004' },

    // Staffing Reps
    { email: 'staffing.la@diligentos.com', name: 'Amanda Rodriguez', role: Role.STAFFING_REP, password: 'password123', branchCode: 'BR-001' },
    { email: 'staffing.norwalk@diligentos.com', name: 'Daniel Lopez', role: Role.STAFFING_REP, password: 'password123', branchCode: 'BR-002' },
    { email: 'staffing.sa@diligentos.com', name: 'Jessica Wilson', role: Role.STAFFING_REP, password: 'password123', branchCode: 'BR-005' },

    // Sales Rep
    { email: 'sales.rep@diligentos.com', name: 'Kevin Anderson', role: Role.SALES_REP, password: 'password123', branchCode: 'BR-003' },
];

const LEAD_SOURCES = ['REFERRAL', 'COLD_CALL', 'WEBSITE', 'LINKEDIN', 'TRADE_SHOW', 'EMAIL_CAMPAIGN'];
const INDUSTRIES = ['Manufacturing', 'Healthcare', 'Retail', 'Technology', 'Logistics', 'Hospitality', 'Construction', 'Finance'];
const ACTIVITY_TYPES = ['CALL', 'EMAIL', 'MEETING', 'FOLLOW_UP', 'NOTE', 'REMINDER'];

// Nombres de empresas realistas
const COMPANY_NAMES = [
    'Acme Manufacturing', 'TechCorp Solutions', 'Global Logistics Inc', 'Premier Healthcare',
    'Retail Dynamics', 'Innovation Labs', 'Metro Construction', 'Pacific Finance Group',
    'Sunrise Hospitality', 'Elite Manufacturing', 'Digital Solutions Co', 'Urban Retail',
    'MedTech Systems', 'Logistics Pro', 'BuildRight Construction', 'FinServe Partners',
    'Hotel Excellence', 'Industrial Works', 'Smart Tech Inc', 'Commerce Hub',
    'Healthcare Plus', 'Transport Solutions', 'Modern Buildings', 'Capital Advisors',
    'Grand Hotels', 'Precision Manufacturing', 'Cloud Systems', 'Retail Express',
];

function randomDate(start: Date, end: Date): Date {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomElement<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
    console.log('🧹 Limpiando base de datos...');

    // Limpiar en orden correcto (respetando foreign keys)
    await prisma.auditLog.deleteMany();
    await prisma.commission.deleteMany();
    await prisma.quote.deleteMany();
    await prisma.activity.deleteMany();
    await prisma.lead.deleteMany();
    await prisma.user.deleteMany();
    await prisma.branch.deleteMany();

    console.log('✅ Base de datos limpia\n');

    // 1. Crear Sucursales
    console.log('🏢 Creando 5 sucursales...');
    const branches = await Promise.all(
        BRANCHES.map(branch => prisma.branch.create({ data: branch }))
    );
    console.log(`✅ ${branches.length} sucursales creadas\n`);

    // 2. Crear Usuarios
    console.log('👥 Creando 12 usuarios...');
    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = await Promise.all(
        USERS.map(user => {
            const branch = branches.find(b => b.code === user.branchCode);
            return prisma.user.create({
                data: {
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    password: hashedPassword,
                    branchId: branch?.id,
                },
            });
        })
    );
    console.log(`✅ ${users.length} usuarios creados\n`);

    // 3. Crear 300 Leads
    console.log('📊 Creando 300 leads...');
    const now = new Date();
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());

    const stageDistribution = {
        COLD: 100,
        WARM: 80,
        HOT: 60,
        QUOTE: 40,
        WON: 20,
    };

    const leads = [];
    let leadIndex = 0;

    for (const [stage, count] of Object.entries(stageDistribution)) {
        for (let i = 0; i < count; i++) {
            const branch = randomElement(branches);
            const assignedUser = users.find(u => u.branchId === branch.id &&
                [Role.STAFFING_REP, Role.SALES_REP, Role.BRANCH_MANAGER].includes(u.role)) || users[0];

            const companyName = `${randomElement(COMPANY_NAMES)} ${leadIndex > COMPANY_NAMES.length ? leadIndex : ''}`.trim();

            const lead = await prisma.lead.create({
                data: {
                    name: companyName,
                    address: `${randomInt(100, 9999)} ${randomElement(['Main St', 'Oak Ave', 'Park Blvd', 'Market St', 'Broadway'])}`,
                    phone: `${randomInt(200, 999)}-${randomInt(200, 999)}-${randomInt(1000, 9999)}`,
                    email: `contact@${companyName.toLowerCase().replace(/\s+/g, '')}.com`,
                    stage: stage as LeadStage,
                    branchId: branch.id,
                    industry: randomElement(INDUSTRIES),
                    source: randomElement(LEAD_SOURCES),
                    notes: `Lead from ${randomElement(LEAD_SOURCES)}. Industry: ${randomElement(INDUSTRIES)}.`,
                    assignedToId: assignedUser.id,
                    vacancies: randomInt(1, 50),
                    vacanciesNote: `Looking for ${randomInt(1, 50)} positions in various departments`,
                    createdAt: randomDate(oneYearAgo, now),
                    updatedAt: randomDate(oneYearAgo, now),
                },
            });

            leads.push(lead);
            leadIndex++;
        }
    }
    console.log(`✅ ${leads.length} leads creados\n`);

    // 4. Crear Actividades (3-8 por lead)
    console.log('📝 Creando actividades...');
    let totalActivities = 0;

    for (const lead of leads) {
        const numActivities = randomInt(3, 8);
        const assignedUser = users.find(u => u.id === lead.assignedToId) || users[0];

        for (let i = 0; i < numActivities; i++) {
            const activityDate = randomDate(lead.createdAt, now);
            await prisma.activity.create({
                data: {
                    type: randomElement(ACTIVITY_TYPES),
                    description: `${randomElement(ACTIVITY_TYPES)} with ${lead.name} - ${randomElement(['Discussed staffing needs', 'Sent proposal', 'Follow-up call', 'Meeting scheduled', 'Contract review'])}`,
                    date: activityDate,
                    leadId: lead.id,
                    userId: assignedUser.id,
                    createdAt: activityDate,
                },
            });
            totalActivities++;
        }
    }
    console.log(`✅ ${totalActivities} actividades creadas\n`);

    // 5. Crear Cotizaciones (solo para QUOTE y WON)
    console.log('💰 Creando cotizaciones...');
    const quoteLeads = leads.filter(l => l.stage === LeadStage.QUOTE || l.stage === LeadStage.WON);
    const quotes = [];

    for (const lead of quoteLeads) {
        const numQuotes = lead.stage === LeadStage.WON ? randomInt(1, 2) : 1;
        const assignedUser = users.find(u => u.id === lead.assignedToId) || users[0];

        for (let i = 0; i < numQuotes; i++) {
            const amount = randomInt(5000, 150000);
            const status = lead.stage === LeadStage.WON ? 'ACCEPTED' : randomElement(['SENT', 'DRAFT']);

            const quote = await prisma.quote.create({
                data: {
                    amount,
                    status,
                    pdfUrl: `/quotes/${lead.id}-${Date.now()}.pdf`,
                    leadId: lead.id,
                    createdById: assignedUser.id,
                    createdAt: randomDate(lead.createdAt, now),
                    updatedAt: randomDate(lead.createdAt, now),
                },
            });

            quotes.push(quote);
        }
    }
    console.log(`✅ ${quotes.length} cotizaciones creadas\n`);

    // 6. Crear Comisiones (de cotizaciones ACCEPTED)
    console.log('💵 Creando comisiones...');
    const acceptedQuotes = quotes.filter(q => q.status === 'ACCEPTED');
    const commissions = [];

    for (const quote of acceptedQuotes) {
        const lead = leads.find(l => l.id === quote.leadId);
        if (!lead) continue;

        const assignedUser = users.find(u => u.id === lead.assignedToId) || users[0];
        const rateApplied = 0.10; // 10%
        const amount = quote.amount * rateApplied;
        const isPaid = Math.random() > 0.3; // 70% pagadas

        const commission = await prisma.commission.create({
            data: {
                amount,
                rateApplied,
                status: isPaid ? 'PAID' : 'PENDING',
                userId: assignedUser.id,
                leadId: lead.id,
                quoteId: quote.id,
                createdAt: quote.createdAt,
                paidAt: isPaid ? randomDate(quote.createdAt, now) : null,
            },
        });

        commissions.push(commission);
    }
    console.log(`✅ ${commissions.length} comisiones creadas\n`);

    // 7. Crear Registros de Auditoría
    console.log('📋 Creando registros de auditoría...');
    const auditActions = ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'EXPORT', 'CCPA_EXPORT', 'CCPA_DELETE'];
    const auditEntities = ['LEAD', 'USER', 'COMMISSION', 'QUOTE', 'ACTIVITY'];
    let totalAudits = 0;

    // Auditorías de creación de leads
    for (const lead of leads) {
        await prisma.auditLog.create({
            data: {
                userId: lead.assignedToId,
                action: 'CREATE',
                entity: 'LEAD',
                entityId: lead.id,
                details: JSON.stringify({ name: lead.name, stage: lead.stage }),
                ipAddress: `192.168.${randomInt(1, 255)}.${randomInt(1, 255)}`,
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                createdAt: lead.createdAt,
            },
        });
        totalAudits++;
    }

    // Auditorías adicionales (updates, exports, etc.)
    for (let i = 0; i < 300; i++) {
        const user = randomElement(users);
        const action = randomElement(auditActions);
        const entity = randomElement(auditEntities);

        await prisma.auditLog.create({
            data: {
                userId: user.id,
                action,
                entity,
                entityId: randomElement(leads).id,
                details: JSON.stringify({ action, timestamp: new Date() }),
                ipAddress: `192.168.${randomInt(1, 255)}.${randomInt(1, 255)}`,
                userAgent: randomElement([
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
                    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
                ]),
                createdAt: randomDate(oneYearAgo, now),
            },
        });
        totalAudits++;
    }
    console.log(`✅ ${totalAudits} registros de auditoría creados\n`);

    // Resumen final
    console.log('\n🎉 ¡Seed completado exitosamente!\n');
    console.log('📊 Resumen:');
    console.log(`   🏢 Sucursales: ${branches.length}`);
    console.log(`   👥 Usuarios: ${users.length}`);
    console.log(`   📊 Leads: ${leads.length}`);
    console.log(`      - COLD: ${leads.filter(l => l.stage === 'COLD').length}`);
    console.log(`      - WARM: ${leads.filter(l => l.stage === 'WARM').length}`);
    console.log(`      - HOT: ${leads.filter(l => l.stage === 'HOT').length}`);
    console.log(`      - QUOTE: ${leads.filter(l => l.stage === 'QUOTE').length}`);
    console.log(`      - WON: ${leads.filter(l => l.stage === 'WON').length}`);
    console.log(`   📝 Actividades: ${totalActivities}`);
    console.log(`   💰 Cotizaciones: ${quotes.length}`);
    console.log(`   💵 Comisiones: ${commissions.length}`);
    console.log(`   📋 Auditorías: ${totalAudits}`);
    console.log('\n✅ Base de datos lista para usar!\n');
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
