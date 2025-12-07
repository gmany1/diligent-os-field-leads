'use client';

import { Book, FileText, Code, Database, Shield, Settings, Users, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function DocumentationPage() {
    const sections = [
        {
            id: 'getting-started',
            title: 'Getting Started',
            icon: Book,
            color: 'indigo',
            items: [
                { title: 'Introduction', description: 'Overview of DiligentOS Field Leads system' },
                { title: 'Quick Start Guide', description: 'Get up and running in 5 minutes' },
                { title: 'User Roles', description: 'Understanding permissions and access levels' },
                { title: 'Navigation', description: 'How to navigate the application' }
            ]
        },
        {
            id: 'user-guide',
            title: 'User Guide',
            icon: Users,
            color: 'blue',
            items: [
                { title: 'Managing Leads', description: 'Create, update, and track leads' },
                { title: 'Pipeline Management', description: 'Using the Kanban board and stages' },
                { title: 'Creating Quotes', description: 'Generate and send quotes to clients' },
                { title: 'Activity Tracking', description: 'Log calls, emails, and meetings' },
                { title: 'Commission Tracking', description: 'View and manage your commissions' }
            ]
        },
        {
            id: 'admin-guide',
            title: 'Admin Guide',
            icon: Shield,
            color: 'purple',
            items: [
                { title: 'User Management', description: 'Create and manage user accounts' },
                { title: 'Branch Management', description: 'Configure branches and territories' },
                { title: 'Role Configuration', description: 'Set up roles and permissions' },
                { title: 'System Settings', description: 'Configure system-wide settings' },
                { title: 'Audit Logs', description: 'Review system activity and changes' }
            ]
        },
        {
            id: 'reports',
            title: 'Reports & Analytics',
            icon: TrendingUp,
            color: 'green',
            items: [
                { title: 'Executive Dashboard', description: 'High-level metrics and KPIs' },
                { title: 'Sales Reports', description: 'Track sales performance' },
                { title: 'Financial Reports', description: 'Revenue and commission analysis' },
                { title: 'Compliance Reports', description: 'CCPA and audit compliance' }
            ]
        },
        {
            id: 'technical',
            title: 'Technical Documentation',
            icon: Code,
            color: 'red',
            items: [
                { title: 'API Reference', description: 'REST API endpoints and usage' },
                { title: 'Database Schema', description: 'Database structure and relationships' },
                { title: 'Authentication', description: 'NextAuth.js implementation' },
                { title: 'RBAC System', description: 'Role-based access control' },
                { title: 'Audit Logging', description: 'System audit trail implementation' }
            ]
        },
        {
            id: 'security',
            title: 'Security & Compliance',
            icon: Shield,
            color: 'yellow',
            items: [
                { title: 'CCPA Compliance', description: 'Data privacy and user rights' },
                { title: 'Data Retention', description: 'Retention policies and procedures' },
                { title: 'Access Control', description: 'Security policies and best practices' },
                { title: 'Incident Response', description: 'Security incident procedures' }
            ]
        },
        {
            id: 'maintenance',
            title: 'System Maintenance',
            icon: Settings,
            color: 'gray',
            items: [
                { title: 'Backup Procedures', description: 'Database backup and recovery' },
                { title: 'System Updates', description: 'Version updates and migrations' },
                { title: 'Performance Monitoring', description: 'System health and metrics' },
                { title: 'Troubleshooting', description: 'Common issues and solutions' }
            ]
        },
        {
            id: 'data',
            title: 'Data Management',
            icon: Database,
            color: 'cyan',
            items: [
                { title: 'Data Import', description: 'Importing leads and data' },
                { title: 'Data Export', description: 'Exporting reports and data' },
                { title: 'Data Migration', description: 'Moving from Excel to DiligentOS' },
                { title: 'Data Cleanup', description: 'Duplicate detection and merging' }
            ]
        }
    ];

    const colorClasses = {
        indigo: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
        blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
        purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
        green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
        red: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
        yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
        gray: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
        cyan: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400'
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-8 text-white">
                <div className="flex items-center space-x-4 mb-4">
                    <Book size={48} />
                    <div>
                        <h1 className="text-4xl font-bold">System Documentation</h1>
                        <p className="text-indigo-100 mt-2">
                            Complete guide to using and managing DiligentOS Field Leads
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                        <p className="text-sm text-indigo-100">Version</p>
                        <p className="text-2xl font-bold">1.0.0</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                        <p className="text-sm text-indigo-100">Last Updated</p>
                        <p className="text-2xl font-bold">Dec 2025</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                        <p className="text-sm text-indigo-100">Total Sections</p>
                        <p className="text-2xl font-bold">{sections.length}</p>
                    </div>
                </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Link href="/admin/roles" className="flex items-center space-x-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                        <Shield size={16} />
                        <span>View Roles</span>
                    </Link>
                    <Link href="/admin/users" className="flex items-center space-x-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                        <Users size={16} />
                        <span>Manage Users</span>
                    </Link>
                    <Link href="/system/incidents" className="flex items-center space-x-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                        <FileText size={16} />
                        <span>View Incidents</span>
                    </Link>
                    <Link href="/admin/maintenance" className="flex items-center space-x-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                        <Settings size={16} />
                        <span>System Health</span>
                    </Link>
                </div>
            </div>

            {/* Documentation Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sections.map((section) => {
                    const Icon = section.icon;
                    const colorClass = colorClasses[section.color as keyof typeof colorClasses];

                    return (
                        <div key={section.id} className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center space-x-3">
                                    <div className={`p-3 rounded-lg ${colorClass}`}>
                                        <Icon size={24} />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        {section.title}
                                    </h3>
                                </div>
                            </div>
                            <div className="p-6">
                                <ul className="space-y-3">
                                    {section.items.map((item, idx) => (
                                        <li key={idx}>
                                            <button className="w-full text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 p-3 rounded-lg transition-colors">
                                                <h4 className="font-medium text-gray-900 dark:text-white">
                                                    {item.title}
                                                </h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                    {item.description}
                                                </p>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Additional Resources */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Additional Resources</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <FileText className="text-indigo-600 mb-2" size={24} />
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Release Notes</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            View changelog and version history
                        </p>
                    </div>
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <Code className="text-purple-600 mb-2" size={24} />
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">API Documentation</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            REST API reference and examples
                        </p>
                    </div>
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <Database className="text-green-600 mb-2" size={24} />
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Database Schema</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Entity relationships and structure
                        </p>
                    </div>
                </div>
            </div>

            {/* Support */}
            <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Need Help?</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Can't find what you're looking for? Contact our support team for assistance.
                </p>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    Contact Support
                </button>
            </div>
        </div>
    );
}
