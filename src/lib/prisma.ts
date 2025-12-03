// import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: any }

console.log('Initializing Prisma Client (Mock/Real)...');

let prismaInstance: any;

try {
    // Try to instantiate the real client using require to avoid build errors
    const { PrismaClient } = require('@prisma/client');
    prismaInstance = globalForPrisma.prisma || new PrismaClient({
        log: ['query', 'error', 'warn'],
    });
} catch (e) {
    console.warn("Failed to initialize Prisma Client. Using Mock Client for Preview.", e);

    // Mock Client Implementation
    prismaInstance = {
        user: {
            create: async (args: any) => {
                console.log("Mock User Create:", args);
                return { id: `mock_user_${Date.now()}`, ...args.data };
            },
            delete: async () => { return { success: true } }
        }
    };
}

export const prisma = prismaInstance;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
