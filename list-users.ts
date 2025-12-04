import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function main() {
    try {
        const users = await prisma.user.findMany();
        const output = {
            count: users.length,
            users: users.map(u => ({ email: u.email, name: u.name, role: u.role }))
        };
        fs.writeFileSync('users_clean.json', JSON.stringify(output, null, 2));
        console.log('Done writing users_clean.json');
    } catch (error) {
        console.error('Error fetching users:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
