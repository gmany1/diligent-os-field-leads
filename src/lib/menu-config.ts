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
    ChevronRight,
    Building2,
    Upload,
    Download,
    Bell,
    Search,
    WifiOff,
    History
} from 'lucide-react';

export interface MenuItem {
    name: string;
    href?: string;
    icon?: any;
    items?: MenuItem[];
    roles?: string[]; // Allowed roles. If undefined, allowed for all authenticated.
}

// Roles actualizados según schema.prisma
const EXEC_ROLES = ['CEO', 'CAO', 'DOO'];
const MANAGER_ROLES = ['BRANCH_MANAGER', ...EXEC_ROLES];
const REP_ROLES = ['STAFFING_REP', 'SALES_REP'];
const IT_ROLES = ['IT_SUPER_ADMIN'];
const ALL_ROLES = [...EXEC_ROLES, ...MANAGER_ROLES, ...REP_ROLES, ...IT_ROLES];

export const MENU_CONFIG: MenuItem[] = [
    {
        name: 'Dashboard',
        icon: LayoutDashboard,
        items: [
            { name: 'Executive', href: '/dashboard/executive', roles: [...EXEC_ROLES, ...IT_ROLES] },
            { name: 'Manager', href: '/dashboard/manager', roles: MANAGER_ROLES },
            { name: 'Rep', href: '/dashboard/rep', roles: REP_ROLES },
            { name: 'Finance', href: '/dashboard/finance', roles: [...EXEC_ROLES, 'CAO', ...IT_ROLES] },
            { name: 'IT / Observability', href: '/dashboard/it', roles: IT_ROLES },
            { name: 'Compliance', href: '/dashboard/compliance', roles: [...EXEC_ROLES, ...IT_ROLES] },
        ]
    },
    {
        name: 'Leads',
        icon: Users,
        items: [
            { name: 'All Leads', href: '/leads/all', roles: MANAGER_ROLES },
            { name: 'My Leads', href: '/leads/mine', roles: [...REP_ROLES, ...MANAGER_ROLES] },
            { name: 'Create Lead', href: '/leads/create' },
            { name: 'Duplicates', href: '/leads/duplicates', roles: MANAGER_ROLES },
            { name: 'Archived', href: '/leads/archived', roles: MANAGER_ROLES },
        ]
    },
    {
        name: 'Pipeline',
        icon: BarChart3,
        items: [
            { name: 'Kanban', href: '/pipeline/kanban' },
            { name: 'Aging', href: '/pipeline/aging', roles: MANAGER_ROLES },
            { name: 'Stalled', href: '/pipeline/stalled', roles: MANAGER_ROLES },
            { name: 'Stage Summary', href: '/pipeline/summary', roles: MANAGER_ROLES },
        ]
    },
    {
        name: 'Activities',
        icon: Calendar,
        items: [
            { name: 'My Activities', href: '/activities/mine' },
            { name: 'All Activities', href: '/activities/all', roles: MANAGER_ROLES },
            { name: 'Calendar', href: '/activities/calendar' },
            { name: 'Overdue', href: '/activities/overdue' },
        ]
    },
    {
        name: 'Quotes',
        icon: FileText,
        items: [
            { name: 'All Quotes', href: '/quotes/all', roles: MANAGER_ROLES },
            { name: 'My Quotes', href: '/quotes/mine' },
            { name: 'Create Quote', href: '/quotes/create' },
            { name: 'Pending Approval', href: '/quotes/pending', roles: MANAGER_ROLES },
            { name: 'Approved', href: '/quotes/approved' },
            { name: 'Rejected', href: '/quotes/rejected' },
        ]
    },
    {
        name: 'Commissions',
        icon: DollarSign,
        items: [
            { name: 'My Commissions', href: '/commissions/mine' },
            { name: 'Team Commissions', href: '/commissions/team', roles: MANAGER_ROLES },
            { name: 'Projection', href: '/commissions/projection' },
            { name: 'Paid', href: '/commissions/paid' },
            { name: 'Discrepancies', href: '/commissions/discrepancies', roles: [...EXEC_ROLES, ...IT_ROLES] },
        ]
    },
    {
        name: 'Branches',
        icon: Building2,
        roles: [...MANAGER_ROLES, ...IT_ROLES],
        items: [
            { name: 'All Branches', href: '/branches/all', roles: [...EXEC_ROLES, ...IT_ROLES] },
            { name: 'My Branch', href: '/branches/mine', roles: ['BRANCH_MANAGER'] },
            { name: 'Performance', href: '/branches/performance', roles: EXEC_ROLES },
            { name: 'Manage', href: '/branches/manage', roles: [...EXEC_ROLES, ...IT_ROLES] },
        ]
    },
    {
        name: 'Reports',
        icon: PieChart,
        roles: MANAGER_ROLES,
        items: [
            { name: 'Sales', href: '/reports/sales' },
            { name: 'Conversion', href: '/reports/conversion' },
            { name: 'Activity', href: '/reports/activity' },
            { name: 'Commissions', href: '/reports/commissions' },
            { name: 'Compliance', href: '/reports/compliance', roles: [...EXEC_ROLES, ...IT_ROLES] },
            { name: 'CCPA Exports', href: '/reports/ccpa', roles: [...EXEC_ROLES, ...IT_ROLES] },
        ]
    },
    {
        name: 'AI & Analysis',
        icon: Brain,
        roles: [...EXEC_ROLES, ...IT_ROLES, ...MANAGER_ROLES],
        items: [
            { name: 'Insights', href: '/ai/insights' },
            { name: 'Critical Alerts', href: '/ai/alerts' },
            { name: 'Pipeline Analysis', href: '/ai/pipeline' },
            { name: 'Predictive', href: '/ai/predictive' },
        ]
    },
    {
        name: 'Users & Roles',
        icon: UserCog,
        roles: [...IT_ROLES, ...EXEC_ROLES],
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
        roles: [...IT_ROLES, ...EXEC_ROLES],
        items: [
            { name: 'Audit Logs', href: '/compliance/audit-logs' },
            { name: 'PII Access', href: '/compliance/pii-access' },
            { name: 'Retention', href: '/compliance/retention' },
            { name: 'CCPA Actions', href: '/compliance/ccpa' },
        ]
    },
    {
        name: 'System',
        icon: Server,
        roles: IT_ROLES,
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
        name: 'Administration',
        icon: Settings,
        roles: [...IT_ROLES, ...EXEC_ROLES],
        items: [
            { name: 'Env Variables', href: '/admin/env', roles: IT_ROLES },
            { name: 'API Keys', href: '/admin/api-keys', roles: IT_ROLES },
            { name: 'Integrations', href: '/admin/integrations' },
            { name: 'Versions', href: '/admin/versions' },
            { name: 'Maintenance', href: '/admin/maintenance', roles: IT_ROLES },
        ]
    },
    {
        name: 'Settings',
        icon: Settings,
        items: [
            { name: 'Profile', href: '/settings/profile' },
            { name: 'Preferences', href: '/settings/preferences' },
            { name: 'Notifications', href: '/settings/notifications' },
            { name: 'Feature Flags', href: '/settings/feature-flags', roles: IT_ROLES },
            { name: 'General', href: '/settings/general', roles: [...IT_ROLES, ...EXEC_ROLES] },
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
];
