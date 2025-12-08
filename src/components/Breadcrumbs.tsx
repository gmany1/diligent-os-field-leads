'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs() {
    const pathname = usePathname();
    const paths = pathname.split('/').filter(Boolean);

    if (paths.length === 0) return null;

    return (
        <nav className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4 font-medium" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center transition-colors">
                <Home size={16} />
            </Link>
            {paths.map((path, index) => {
                const href = `/${paths.slice(0, index + 1).join('/')}`;
                const isLast = index === paths.length - 1;
                const label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');

                return (
                    <div key={path} className="flex items-center">
                        <ChevronRight size={16} className="mx-2 text-gray-400" />
                        {isLast ? (
                            <span className="text-gray-900 dark:text-gray-200 font-semibold cursor-default">
                                {label}
                            </span>
                        ) : (
                            <Link href={href} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                {label}
                            </Link>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}
