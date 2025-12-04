'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, History, Database, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Navigation() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);

    const navigation = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'CRM', href: '/crm', icon: Menu },
        { name: 'History', href: '/history', icon: History },
        // Only show Migration to Admins/Executives
        ...(session?.user?.role === 'IT_ADMIN' || session?.user?.role === 'EXECUTIVE'
            ? [{ name: 'Migration', href: '/admin/migration', icon: Database }]
            : [])
    ];

    return (
        <>
            {/* Mobile menu button */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 rounded-md bg-white dark:bg-gray-800 shadow-md text-gray-600 dark:text-gray-200"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar */}
            <div className={`
                fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-200 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
            `}>
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-800">
                        <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">DiligentOS</span>
                    </div>

                    <div className="flex-1 overflow-y-auto py-4">
                        <nav className="px-2 space-y-1">
                            {navigation.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className={`
                                            flex items-center px-4 py-2 text-sm font-medium rounded-md group transition-colors
                                            ${isActive
                                                ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'}
                                        `}
                                    >
                                        <item.icon
                                            className={`mr-3 h-5 w-5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-400'}`}
                                        />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{session?.user?.name || 'User'}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate w-48">{session?.user?.email}</p>
                                </div>
                            </div>
                            <ThemeToggle />
                        </div>
                        <button
                            onClick={() => signOut()}
                            className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                        >
                            <LogOut className="mr-3 h-5 w-5" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
