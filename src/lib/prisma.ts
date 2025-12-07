import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
    // FALLBACK: Force the file: protocol if env var is missing or stale
    const url = process.env.DATABASE_URL?.startsWith('file:')
        ? process.env.DATABASE_URL
        : 'file:./dev.db';

    return new PrismaClient({
        datasources: {
            db: {
                url: url,
            },
        },
        log: ['error', 'warn'],
    });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}
