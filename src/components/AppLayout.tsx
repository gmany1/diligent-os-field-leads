'use client';

import { usePathname } from 'next/navigation';
import AppSidebar from './AppSidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLoginPage = pathname === '/login' || pathname === '/register';

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
            {!isLoginPage && <AppSidebar />}
            <main className={`flex-1 transition-all duration-200 ${!isLoginPage ? 'md:pl-64 pt-16 md:pt-0' : ''}`}>
                {children}
            </main>
        </div>
    );
}
