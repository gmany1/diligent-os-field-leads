const fs = require('fs');
const path = require('path');

// Template for simple list pages
const listPageTemplate = (title, description, apiEndpoint) => `'use client';

import { useQuery } from '@tanstack/react-query';
import { FileText, Download } from 'lucide-react';

async function fetchData() {
    const res = await fetch('${apiEndpoint}');
    if (!res.ok) throw new Error('Failed to fetch data');
    return res.json();
}

export default function ${title.replace(/\s/g, '')}Page() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['${title.toLowerCase().replace(/\s/g, '-')}'],
        queryFn: fetchData,
    });

    if (isLoading) return <div className="p-8">Loading...</div>;
    if (error) return <div className="p-8 text-red-500">Error loading data</div>;

    const items = data?.data || [];

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">${title}</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">${description}</p>
                </div>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                    <Download className="inline mr-2" size={18} />
                    Export
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="text-center py-12">
                    <FileText className="mx-auto text-gray-400" size={48} />
                    <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                        {items.length} items found
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Data will be displayed here
                    </p>
                </div>
            </div>
        </div>
    );
}
`;

// Template for report pages
const reportPageTemplate = (title, description) => `'use client';

import { useQuery } from '@tanstack/react-query';
import { BarChart3, TrendingUp, Users, DollarSign } from 'lucide-react';

export default function ${title.replace(/\s/g, '')}Page() {
    return (
        <div className="p-8 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">${title}</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">${description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Items</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">0</p>
                        </div>
                        <BarChart3 className="text-indigo-600" size={24} />
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                <div className="text-center py-12">
                    <BarChart3 className="mx-auto text-gray-400" size={48} />
                    <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                        Report data will appear here
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Configure your report parameters to view insights
                    </p>
                </div>
            </div>
        </div>
    );
}
`;

// Pages to create
const pages = [
    // Leads
    { path: 'leads/archived/page.tsx', title: 'Archived Leads', description: 'View archived and inactive leads', type: 'list', api: '/api/leads?archived=true' },
    { path: 'leads/duplicates/page.tsx', title: 'Duplicate Leads', description: 'Potential duplicate leads detected', type: 'list', api: '/api/leads?duplicates=true' },

    // Pipeline
    { path: 'pipeline/aging/page.tsx', title: 'Aging Analysis', description: 'Leads by time in current stage', type: 'report' },
    { path: 'pipeline/stalled/page.tsx', title: 'Stalled Leads', description: 'Leads with no recent activity', type: 'report' },
    { path: 'pipeline/summary/page.tsx', title: 'Pipeline Summary', description: 'Overview of pipeline stages', type: 'report' },

    // Quotes
    { path: 'quotes/pending/page.tsx', title: 'Pending Quotes', description: 'Quotes awaiting approval', type: 'list', api: '/api/quotes?status=PENDING' },
    { path: 'quotes/approved/page.tsx', title: 'Approved Quotes', description: 'Approved quotes', type: 'list', api: '/api/quotes?status=APPROVED' },
    { path: 'quotes/rejected/page.tsx', title: 'Rejected Quotes', description: 'Rejected quotes', type: 'list', api: '/api/quotes?status=REJECTED' },

    // Commissions
    { path: 'commissions/paid/page.tsx', title: 'Paid Commissions', description: 'Commission payment history', type: 'list', api: '/api/commissions?status=PAID' },
    { path: 'commissions/projection/page.tsx', title: 'Commission Projection', description: 'Projected commission earnings', type: 'report' },
    { path: 'commissions/team/page.tsx', title: 'Team Commissions', description: 'Team commission overview', type: 'report' },
    { path: 'commissions/discrepancies/page.tsx', title: 'Discrepancies', description: 'Commission calculation issues', type: 'list', api: '/api/commissions?discrepancies=true' },

    // Compliance
    { path: 'compliance/audit-logs/page.tsx', title: 'Audit Logs', description: 'System audit trail', type: 'list', api: '/api/audit-logs' },
    { path: 'compliance/ccpa/page.tsx', title: 'CCPA Actions', description: 'Privacy compliance actions', type: 'list', api: '/api/privacy/actions' },
    { path: 'compliance/pii-access/page.tsx', title: 'PII Access Log', description: 'Personal data access history', type: 'list', api: '/api/privacy/access-log' },
    { path: 'compliance/retention/page.tsx', title: 'Data Retention', description: 'Data retention policies', type: 'report' },

    // Activities
    { path: 'activities/mine/page.tsx', title: 'My Activities', description: 'Your recent activities', type: 'list', api: '/api/activities?mine=true' },
    { path: 'activities/overdue/page.tsx', title: 'Overdue Activities', description: 'Overdue tasks and follow-ups', type: 'list', api: '/api/activities?overdue=true' },
    { path: 'activities/calendar/page.tsx', title: 'Activity Calendar', description: 'Calendar view of activities', type: 'report' },

    // AI
    { path: 'ai/insights/page.tsx', title: 'AI Insights', description: 'AI-powered business insights', type: 'report' },
    { path: 'ai/pipeline/page.tsx', title: 'Pipeline Analysis', description: 'AI pipeline predictions', type: 'report' },
    { path: 'ai/alerts/page.tsx', title: 'Critical Alerts', description: 'AI-detected critical issues', type: 'list', api: '/api/ai/alerts' },
    { path: 'ai/predictive/page.tsx', title: 'Predictive Analytics', description: 'Predictive lead scoring', type: 'report' },

    // Admin
    { path: 'admin/roles/page.tsx', title: 'Role Management', description: 'Manage user roles', type: 'list', api: '/api/admin/roles' },
    { path: 'admin/permissions/page.tsx', title: 'Permissions', description: 'Configure permissions', type: 'report' },
    { path: 'admin/integrations/page.tsx', title: 'Integrations', description: 'Third-party integrations', type: 'report' },
    { path: 'admin/versions/page.tsx', title: 'Version History', description: 'System version tracking', type: 'list', api: '/api/admin/versions' },
    { path: 'admin/maintenance/page.tsx', title: 'Maintenance Mode', description: 'System maintenance controls', type: 'report' },
    { path: 'admin/env/page.tsx', title: 'Environment Variables', description: 'System configuration', type: 'report' },

    // Reports
    { path: 'reports/activity/page.tsx', title: 'Activity Report', description: 'Team activity analytics', type: 'report' },
    { path: 'reports/conversion/page.tsx', title: 'Conversion Report', description: 'Lead conversion metrics', type: 'report' },
    { path: 'reports/compliance/page.tsx', title: 'Compliance Report', description: 'Compliance metrics', type: 'report' },
    { path: 'reports/ccpa/page.tsx', title: 'CCPA Exports', description: 'CCPA data export log', type: 'list', api: '/api/reports/ccpa' },
    { path: 'reports/commissions/page.tsx', title: 'Commission Report', description: 'Commission analytics', type: 'report' },

    // Settings
    { path: 'settings/profile/page.tsx', title: 'Profile Settings', description: 'Manage your profile', type: 'report' },
    { path: 'settings/preferences/page.tsx', title: 'Preferences', description: 'User preferences', type: 'report' },
    { path: 'settings/general/page.tsx', title: 'General Settings', description: 'General application settings', type: 'report' },
    { path: 'settings/feature-flags/page.tsx', title: 'Feature Flags', description: 'Enable/disable features', type: 'report' },

    // Support
    { path: 'support/help/page.tsx', title: 'Help Desk', description: 'Get support', type: 'report' },
    { path: 'support/docs/page.tsx', title: 'Documentation', description: 'System documentation', type: 'report' },
    { path: 'support/changes/page.tsx', title: 'Change Requests', description: 'Request system changes', type: 'list', api: '/api/support/changes' },
    { path: 'support/incidents/page.tsx', title: 'Incidents', description: 'Report incidents', type: 'list', api: '/api/support/incidents' },

    // System
    { path: 'system/status/page.tsx', title: 'System Status', description: 'System health monitoring', type: 'report' },
    { path: 'system/metrics/page.tsx', title: 'System Metrics', description: 'Performance metrics', type: 'report' },
    { path: 'system/logs/page.tsx', title: 'System Logs', description: 'Application logs', type: 'list', api: '/api/system/logs' },
    { path: 'system/backups/page.tsx', title: 'Backups', description: 'Database backups', type: 'list', api: '/api/system/backups' },
    { path: 'system/incidents/page.tsx', title: 'System Incidents', description: 'Incident management', type: 'list', api: '/api/system/incidents' },
    { path: 'system/observability/page.tsx', title: 'Observability', description: 'System observability', type: 'report' },
];

const appDir = path.join(__dirname, '..', 'src', 'app');

pages.forEach(page => {
    const filePath = path.join(appDir, page.path);
    const content = page.type === 'list'
        ? listPageTemplate(page.title, page.description, page.api)
        : reportPageTemplate(page.title, page.description);

    fs.writeFileSync(filePath, content);
    console.log(`✅ Created: ${page.path}`);
});

console.log(`\n🎉 Successfully created ${pages.length} pages!`);
