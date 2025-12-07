const fs = require('fs');
const path = require('path');

// Recursive function to get all hrefs
function getRoutes(items) {
    let routes = [];
    for (const item of items) {
        if (item.href && !item.items) {
            routes.push({ href: item.href, name: item.name });
        }
        if (item.items) {
            routes = routes.concat(getRoutes(item.items));
        }
    }
    return routes;
}

// Hardcoded config to avoid ts-node complexity with imports
const MENU_CONFIG = [
    {
        name: 'Dashboard',
        items: [
            { name: 'Executive', href: '/dashboard/executive' },
            { name: 'Manager', href: '/dashboard/manager' },
            { name: 'Rep', href: '/dashboard/rep' },
            { name: 'Finance', href: '/dashboard/finance' },
            { name: 'IT / Observability', href: '/dashboard/it' },
            { name: 'Compliance', href: '/dashboard/compliance' },
        ]
    },
    {
        name: 'Leads',
        items: [
            { name: 'All Leads', href: '/leads/all' },
            { name: 'My Leads', href: '/leads/mine' },
            { name: 'Create Lead', href: '/leads/create' },
            { name: 'Duplicates', href: '/leads/duplicates' },
            { name: 'Archived', href: '/leads/archived' },
        ]
    },
    {
        name: 'Activities',
        items: [
            { name: 'All Activities', href: '/activities/all' },
            { name: 'My Activities', href: '/activities/mine' },
            { name: 'Calendar', href: '/activities/calendar' },
            { name: 'Overdue', href: '/activities/overdue' },
        ]
    },
    {
        name: 'Pipeline',
        items: [
            { name: 'Kanban', href: '/pipeline/kanban' },
            { name: 'Aging', href: '/pipeline/aging' },
            { name: 'Stalled', href: '/pipeline/stalled' },
            { name: 'Stage Summary', href: '/pipeline/summary' },
        ]
    },
    {
        name: 'Quotes',
        items: [
            { name: 'All Quotes', href: '/quotes/all' },
            { name: 'Create Quote', href: '/quotes/create' },
            { name: 'Pending Approval', href: '/quotes/pending' },
            { name: 'Approved', href: '/quotes/approved' },
            { name: 'Rejected', href: '/quotes/rejected' },
        ]
    },
    {
        name: 'Commissions',
        items: [
            { name: 'My Commissions', href: '/commissions/mine' },
            { name: 'Team Commissions', href: '/commissions/team' },
            { name: 'Projection', href: '/commissions/projection' },
            { name: 'Paid', href: '/commissions/paid' },
            { name: 'Discrepancies', href: '/commissions/discrepancies' },
        ]
    },
    {
        name: 'Reports',
        items: [
            { name: 'Sales', href: '/reports/sales' },
            { name: 'Conversion', href: '/reports/conversion' },
            { name: 'Activity', href: '/reports/activity' },
            { name: 'Commissions', href: '/reports/commissions' },
            { name: 'Compliance', href: '/reports/compliance' },
            { name: 'CCPA Exports', href: '/reports/ccpa' },
        ]
    },
    {
        name: 'Users & Roles',
        items: [
            { name: 'Users', href: '/admin/users' },
            { name: 'Roles', href: '/admin/roles' },
            { name: 'Permissions', href: '/admin/permissions' },
            { name: 'Access History', href: '/admin/access-log' },
        ]
    },
    {
        name: 'Compliance & Audit',
        items: [
            { name: 'Audit Logs', href: '/compliance/audit-logs' },
            { name: 'PII Access', href: '/compliance/pii-access' },
            { name: 'Retention', href: '/compliance/retention' },
            { name: 'CCPA Actions', href: '/compliance/ccpa' },
        ]
    },
    {
        name: 'IA & Analysis',
        items: [
            { name: 'Insights', href: '/ai/insights' },
            { name: 'Critical Alerts', href: '/ai/alerts' },
            { name: 'Pipeline Analysis', href: '/ai/pipeline' },
            { name: 'Predictive', href: '/ai/predictive' },
        ]
    },
    {
        name: 'System',
        items: [
            { name: 'Status', href: '/system/status' },
            { name: 'Observability', href: '/system/observability' },
            { name: 'Metrics', href: '/system/metrics' },
            { name: 'Logs', href: '/system/logs' },
            { name: 'Incidents', href: '/system/incidents' },
            { name: 'Backups', href: '/system/backups' },
        ]
    },
    {
        name: 'Settings',
        items: [
            { name: 'Profile', href: '/settings/profile' },
            { name: 'Preferences', href: '/settings/preferences' },
            { name: 'Feature Flags', href: '/settings/feature-flags' },
            { name: 'General', href: '/settings/general' },
        ]
    },
    {
        name: 'Support',
        items: [
            { name: 'Help Desk', href: '/support/help' },
            { name: 'Incidents', href: '/support/incidents' },
            { name: 'Change Requests', href: '/support/changes' },
            { name: 'Documentation', href: '/support/docs' },
        ]
    },
    {
        name: 'Administration',
        items: [
            { name: 'Env Variables', href: '/admin/env' },
            { name: 'API Keys', href: '/admin/api-keys' },
            { name: 'Integrations', href: '/admin/integrations' },
            { name: 'Versions', href: '/admin/versions' },
            { name: 'Maintenance', href: '/admin/maintenance' },
        ]
    }
];

const routes = getRoutes(MENU_CONFIG);
const baseDir = path.join(process.cwd(), 'src/app');

routes.forEach(route => {
    // Remove leading slash
    const relativePath = route.href.startsWith('/') ? route.href.substring(1) : route.href;
    const dirPath = path.join(baseDir, relativePath);
    const filePath = path.join(dirPath, 'page.tsx');

    // Create directory recursively
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`Created directory: ${dirPath}`);
    }

    // Create file if it doesn't exist
    if (!fs.existsSync(filePath)) {
        const content = `'use client';

export default function Page() {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">${route.name}</h1>
            <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <p className="text-gray-500">Placeholder for ${route.name} (Part of Phase A - Completing Routes)</p>
            </div>
        </div>
    );
}
`;
        fs.writeFileSync(filePath, content);
        console.log(`Created page: ${filePath}`);
    } else {
        console.log(`Page already exists: ${filePath}`);
    }
});
