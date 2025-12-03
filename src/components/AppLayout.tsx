'use client';

import { usePathname } from 'next/navigation';
import Navigation from './Navigation';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLoginPage = pathname === '/login' || pathname === '/register';

    return (
        <div className="flex min-h-screen">
            {!isLoginPage && <Navigation />}
            <main className={`flex-1 transition-all duration-200 ${!isLoginPage ? 'md:pl-64' : ''}`}>
                {children}
            </main>
        </div>
    );
}
