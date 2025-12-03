import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export default NextAuth(authConfig).auth;

export const config = {
    // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
    matcher: ['/((?!api/auth|api/admin/reset|api/admin/debug|register|_next/static|_next/image|.*\\.png$|manifest.webmanifest$).*)'],
};
