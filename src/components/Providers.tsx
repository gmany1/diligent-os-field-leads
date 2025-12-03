'use client';

import { SessionProvider } from 'next-auth/react';
import ReactQueryProvider from '@/lib/react-query';
import { OfflineProvider } from '@/context/OfflineContext';
import { Toaster } from 'sonner';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <ReactQueryProvider>
                <OfflineProvider>
                    {children}
                </OfflineProvider>
                <Toaster />
            </ReactQueryProvider>
        </SessionProvider>
    );
}
