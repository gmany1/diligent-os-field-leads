'use client';

import { useQuery } from '@tanstack/react-query';
import { Download, AlertTriangle, CheckCircle, Clock, AlertOctagon, Server } from 'lucide-react';

async function fetchData() {
    const res = await fetch('/api/system/incidents');
    if (!res.ok) throw new Error('Failed to fetch data');
    const json = await res.json();
    return json;
}

const SeverityIcon = ({ level }: { level: string }) => {
    switch (level?.toLowerCase()) {
        case 'critical': return <AlertOctagon className="text-red-500" />;
        case 'high': return <AlertTriangle className="text-orange-500" />;
        case 'medium': return <AlertTriangle className="text-yellow-500" />;
        default: return <Clock className="text-blue-500" />;
    }
};

const StatusBadge = ({ status }: { status: string }) => {
    const styles = {
        Open: 'bg-red-100 text-red-800 border-red-200',
        Investigating: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        Resolved: 'bg-green-100 text-green-800 border-green-200',
        Monitoring: 'bg-blue-100 text-blue-800 border-blue-200',
    };
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[status as keyof typeof styles] || styles.Monitoring}`}>
            {status}
        </span>
    );
};

export default function SystemIncidentsPage() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['system-incidents'],
        queryFn: fetchData,
    });

    if (isLoading) return <div className="p-8">Loading incidents...</div>;
    if (error) return <div className="p-8 text-red-500">Error loading data.</div>;

    const items = data?.data || [];

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                        <AlertTriangle className="mr-3 text-red-600" /> System Incidents
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Real-time incident management and post-mortems</p>
                </div>
                <button className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center font-medium shadow-sm">
                    <Download className="mr-2" size={18} /> Export Report
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Mobile Cards */}
                <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
                    {items.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <CheckCircle className="mx-auto text-green-500 mb-2" size={32} />
                            No active incidents
                        </div>
                    ) : (
                        items.map((inc: any) => (
                            <div key={inc.id} className="p-4 space-y-3">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center space-x-2">
                                        <SeverityIcon level={inc.severity} />
                                        <h3 className="font-bold text-gray-900 dark:text-white truncate max-w-[150px]">{inc.title}</h3>
                                    </div>
                                    <StatusBadge status={inc.status} />
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300">{inc.description}</p>
                                <div className="flex justify-between items-center text-xs text-xs text-gray-500">
                                    <span className="font-mono">{inc.service}</span>
                                    <span>{new Date(inc.createdAt || Date.now()).toLocaleDateString()}</span>
                                </div>
                                <div className="pt-2">
                                    <button className="w-full py-2 bg-gray-50 dark:bg-gray-700 text-indigo-600 text-sm font-medium rounded border border-gray-200 dark:border-gray-600">
                                        Manage Incident
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Desktop Table */}
                <table className="hidden md:table w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-500">Severity</th>
                            <th className="px-6 py-4 font-semibold text-gray-500">Incident</th>
                            <th className="px-6 py-4 font-semibold text-gray-500">Status</th>
                            <th className="px-6 py-4 font-semibold text-gray-500">Affected Service</th>
                            <th className="px-6 py-4 font-semibold text-gray-500">Reported</th>
                            <th className="px-6 py-4 font-semibold text-gray-500 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    <CheckCircle className="mx-auto text-green-500 mb-2" size={32} />
                                    No active incidents
                                </td>
                            </tr>
                        ) : (
                            items.map((inc: any) => (
                                <tr key={inc.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <SeverityIcon level={inc.severity} />
                                            <span className="capitalize text-sm font-medium">{inc.severity}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-gray-900 dark:text-white">{inc.title}</p>
                                        <p className="text-xs text-gray-500 mt-0.5 max-w-xs truncate">{inc.description}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={inc.status} />
                                    </td>
                                    <td className="px-6 py-4 font-mono text-sm text-gray-600 dark:text-gray-300">{inc.service}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(inc.createdAt || Date.now()).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-indigo-600 hover:text-indigo-800 font-medium text-sm">Manage</button>
                                    </td>
                                </tr>
                            ))
                        )}
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
                    <p className="text-gray-500 dark:text-gray-400">Source: /api/system/incidents</p>
                </div>
            </div>
        </div>
    );
}
