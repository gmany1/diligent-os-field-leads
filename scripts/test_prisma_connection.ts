import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: 'postgresql://diligent_user:diligent_password@127.0.0.1:5432/postgres',
        },
    },
})

async function main() {
    try {
        console.log('Attempting to connect with Prisma...')
        await prisma.$connect()
        console.log('Successfully connected to database!')

        // Check for pgcrypto
        const result = await prisma.$queryRaw`SELECT * FROM pg_extension WHERE extname = 'pgcrypto';`
        console.log('pgcrypto check:', result)

    } catch (e: any) {
        console.error('Connection failed!')
        console.log('Error Message:', e.message)
        console.log('Error Code:', e.code)
    } finally {
        await prisma.$disconnect()
    }
}

main()
