'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            console.error('AuthError:', error.type, error.message);
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        // If it's a redirect error (NEXT_REDIRECT), we must re-throw it
        if ((error as any).digest?.startsWith('NEXT_REDIRECT')) {
            throw error;
        }

        console.error('Unexpected login error:', error);
        return 'An unexpected error occurred. Please try again.';
    }
}
