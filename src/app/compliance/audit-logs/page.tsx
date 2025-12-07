'use client';

import { useQuery } from '@tanstack/react-query';
import { FileText, Download, Shield, Search, Server } from 'lucide-react';

async function fetchData() {
    const res = await fetch('/api/compliance/audit-logs');
    if (!res.ok) throw new Error('Failed to fetch data');
    const json = await res.json();
    return json;
}

export default function AuditLogsPage() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['audit-logs'],
        queryFn: fetchData,
    });

    if (isLoading) return <div className="p-8">Loading audit logs...</div>;
    if (error) return <div className="p-8 text-red-500">Error loading audit logs.</div>;

    const logs = data?.data || [];

    return (
        <div className="p-6 md:p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                        <Shield className="mr-3 text-indigo-600" /> Audit Logs
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Immutable record of system activities</p>
                </div>
                <button className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center font-medium shadow-sm">
                    <Download className="mr-2" size={18} /> Export CSV
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
                    <div className="relative max-w-sm w-full">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input type="text" placeholder="Search by user, action or resource..." className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" />
                    </div>
                </div>
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700 font-medium text-gray-500 uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-3">Timestamp</th>
                            <th className="px-6 py-3">User</th>
                            <th className="px-6 py-3">Action</th>
                            <th className="px-6 py-3">Resource</th>
                            <th className="px-6 py-3">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {logs.map((log: any) => (
                            <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <td className="px-6 py-4 font-mono text-gray-500">{new Date(log.timestamp).toLocaleString()}</td>
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{log.user}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 font-semibold text-xs">
                                        {log.action}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{log.resource}</td>
                                <td className="px-6 py-4 text-gray-500 italic">{log.details}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
                    <p className="text-gray-500 dark:text-gray-400">Source: /api/compliance/audit-logs</p>
                </div>
            </div>
        </div>
    );
}
