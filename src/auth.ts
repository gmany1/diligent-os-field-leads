import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

async function getUser(email: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        return user;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
    ...authConfig,
    trustHost: true,
    session: { strategy: 'jwt' },
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    console.log(`[Auth] Attempting login for: ${email}`);

                    const user = await getUser(email);
                    if (!user) {
                        console.log(`[Auth] User not found: ${email}`);
                        return null;
                    }

                    const passwordsMatch = await bcrypt.compare(password, user.password);
                    if (passwordsMatch) {
                        console.log(`[Auth] Login successful for: ${email}`);
                        return user;
                    } else {
                        console.log(`[Auth] Password mismatch for: ${email}`);
                    }
                } else {
                    console.log('[Auth] Invalid credentials format');
                }

                return null;
            },
        }),
    ],
});
