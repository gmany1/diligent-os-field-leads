'use client';

import { useTheme } from 'next-themes';
import { useEffect } from 'react';

export function ResponsiveThemeHandler() {
    const { setTheme } = useTheme();

    useEffect(() => {
        const handleResize = () => {
            // 768px is the standard md breakpoint in Tailwind
            if (window.innerWidth < 768) {
                setTheme('dark');
            } else {
                setTheme('light');
            }
        };

        // Initial check
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [setTheme]);

    return null;
}
