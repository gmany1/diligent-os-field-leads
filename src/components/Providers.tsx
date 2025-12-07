'use client';

import { SessionProvider } from 'next-auth/react';
import ReactQueryProvider from '@/lib/react-query';
import { OfflineProvider } from '@/context/OfflineContext';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ResponsiveThemeHandler } from '@/components/ResponsiveThemeHandler';
import { Toaster } from 'sonner';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <ReactQueryProvider>
                <OfflineProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        {/* <ResponsiveThemeHandler />  Removed to allow manual toggle */}
                        {children}
                    </ThemeProvider>
                </OfflineProvider>
                <Toaster />
            </ReactQueryProvider>
        </SessionProvider>
    );
}
