'use client';

import { useQuery } from '@tanstack/react-query';
import { Eye, Lock, ShieldAlert, Server } from 'lucide-react';

async function fetchData() {
    const res = await fetch('/api/compliance/pii-access');
    if (!res.ok) throw new Error('Failed to fetch data');
    const json = await res.json();
    return json;
}

export default function PiiAccessPage() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['pii-access'],
        queryFn: fetchData,
    });

    if (isLoading) return <div className="p-8">Loading PII logs...</div>;
    if (error) return <div className="p-8 text-red-500">Error loading data.</div>;

    const accesses = data?.data || [];

    return (
        <div className="p-6 md:p-8 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                    <Lock className="mr-3 text-red-600" /> PII Access Log
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Monitoring access to Personally Identifiable Information</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-red-50 dark:bg-red-900/10 border-b border-red-100 dark:border-red-900/20">
                        <tr>
                            <th className="px-6 py-3 font-semibold text-red-800 dark:text-red-300">Time</th>
                            <th className="px-6 py-3 font-semibold text-red-800 dark:text-red-300">User</th>
                            <th className="px-6 py-3 font-semibold text-red-800 dark:text-red-300">Subject Accessed</th>
                            <th className="px-6 py-3 font-semibold text-red-800 dark:text-red-300">Field(s)</th>
                            <th className="px-6 py-3 font-semibold text-red-800 dark:text-red-300">Justification</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {accesses.map((item: any) => (
                            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="px-6 py-4 text-gray-500">{new Date(item.time).toLocaleString()}</td>
                                <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{item.user}</td>
                                <td className="px-6 py-4">{item.subject}</td>
                                <td className="px-6 py-4"><span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-mono">{item.field}</span></td>
                                <td className="px-6 py-4 italic text-gray-600">{item.reason}</td>
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
                    <p className="text-gray-500 dark:text-gray-400">Source: /api/compliance/pii-access</p>
                </div>
            </div>
        </div>
    );
}
