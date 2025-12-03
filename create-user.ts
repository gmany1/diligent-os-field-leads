import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        const user = await prisma.user.upsert({
            where: { email: 'admin@diligentos.com' },
            update: {},
            create: {
                email: 'admin@diligentos.com',
                name: 'Admin User',
                role: 'MANAGER',
                password: 'password123', // Temporary password
            },
        })
        console.log('User created:', user)
    } catch (e) {
        console.error('Error creating user:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
