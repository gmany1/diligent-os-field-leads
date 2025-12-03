import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@diligentos.com';
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.upsert({
            where: { email },
            update: {
                password: hashedPassword,
                role: 'IT_ADMIN',
            },
            create: {
                email,
                name: 'Admin User',
                password: hashedPassword,
                role: 'IT_ADMIN',
            },
        });
        console.log('Admin user created/updated:', user);
    } catch (e) {
        console.error('Error creating admin user:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
