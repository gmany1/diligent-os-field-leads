
const fs = require('fs');
const path = require('path');

const MENU_CONFIG = [
    { href: '/dashboard/executive' },
    { href: '/dashboard/manager' },
    { href: '/dashboard/rep' },
    { href: '/dashboard/finance' },
    { href: '/dashboard/it' },
    { href: '/dashboard/compliance' },
    { href: '/leads/all' },
    { href: '/leads/mine' },
    { href: '/leads/create' },
    { href: '/leads/duplicates' },
    { href: '/leads/archived' },
    { href: '/pipeline/kanban' },
    { href: '/pipeline/aging' },
    { href: '/pipeline/stalled' },
    { href: '/pipeline/summary' },
    { href: '/activities/mine' },
    { href: '/activities/all' },
    { href: '/activities/calendar' },
    { href: '/activities/overdue' },
    { href: '/quotes/all' },
    { href: '/quotes/mine' },
    { href: '/quotes/create' },
    { href: '/quotes/pending' },
    { href: '/quotes/approved' },
    { href: '/quotes/rejected' },
    { href: '/commissions/mine' },
    { href: '/commissions/team' },
    { href: '/commissions/projection' },
    { href: '/commissions/paid' },
    { href: '/commissions/discrepancies' },
    { href: '/branches/all' },
    { href: '/branches/mine' },
    { href: '/branches/performance' },
    { href: '/branches/manage' },
    { href: '/reports/sales' },
    { href: '/reports/conversion' },
    { href: '/reports/activity' },
    { href: '/reports/commissions' },
    { href: '/reports/compliance' },
    { href: '/reports/ccpa' },
    { href: '/ai/insights' },
    { href: '/ai/alerts' },
    { href: '/ai/pipeline' },
    { href: '/ai/predictive' },
    { href: '/admin/users' },
    { href: '/admin/roles' },
    { href: '/admin/permissions' },
    { href: '/admin/access-log' },
    { href: '/compliance/audit-logs' },
    { href: '/compliance/pii-access' },
    { href: '/compliance/retention' },
    { href: '/compliance/ccpa' },
    { href: '/system/status' },
    { href: '/system/observability' },
    { href: '/system/metrics' },
    { href: '/system/logs' },
    { href: '/system/incidents' },
    { href: '/system/backups' },
    { href: '/admin/env' },
    { href: '/admin/api-keys' },
    { href: '/admin/integrations' },
    { href: '/admin/versions' },
    { href: '/admin/maintenance' },
    { href: '/settings/profile' },
    { href: '/settings/preferences' },
    { href: '/settings/notifications' },
    { href: '/settings/feature-flags' },
    { href: '/settings/general' },
    { href: '/support/help' },
    { href: '/support/incidents' },
    { href: '/support/changes' },
    { href: '/support/docs' },
];

const basePath = path.join(__dirname, 'src', 'app');
const missing = [];

MENU_CONFIG.forEach(item => {
    if (!item.href) return;
    const filePath = path.join(basePath, item.href, 'page.tsx');
    if (!fs.existsSync(filePath)) {
        missing.push(item.href);
    }
});

console.log('Missing Pages:');
console.log(JSON.stringify(missing, null, 2));
