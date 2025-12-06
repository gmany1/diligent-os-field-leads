const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
    console.log('Starting seed...')
    const hashedPassword = await bcrypt.hash('password123', 10)

    try {
        // 1. Create Admin User
        const admin = await prisma.user.upsert({
            where: { email: 'admin@diligentos.com' },
            update: {
                password: hashedPassword, // Ensure password is reset if user exists
            },
            create: {
                email: 'admin@diligentos.com',
                name: 'Admin User',
                role: 'MANAGER',
                password: hashedPassword,
            },
        })
        console.log('Admin created:', admin)

        // 2. Create Field Rep
        const rep = await prisma.user.upsert({
            where: { email: 'rep@diligentos.com' },
            update: {
                password: hashedPassword, // Ensure password is reset if user exists
            },
            create: {
                email: 'rep@diligentos.com',
                name: 'Field Rep',
                role: 'FIELD_LEAD_REP',
                password: hashedPassword,
            },
        })
        console.log('Rep created:', rep)

        // 3. Create Leads
        const leadsData = [
            { name: 'Acme Corp', address: '123 Business Rd', phone: '+15550101', stage: 'COLD', assignedToId: rep.id },
            { name: 'Globex Inc', address: '456 Enterprise Blvd', phone: '+15550102', stage: 'WARM', assignedToId: rep.id },
            { name: 'Soylent Corp', address: '789 Industrial Ave', phone: '+15550103', stage: 'HOT', assignedToId: rep.id },
            { name: 'Initech', address: '101 Tech Park', phone: '+15550104', stage: 'QUOTE', assignedToId: rep.id },
            { name: 'Umbrella Corp', address: '202 Bio Labs', phone: '+15550105', stage: 'WON', assignedToId: rep.id },
        ]

        for (const leadData of leadsData) {
            const lead = await prisma.lead.create({ data: leadData })
            await prisma.activity.create({
                data: { type: 'NOTE', description: `Initial contact with ${leadData.name}`, leadId: lead.id, userId: rep.id }
            })
        }
        console.log('Leads created')

        // 4. Create Quotes
        const quoteLead = await prisma.lead.findFirst({ where: { stage: 'QUOTE' } })
        if (quoteLead) {
            await prisma.quote.create({
                data: { amount: 5000.00, status: 'SENT', leadId: quoteLead.id, createdById: rep.id }
            })
        }
        console.log('Quote created')

    } catch (e) {
        console.error('Error seeding:', e)
        process.exit(1)
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
