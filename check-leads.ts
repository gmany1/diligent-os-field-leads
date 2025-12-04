import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const leadCount = await prisma.lead.count();
        console.log(`Total leads: ${leadCount}`);
        const leads = await prisma.lead.findMany({ take: 5 });
        console.log('Sample leads:', JSON.stringify(leads, null, 2));
    } catch (error) {
        console.error('Error fetching leads:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
