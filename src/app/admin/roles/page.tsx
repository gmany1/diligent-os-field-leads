'use client';

import { Shield, Users, Building2, Server, Crown } from 'lucide-react';

const ROLES = [
    {
        name: 'CEO',
        icon: Crown,
        color: 'purple',
        description: 'Chief Executive Officer - Full system access',
        permissions: ['All permissions', 'View all branches', 'Manage users', 'System configuration'],
        count: 1
    },
    {
        name: 'CAO',
        icon: Crown,
        color: 'purple',
        description: 'Chief Administrative Officer - Administrative oversight',
        permissions: ['All permissions', 'View all branches', 'Manage users', 'Compliance oversight'],
        count: 1
    },
    {
        name: 'DOO',
        icon: Crown,
        color: 'purple',
        description: 'Director of Operations - Operations management',
        permissions: ['All permissions', 'View all branches', 'Operations oversight', 'Performance metrics'],
        count: 1
    },
    {
        name: 'IT_SUPER_ADMIN',
        icon: Server,
        color: 'red',
        description: 'IT Super Administrator - Technical administration',
        permissions: ['System administration', 'User management', 'Security settings', 'Database access'],
        count: 1
    },
    {
        name: 'BRANCH_MANAGER',
        icon: Building2,
        color: 'blue',
        description: 'Branch Manager - Branch-level management',
        permissions: ['Manage branch leads', 'View branch reports', 'Approve quotes', 'Team management'],
        count: 4
    },
    {
        name: 'STAFFING_REP',
        icon: Users,
        color: 'green',
        description: 'Staffing Representative - Lead management',
        permissions: ['Manage assigned leads', 'Create quotes', 'View own commissions', 'Activity tracking'],
        count: 3
    },
    {
        name: 'SALES_REP',
        icon: Users,
        color: 'yellow',
        description: 'Sales Representative - Sales activities',
        permissions: ['Manage assigned leads', 'Create quotes', 'View own commissions', 'Sales reporting'],
        count: 1
    },
];

const getColorClasses = (color: string) => {
    const colors: Record<string, any> = {
        purple: {
            bg: 'bg-purple-50 dark:bg-purple-900/20',
            border: 'border-purple-200 dark:border-purple-800',
            icon: 'text-purple-600 dark:text-purple-400',
            badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
        },
        red: {
            bg: 'bg-red-50 dark:bg-red-900/20',
            border: 'border-red-200 dark:border-red-800',
            icon: 'text-red-600 dark:text-red-400',
            badge: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
        },
        blue: {
            bg: 'bg-blue-50 dark:bg-blue-900/20',
            border: 'border-blue-200 dark:border-blue-800',
            icon: 'text-blue-600 dark:text-blue-400',
            badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
        },
        green: {
            bg: 'bg-green-50 dark:bg-green-900/20',
            border: 'border-green-200 dark:border-green-800',
            icon: 'text-green-600 dark:text-green-400',
            badge: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
        },
        yellow: {
            bg: 'bg-yellow-50 dark:bg-yellow-900/20',
            border: 'border-yellow-200 dark:border-yellow-800',
            icon: 'text-yellow-600 dark:text-yellow-400',
            badge: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
        },
    };
    return colors[color] || colors.blue;
};

export default function RolesPage() {
    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Roles & Permissions</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Overview of system roles and their permissions
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Roles</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{ROLES.length}</p>
                        </div>
                        <Shield className="text-indigo-600" size={32} />
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {ROLES.reduce((sum, role) => sum + role.count, 0)}
                            </p>
                        </div>
                        <Users className="text-green-600" size={32} />
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Permission Levels</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">4</p>
                        </div>
                        <Shield className="text-purple-600" size={32} />
                    </div>
                </div>
            </div>

            {/* Roles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ROLES.map((role) => {
                    const Icon = role.icon;
                    const colors = getColorClasses(role.color);

                    return (
                        <div
                            key={role.name}
                            className={`${colors.bg} border ${colors.border} rounded-lg p-6 hover:shadow-lg transition-shadow`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center">
                                    <div className={`p-3 rounded-lg ${colors.bg}`}>
                                        <Icon className={colors.icon} size={24} />
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {role.name.replace(/_/g, ' ')}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{role.description}</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${colors.badge}`}>
                                    {role.count} {role.count === 1 ? 'user' : 'users'}
                                </span>
                            </div>

                            <div className="space-y-2">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Permissions:</p>
                                <ul className="space-y-1">
                                    {role.permissions.map((permission, idx) => (
                                        <li key={idx} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                            <svg className={`w-4 h-4 mr-2 ${colors.icon}`} fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            {permission}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Role Hierarchy */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Role Hierarchy</h2>
                <div className="space-y-3">
                    <div className="flex items-center">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div className="bg-purple-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                        <span className="ml-4 text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                            Executives (Full Access)
                        </span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div className="bg-red-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                        <span className="ml-4 text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                            IT Admin (System Access)
                        </span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                        <span className="ml-4 text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                            Branch Managers (Branch Access)
                        </span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div className="bg-green-600 h-2 rounded-full" style={{ width: '50%' }}></div>
                        </div>
                        <span className="ml-4 text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                            Representatives (Limited Access)
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
