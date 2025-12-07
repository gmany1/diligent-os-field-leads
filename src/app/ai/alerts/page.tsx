'use client';

import { useQuery } from '@tanstack/react-query';
import {
    AlertTriangle,
    AlertCircle,
    Clock,
    CheckCircle,
    ArrowRight,
    Download,
    X,
    Filter,
    Server
} from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

async function fetchData() {
    const res = await fetch('/api/ai/alerts');
    if (!res.ok) throw new Error('Failed to fetch data');
    const json = await res.json();
    return json;
}

const SeverityIcon = ({ severity }: { severity: string }) => {
    switch (severity.toLowerCase()) {
        case 'high':
        case 'critical':
            return <AlertTriangle className="text-red-500" size={24} />;
        case 'medium':
            return <AlertCircle className="text-yellow-500" size={24} />;
        default:
            return <Clock className="text-blue-500" size={24} />;
    }
};

const SeverityBadge = ({ severity }: { severity: string }) => {
    const styles = {
        high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
        critical: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
        medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
        low: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    };

    const key = severity.toLowerCase() as keyof typeof styles;
    const style = styles[key] || styles.low;

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${style} uppercase tracking-wide`}>
            {severity}
        </span>
    );
};

export default function CriticalAlertsPage() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['critical-alerts'],
        queryFn: fetchData,
    });

    if (isLoading) {
        return (
            <div className="p-8 space-y-4">
                <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-24 bg-white dark:bg-gray-800 rounded-lg shadow-sm animate-pulse"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) return <div className="p-8 text-red-500">Error loading alerts. Please try again later.</div>;

    const items = data?.data || [];
    const summary = data?.summary || { high: 0, medium: 0, low: 0 };

    return (
        <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                        Critical Alerts
                        {items.length > 0 && (
                            <span className="ml-3 px-3 py-1 bg-red-600 text-white text-base rounded-full shadow-sm">
                                {items.length}
                            </span>
                        )}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        AI-detected anomalies requiring immediate attention
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors shadow-sm">
                        <Filter size={18} />
                        <span>Filter</span>
                    </button>
                    <button className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm">
                        <Download size={18} />
                        <span>Export Report</span>
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 p-4 rounded-xl flex items-center justify-between">
                    <div>
                        <p className="text-red-600 dark:text-red-400 font-medium">Critical Issues</p>
                        <p className="text-3xl font-bold text-red-700 dark:text-red-300">{summary.high}</p>
                    </div>
                    <AlertTriangle className="text-red-500 opacity-50" size={32} />
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-900/30 p-4 rounded-xl flex items-center justify-between">
                    <div>
                        <p className="text-yellow-600 dark:text-yellow-400 font-medium">Warnings</p>
                        <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-300">{summary.medium}</p>
                    </div>
                    <AlertCircle className="text-yellow-500 opacity-50" size={32} />
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 p-4 rounded-xl flex items-center justify-between">
                    <div>
                        <p className="text-blue-600 dark:text-blue-400 font-medium">Notices</p>
                        <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{summary.low}</p>
                    </div>
                    <CheckCircle className="text-blue-500 opacity-50" size={32} />
                </div>
            </div>

            {/* Alerts List */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                {items.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="bg-green-100 dark:bg-green-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="text-green-600 dark:text-green-400" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">All Systems Operational</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">No critical alerts detected at this time.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {items.map((alert: any) => (
                            <div key={alert.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors group">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 mt-1">
                                        <SeverityIcon severity={alert.severity} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between mb-1">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                        {alert.title}
                                                    </h3>
                                                    <SeverityBadge severity={alert.severity} />
                                                </div>
                                                <p className="text-gray-600 dark:text-gray-300 text-sm">
                                                    {alert.description}
                                                </p>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap ml-4">
                                                <Clock size={14} className="mr-1" />
                                                <span>
                                                    {alert.createdAt ? formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true }) : 'Just now'}
                                                </span>
                                            </div>
                                        </div>

                                        {alert.metadata && (
                                            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg text-sm font-mono text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-700 inline-block">
                                                {Object.entries(alert.metadata).map(([key, value]) => (
                                                    <span key={key} className="mr-4">
                                                        <span className="font-semibold text-gray-500">{key}:</span> {String(value)}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="mt-4 flex items-center gap-3 pt-2">
                                            <Link
                                                href={alert.metadata?.leadId ? `/leads/${alert.metadata.leadId}` : '#'}
                                                className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                                            >
                                                Take Action <ArrowRight size={16} className="ml-1" />
                                            </Link>
                                            <button className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 ml-4 transition-colors">
                                                Dismiss Alert
                                            </button>
                                        </div>
                                    </div>

                                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="fixed bottom-6 right-6 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 flex items-center space-x-3 z-50">
                <div className="relative">
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <Server size={20} className="text-gray-600 dark:text-gray-300" />
                </div>
                <div className="text-xs">
                    <p className="font-bold text-gray-900 dark:text-white">API Connected</p>
                    <p className="text-gray-500 dark:text-gray-400">Source: /api/ai/alerts</p>
                </div>
            </div>
        </div>
    );
}
