import {
    LayoutDashboard,
    Users,
    Settings,
    FileText,
    BarChart3,
    Shield,
    DollarSign,
    Server,
    ClipboardList,
    Calendar,
    List,
    Brain,
    Archive,
    AlertTriangle,
    UserCog,
    FileCheck,
    Activity,
    PieChart,
    HelpCircle,
    Clock,
    Menu,
    X,
    LogOut,
    Plus,
    ChevronDown,
    ChevronRight
} from 'lucide-react';

export interface MenuItem {
    name: string;
    href?: string;
    icon?: any;
    items?: MenuItem[];
    roles?: string[]; // Allowed roles. If undefined, allowed for all authenticated.
}

export const MENU_CONFIG: MenuItem[] = [
    {
        name: 'Dashboard',
        icon: LayoutDashboard,
        items: [
            { name: 'Executive', href: '/dashboard/executive', roles: ['EXECUTIVE', 'IT_ADMIN'] },
            { name: 'Manager', href: '/dashboard/manager', roles: ['MANAGER', 'EXECUTIVE', 'IT_ADMIN'] },
            { name: 'Rep', href: '/dashboard/rep', roles: ['FIELD_LEAD_REP', 'EXECUTIVE', 'IT_ADMIN'] },
            { name: 'Finance', href: '/dashboard/finance', roles: ['EXECUTIVE', 'IT_ADMIN'] }, // Removed 'FINANCE' as it wasn't in original defined roles, assuming IT_ADMIN/EXEC for now or need to add role
            { name: 'IT / Observability', href: '/dashboard/it', roles: ['IT_ADMIN', 'EXECUTIVE'] },
            { name: 'Compliance', href: '/dashboard/compliance', roles: ['IT_ADMIN', 'EXECUTIVE'] },
        ]
    },
    {
        name: 'Leads',
        icon: Users,
        items: [
            { name: 'All Leads', href: '/leads/all', roles: ['EXECUTIVE', 'MANAGER', 'IT_ADMIN'] },
            { name: 'My Leads', href: '/leads/mine', roles: ['FIELD_LEAD_REP', 'MANAGER'] },
            { name: 'Create Lead', href: '/leads/create' },
            { name: 'Duplicates', href: '/leads/duplicates', roles: ['MANAGER', 'IT_ADMIN', 'EXECUTIVE'] },
            { name: 'Archived', href: '/leads/archived', roles: ['MANAGER', 'IT_ADMIN', 'EXECUTIVE'] },
        ]
    },
    {
        name: 'Activities',
        icon: Calendar,
        items: [
            { name: 'All Activities', href: '/activities/all', roles: ['EXECUTIVE', 'MANAGER'] },
            { name: 'My Activities', href: '/activities/mine' },
            { name: 'Calendar', href: '/activities/calendar' },
            { name: 'Overdue', href: '/activities/overdue' },
        ]
    },
    {
        name: 'Pipeline',
        icon: BarChart3,
        items: [
            { name: 'Kanban', href: '/pipeline/kanban' },
            { name: 'Aging', href: '/pipeline/aging', roles: ['MANAGER', 'EXECUTIVE'] },
            { name: 'Stalled', href: '/pipeline/stalled', roles: ['MANAGER', 'EXECUTIVE'] },
            { name: 'Stage Summary', href: '/pipeline/summary', roles: ['MANAGER', 'EXECUTIVE'] },
        ]
    },
    {
        name: 'Quotes',
        icon: FileText,
        items: [
            { name: 'All Quotes', href: '/quotes/all', roles: ['EXECUTIVE', 'MANAGER'] },
            { name: 'Create Quote', href: '/quotes/create' },
            { name: 'Pending Approval', href: '/quotes/pending', roles: ['MANAGER', 'EXECUTIVE'] },
            { name: 'Approved', href: '/quotes/approved' },
            { name: 'Rejected', href: '/quotes/rejected' },
        ]
    },
    {
        name: 'Commissions',
        icon: DollarSign,
        roles: ['EXECUTIVE', 'MANAGER', 'FIELD_LEAD_REP', 'IT_ADMIN'],
        items: [
            { name: 'My Commissions', href: '/commissions/mine' },
            { name: 'Team Commissions', href: '/commissions/team', roles: ['MANAGER', 'EXECUTIVE', 'IT_ADMIN'] },
            { name: 'Projection', href: '/commissions/projection' },
            { name: 'Paid', href: '/commissions/paid' },
            { name: 'Discrepancies', href: '/commissions/discrepancies', roles: ['EXECUTIVE', 'IT_ADMIN'] },
        ]
    },
    {
        name: 'Reports',
        icon: PieChart,
        roles: ['EXECUTIVE', 'MANAGER', 'IT_ADMIN'],
        items: [
            { name: 'Sales', href: '/reports/sales' },
            { name: 'Conversion', href: '/reports/conversion' },
            { name: 'Activity', href: '/reports/activity' },
            { name: 'Commissions', href: '/reports/commissions' },
            { name: 'Compliance', href: '/reports/compliance', roles: ['EXECUTIVE', 'IT_ADMIN'] },
            { name: 'CCPA Exports', href: '/reports/ccpa', roles: ['EXECUTIVE', 'IT_ADMIN'] },
        ]
    },
    {
        name: 'Users & Roles',
        icon: UserCog,
        roles: ['IT_ADMIN', 'EXECUTIVE'],
        items: [
            { name: 'Users', href: '/admin/users' },
            { name: 'Roles', href: '/admin/roles' },
            { name: 'Permissions', href: '/admin/permissions' },
            { name: 'Access History', href: '/admin/access-log' },
        ]
    },
    {
        name: 'Compliance & Audit',
        icon: Shield,
        roles: ['IT_ADMIN', 'EXECUTIVE'],
        items: [
            { name: 'Audit Logs', href: '/compliance/audit-logs' },
            { name: 'PII Access', href: '/compliance/pii-access' },
            { name: 'Retention', href: '/compliance/retention' },
            { name: 'CCPA Actions', href: '/compliance/ccpa' },
        ]
    },
    {
        name: 'IA & Analysis',
        icon: Brain,
        roles: ['EXECUTIVE', 'IT_ADMIN'],
        items: [
            { name: 'Insights', href: '/ai/insights' },
            { name: 'Critical Alerts', href: '/ai/alerts' },
            { name: 'Pipeline Analysis', href: '/ai/pipeline' },
            { name: 'Predictive', href: '/ai/predictive' },
        ]
    },
    {
        name: 'System',
        icon: Server,
        roles: ['IT_ADMIN'],
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
        icon: Settings,
        items: [
            { name: 'Profile', href: '/settings/profile' },
            { name: 'Preferences', href: '/settings/preferences' },
            { name: 'Feature Flags', href: '/settings/feature-flags', roles: ['IT_ADMIN'] },
            { name: 'General', href: '/settings/general', roles: ['IT_ADMIN', 'EXECUTIVE'] },
        ]
    },
    {
        name: 'Support',
        icon: HelpCircle,
        items: [
            { name: 'Help Desk', href: '/support/help' },
            { name: 'Incidents', href: '/support/incidents' },
            { name: 'Change Requests', href: '/support/changes' },
            { name: 'Documentation', href: '/support/docs' },
        ]
    },
    {
        name: 'Administration',
        icon: Settings, // Or another icon
        roles: ['IT_ADMIN', 'EXECUTIVE'],
        items: [
            { name: 'Env Variables', href: '/admin/env', roles: ['IT_ADMIN'] },
            { name: 'API Keys', href: '/admin/api-keys', roles: ['IT_ADMIN'] },
            { name: 'Integrations', href: '/admin/integrations' },
            { name: 'Versions', href: '/admin/versions' },
            { name: 'Maintenance', href: '/admin/maintenance', roles: ['IT_ADMIN'] },
        ]
    }
];
