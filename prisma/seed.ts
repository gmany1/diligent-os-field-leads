import { PrismaClient } from '@prisma/client';
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('password123', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@diligentos.com' },
        update: { password: hashedPassword },
        create: {
            email: 'admin@diligentos.com',
            name: 'Admin User',
            password: hashedPassword,
            role: 'IT_ADMIN',
        },
    });

    const rep = await prisma.user.upsert({
        where: { email: 'rep@diligentos.com' },
        update: { password: hashedPassword },
        create: {
            email: 'rep@diligentos.com',
            name: 'Field Rep',
            password: hashedPassword,
            role: 'FIELD_LEAD_REP',
        },
    });

    console.log({ admin, rep });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
