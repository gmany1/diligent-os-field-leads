'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

import { LoginSchema } from '@/lib/schemas';

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    const rawData = Object.fromEntries(formData);
    const validatedFields = LoginSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return 'Invalid credentials format.';
    }

    try {
        await signIn('credentials', { ...validatedFields.data, redirect: true, redirectTo: '/' });
        return 'success';
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
