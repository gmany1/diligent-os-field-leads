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
                token.branchId = (user as any).branchId;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
                (session.user as any).role = token.role as string;
                (session.user as any).branchId = token.branchId as string | null;
            }
            return session;
        },
    },
    providers: [
        // Prepared for SSO (Feature Flagged)
        ...(process.env.SSO_M365 === 'true' ? [{
            id: "microsoft-entra-id",
            name: "Microsoft Entra ID",
            type: "oidc" as const,
            issuer: `https://login.microsoftonline.com/${process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID}/v2.0`,
            clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
            clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
        }] : [])
    ],
} satisfies NextAuthConfig;
