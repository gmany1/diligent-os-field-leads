'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    console.log('authenticate action called');
    try {
        await signIn('credentials', formData);
        console.log('signIn successful');
    } catch (error) {
        console.error('signIn failed:', error);
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    console.error('AuthError Type:', error.type);
                    console.error('Full AuthError:', JSON.stringify(error, null, 2));
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}
