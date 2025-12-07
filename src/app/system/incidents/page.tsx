'use client';

import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, Shield, Activity, Clock, CheckCircle, Eye } from 'lucide-react';

async function fetchData() {
    const res = await fetch('/api/system/incidents');
    if (!res.ok) throw new Error('Failed to fetch data');
    return res.json();
}

const severityColors = {
    HIGH: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
    LOW: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800',
};

const statusColors = {
    RESOLVED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    INVESTIGATING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    MONITORING: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    OPEN: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
};

const typeIcons = {
    DATA_DELETION: AlertTriangle,
    SYSTEM_ERROR: Activity,
    SECURITY: Shield,
    PERFORMANCE: Clock,
};

export default function SystemIncidentsPage() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['system-incidents'],
        queryFn: fetchData,
    });

    if (isLoading) {
        return (
            <div className="p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-red-600 dark:text-red-400">Error loading incidents. Please try again.</p>
                </div>
            </div>
        );
    }

    const incidents = data?.data || [];
    const summary = data?.summary || { total: 0, high: 0, medium: 0, low: 0, open: 0 };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">System Incidents</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Monitor and manage system incidents
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary.total}</p>
                        </div>
                        <AlertTriangle className="text-gray-400" size={32} />
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Open</p>
                            <p className="text-2xl font-bold text-red-600">{summary.open}</p>
                        </div>
                        <AlertTriangle className="text-red-600" size={32} />
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">High</p>
                            <p className="text-2xl font-bold text-red-600">{summary.high}</p>
                        </div>
                        <Shield className="text-red-600" size={32} />
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Medium</p>
                            <p className="text-2xl font-bold text-yellow-600">{summary.medium}</p>
                        </div>
                        <Shield className="text-yellow-600" size={32} />
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Low</p>
                            <p className="text-2xl font-bold text-blue-600">{summary.low}</p>
                        </div>
                        <Shield className="text-blue-600" size={32} />
                    </div>
                </div>
            </div>

            {/* Incidents List */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                {incidents.length === 0 ? (
                    <div className="text-center py-12">
                        <CheckCircle className="mx-auto text-green-500" size={48} />
                        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                            No incidents
                        </h3>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            All systems operating normally
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {incidents.map((incident: any) => {
                            const Icon = typeIcons[incident.type as keyof typeof typeIcons] || AlertTriangle;
                            return (
                                <div
                                    key={incident.id}
                                    className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-4 flex-1">
                                            <div className={`p-3 rounded-lg ${severityColors[incident.severity as keyof typeof severityColors]}`}>
                                                <Icon size={24} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                        {incident.title}
                                                    </h3>
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${severityColors[incident.severity as keyof typeof severityColors]}`}>
                                                        {incident.severity}
                                                    </span>
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[incident.status as keyof typeof statusColors]}`}>
                                                        {incident.status}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                                    {incident.description}
                                                </p>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500 dark:text-gray-400">
                                                    <div>
                                                        <span className="font-medium">User:</span> {incident.user}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">IP:</span> {incident.ipAddress}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Type:</span> {incident.type.replace(/_/g, ' ')}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Time:</span> {new Date(incident.createdAt).toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <button className="ml-4 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center">
                                            <Eye size={16} className="mr-2" />
                                            Details
                                        </button>
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
