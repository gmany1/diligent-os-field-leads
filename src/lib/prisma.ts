import { PrismaClient } from '@prisma/client';

// Polyfill for BigInt serialization
(BigInt.prototype as any).toJSON = function () {
    return this.toString();
};

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        log: ['query', 'error', 'warn'],
    });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
