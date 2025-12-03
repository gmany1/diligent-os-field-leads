try {
    const pkg = require('@prisma/client');
    if (pkg.PrismaClient) {
        const prisma = new pkg.PrismaClient();
        console.log('Prisma instance created');

        async function main() {
            try {
                const user = await prisma.user.upsert({
                    where: { email: 'admin@diligentos.com' },
                    update: {},
                    create: {
                        email: 'admin@diligentos.com',
                        name: 'Admin User',
                        role: 'MANAGER',
                    },
                })
                console.log('User created:', user)
            } catch (e) {
                console.error('Error creating user:', e)
            } finally {
                await prisma.$disconnect()
            }
        }
        main();
    } else {
        console.log('PrismaClient is MISSING');
    }
} catch (e) {
    console.error('Error requiring package:', e);
}
