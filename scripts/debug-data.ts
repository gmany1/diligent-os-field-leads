
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

async function main() {
    console.log('--- DEBUGGING DATABASE ---');
    console.log('Env DATABASE_URL:', process.env.DATABASE_URL);

    try {
        // 1. Check connection and raw tables
        const tables = await prisma.$queryRaw`SELECT name FROM sqlite_master WHERE type='table'`;
        console.log('Tables found:', tables);

        // 2. Count Data
        const userCount = await prisma.user.count();
        const leadCount = await prisma.lead.count();

        console.log(`Users: ${userCount}`);
        console.log(`Leads: ${leadCount}`);

        if (userCount > 0) {
            const users = await prisma.user.findMany({ take: 2 });
            console.log('Sample Users:', users);
        }

    } catch (error) {
        console.error('DB Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
