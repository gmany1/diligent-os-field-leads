'use client';

import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, Clock, DollarSign, FileText, TrendingDown } from 'lucide-react';
import Link from 'next/link';

async function fetchData() {
    const res = await fetch('/api/ai/alerts');
    if (!res.ok) throw new Error('Failed to fetch data');
    return res.json();
}

const severityColors = {
    HIGH: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
    LOW: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800',
};

const typeIcons = {
    STALLED_LEAD: Clock,
    PENDING_QUOTE: FileText,
    NO_QUOTE: TrendingDown,
    UNPAID_COMMISSION: DollarSign,
};

export default function CriticalAlertsPage() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['critical-alerts'],
        queryFn: fetchData,
    });

    if (isLoading) {
        return (
            <div className="p-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-red-600 dark:text-red-400">Error loading alerts. Please try again.</p>
                </div>
            </div>
        );
    }

    const alerts = data?.data || [];
    const summary = data?.summary || { total: 0, high: 0, medium: 0, low: 0 };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Critical Alerts</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    AI-detected issues requiring attention
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Alerts</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary.total}</p>
                        </div>
                        <AlertTriangle className="text-gray-400" size={32} />
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">High Priority</p>
                            <p className="text-2xl font-bold text-red-600">{summary.high}</p>
                        </div>
                        <AlertTriangle className="text-red-600" size={32} />
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Medium Priority</p>
                            <p className="text-2xl font-bold text-yellow-600">{summary.medium}</p>
                        </div>
                        <AlertTriangle className="text-yellow-600" size={32} />
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Low Priority</p>
                            <p className="text-2xl font-bold text-blue-600">{summary.low}</p>
                        </div>
                        <AlertTriangle className="text-blue-600" size={32} />
                    </div>
                </div>
            </div>

            {/* Alerts List */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                {alerts.length === 0 ? (
                    <div className="text-center py-12">
                        <AlertTriangle className="mx-auto text-gray-400" size={48} />
                        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                            No critical alerts
                        </h3>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            All systems are running smoothly
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {alerts.map((alert: any) => {
                            const Icon = typeIcons[alert.type as keyof typeof typeIcons] || AlertTriangle;
                            return (
                                <div
                                    key={alert.id}
                                    className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-4 flex-1">
                                            <div className={`p-3 rounded-lg ${severityColors[alert.severity as keyof typeof severityColors]}`}>
                                                <Icon size={24} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2">
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                        {alert.title}
                                                    </h3>
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${severityColors[alert.severity as keyof typeof severityColors]}`}>
                                                        {alert.severity}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                    {alert.description}
                                                </p>
                                                <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                                                    {alert.leadName && (
                                                        <span>Lead: <span className="font-medium">{alert.leadName}</span></span>
                                                    )}
                                                    {alert.assignedTo && (
                                                        <span>Assigned: <span className="font-medium">{alert.assignedTo}</span></span>
                                                    )}
                                                    {alert.branch && (
                                                        <span>Branch: <span className="font-medium">{alert.branch}</span></span>
                                                    )}
                                                    {alert.amount && (
                                                        <span>Amount: <span className="font-medium">${alert.amount.toLocaleString()}</span></span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        {alert.leadId && (
                                            <Link
                                                href={`/leads/${alert.leadId}`}
                                                className="ml-4 px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors"
                                            >
                                                View Lead
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
