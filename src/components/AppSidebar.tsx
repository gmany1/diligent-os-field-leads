'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { MENU_CONFIG, MenuItem } from '@/lib/menu-config';
import { Menu, X, LogOut, ChevronDown, ChevronRight, Plus } from 'lucide-react';

export default function AppSidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false); // Mobile toggle
    const [expandedItems, setExpandedItems] = useState<string[]>(['Dashboard', 'Leads']); // Default expanded

    const userRole = session?.user?.role || 'GUEST';

    const toggleExpand = (name: string) => {
        setExpandedItems(prev =>
            prev.includes(name) ? prev.filter(item => item !== name) : [...prev, name]
        );
    };

    const hasAccess = (item: MenuItem) => {
        if (!item.roles) return true;
        return item.roles.includes(userRole);
    };

    const renderMenuItem = (item: MenuItem, depth = 0) => {
        if (!hasAccess(item)) return null;

        const isExpanded = expandedItems.includes(item.name);
        // Check if any child is active
        const hasActiveChild = item.items?.some(sub => sub.href === pathname);
        const isActive = pathname === item.href;

        return (
            <div key={item.name} className="mb-1">
                {item.items ? (
                    // Parent Item (Collapsible)
                    <div>
                        <button
                            onClick={() => toggleExpand(item.name)}
                            className={`
                                w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors
                                ${hasActiveChild
                                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/10'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}
                            `}
                        >
                            <div className="flex items-center">
                                {item.icon && <item.icon size={18} className="mr-3 opactity-70" />}
                                <span>{item.name}</span>
                            </div>
                            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>
                        {/* Submenu */}
                        {isExpanded && (
                            <div className="ml-4 pl-3 border-l border-gray-200 dark:border-gray-700 mt-1 space-y-1">
                                {item.items.map(sub => renderMenuItem(sub, depth + 1))}
                            </div>
                        )}
                    </div>
                ) : (
                    // Leaf Item (Link)
                    <Link
                        href={item.href || '#'}
                        onClick={() => setIsOpen(false)} // Close mobile menu on click
                        className={`
                            flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                            ${isActive
                                ? 'bg-indigo-600 text-white'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'}
                        `}
                    >
                        {item.icon && <item.icon size={18} className="mr-3" />}
                        {item.name}
                    </Link>
                )}
            </div>
        );
    };

    return (
        <>
            {/* Mobile Header & Toggle */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-50 flex items-center px-4 justify-between">
                <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">DiligentOS</span>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 rounded-md text-gray-600 dark:text-gray-200"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar Container */}
            <div className={`
                fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-200 ease-in-out font-sans overflow-hidden flex flex-col
                ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:top-0 top-16
            `}>
                {/* Desktop Logo */}
                <div className="hidden md:flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-800 shrink-0">
                    <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">DiligentOS</span>
                </div>

                {/* Primary Action Button */}
                <div className="p-4 shrink-0">
                    <Link href="/leads/create" className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 shadow-sm transition-colors">
                        <Plus size={16} className="mr-2" />
                        Create Lead
                    </Link>
                </div>

                {/* Scrollable Menu Area */}
                <div className="flex-1 overflow-y-auto px-3 py-2 custom-scrollbar">
                    <nav className="space-y-1 pb-10">
                        {MENU_CONFIG.map(item => renderMenuItem(item))}
                    </nav>
                </div>

                {/* User Footer */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-800 shrink-0 bg-gray-50 dark:bg-gray-900/50">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex-1 min-w-0 mr-2">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{session?.user?.name || 'User'}</p>
                            <div className="flex items-center mt-0.5">
                                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{userRole}</p>
                            </div>
                        </div>
                        <ThemeToggle />
                    </div>
                    <button
                        onClick={() => signOut()}
                        className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                    >
                        <LogOut size={16} className="mr-2" />
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
