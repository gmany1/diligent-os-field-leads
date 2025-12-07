'use client';

import { useQuery } from '@tanstack/react-query';
import { Shield, User, Clock, MapPin, Monitor } from 'lucide-react';

export default function AccessLogPage() {
    const { data, isLoading } = useQuery({
        queryKey: ['access-log'],
        queryFn: async () => {
            const res = await fetch('/api/admin/audit-log');
            if (!res.ok) throw new Error('Failed to fetch');
            return res.json();
        }
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

    const logs = data?.data || [];

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Access History</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Monitor user access and system activity
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Events</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{logs.length}</p>
                        </div>
                        <Shield className="text-indigo-600" size={32} />
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Today</p>
                            <p className="text-2xl font-bold text-green-600">
                                {logs.filter((l: any) => {
                                    const today = new Date().toDateString();
                                    return new Date(l.createdAt).toDateString() === today;
                                }).length}
                            </p>
                        </div>
                        <Clock className="text-green-600" size={32} />
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Unique Users</p>
                            <p className="text-2xl font-bold text-blue-600">
                                {new Set(logs.map((l: any) => l.userId)).size}
                            </p>
                        </div>
                        <User className="text-blue-600" size={32} />
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Unique IPs</p>
                            <p className="text-2xl font-bold text-purple-600">
                                {new Set(logs.map((l: any) => l.ipAddress)).size}
                            </p>
                        </div>
                        <MapPin className="text-purple-600" size={32} />
                    </div>
                </div>
            </div>

            {/* Access Log Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                    Action
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                    Entity
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                    IP Address
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                    Time
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {logs.slice(0, 50).map((log: any) => (
                                <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-8 w-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                                                <User size={16} className="text-indigo-600 dark:text-indigo-400" />
                                            </div>
                                            <div className="ml-3">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {log.user?.name || 'System'}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {log.user?.email || 'N/A'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${log.action === 'CREATE'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                : log.action === 'UPDATE'
                                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                                    : log.action === 'DELETE'
                                                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                            }`}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                        {log.entity}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        <div className="flex items-center">
                                            <MapPin size={14} className="mr-1" />
                                            {log.ipAddress}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        <div className="flex items-center">
                                            <Clock size={14} className="mr-1" />
                                            {new Date(log.createdAt).toLocaleString()}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Info */}
            <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                    <Monitor className="text-indigo-600 dark:text-indigo-400 flex-shrink-0" size={24} />
                    <div>
                        <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100 mb-2">
                            About Access History
                        </h3>
                        <p className="text-indigo-700 dark:text-indigo-300">
                            This log tracks all user actions in the system for security and compliance purposes.
                            All events are recorded with timestamps, IP addresses, and user information for audit trails.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
