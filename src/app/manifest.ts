import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'DiligentOS Field Leads',
        short_name: 'Field Leads',
        description: 'Field Sales Management System for Diligent Staffing',
        start_url: '/',
        id: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#4f46e5',
        icons: [
            {
                src: '/icon.svg',
                sizes: 'any',
                type: 'image/svg+xml',
            },
            {
                src: '/icons/icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'maskable'
            },
            {
                src: '/icons/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable'
            }
        ],
        screenshots: [
            {
                src: '/screenshots/dashboard-mobile.png',
                sizes: '1170x2532',
                type: 'image/png',
                label: 'Dashboard Mobile'
            }
        ]
    }
}
