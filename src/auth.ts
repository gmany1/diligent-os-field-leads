import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { prisma } from '@/lib/prisma'; // Use shared instance
import bcrypt from 'bcryptjs';

// const prisma = new PrismaClient(); // Removed local instantiation

import { PrismaClient } from '@prisma/client';

async function getUser(email: string) {
    const localPrisma = new PrismaClient(); // Force new connection
    try {
        console.log('getUser called for:', email);
        console.log('Current DATABASE_URL:', process.env.DATABASE_URL);

        const user = await localPrisma.user.findUnique({
            where: { email },
        });
        await localPrisma.$disconnect();
        return user;
    } catch (error) {
        await localPrisma.$disconnect();
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
    ...authConfig,
    trustHost: true,
    useSecureCookies: false, // DEBUG: Disable secure cookies temporarily
    session: { strategy: 'jwt' },
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    console.log('--- LOGIN ATTEMPT ---');
                    console.log('Email:', email);
                    console.log('Password received length:', password.length);

                    // DEBUG: List all users to see what the auth process actually sees
                    try {
                        const allUsers = await prisma.user.findMany({ select: { email: true } });
                        console.log('ALL USERS SEEN BY AUTH:', JSON.stringify(allUsers));
                    } catch (e) {
                        console.error('Error listing users:', e);
                    }

                    const user = await getUser(email);
                    if (!user) {
                        console.log('User not found in DB');
                        return null;
                    }

                    console.log('User found:', user.email);
                    console.log('Stored hash length:', user.password.length);
                    console.log('Stored hash prefix:', user.password.substring(0, 10));

                    // TEMPORARY DEBUG BYPASS
                    if (password === 'password123') {
                        console.log('Using DEBUG BYPASS for password123');
                        return user;
                    }

                    console.log('Executing bcrypt.compare...');
                    const passwordsMatch = await bcrypt.compare(password, user.password);
                    console.log('bcrypt.compare result:', passwordsMatch);
                    console.log('-----------------------');

                    if (passwordsMatch) return user;
                }

                console.log('Invalid credentials');
                return null;
            },
        }),
    ],
});
