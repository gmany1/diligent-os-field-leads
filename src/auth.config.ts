import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnLogin = nextUrl.pathname === '/login';
            const isApi = nextUrl.pathname.startsWith('/api/auth');

            console.log('Middleware Authorized Check:', {
                path: nextUrl.pathname,
                isLoggedIn,
                user: auth?.user?.email
            });

            // Siempre permitir rutas de auth
            if (isApi) return true;

            // Permitir página de login
            if (isOnLogin) return true;

            // Proteger otras rutas
            return isLoggedIn;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
                (session.user as any).role = token.role as string;
            }
            return session;
        },
    },
    providers: [],
} satisfies NextAuthConfig;
