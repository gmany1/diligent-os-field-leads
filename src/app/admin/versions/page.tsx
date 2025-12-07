'use client';

import { useQuery } from '@tanstack/react-query';
import { GitBranch, CheckCircle, Server } from 'lucide-react';

async function fetchData() {
    const res = await fetch('/api/system/versions');
    if (!res.ok) throw new Error('Failed to fetch data');
    const json = await res.json();
    return json;
}

export default function VersionHistoryPage() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['versions'],
        queryFn: fetchData,
    });

    if (isLoading) return <div className="p-8">Loading versions...</div>;
    if (error) return <div className="p-8 text-red-500">Error loading data</div>;

    const items = data?.data || [];

    return (
        <div className="p-8 space-y-6 relative">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                        <GitBranch className="mr-3 text-indigo-600" /> Version History
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">System version tracking and changelog</p>
                </div>
            </div>

            <div className="space-y-4">
                {items.map((ver: any, i: number) => (
                    <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-indigo-500">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                                    {ver.version}
                                    {ver.status === 'Current' && <span className="ml-3 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Current</span>}
                                </h3>
                                <p className="text-sm text-gray-500">Deployed on {ver.date} by {ver.deployedBy}</p>
                            </div>
                        </div>
                        <ul className="mt-4 space-y-2">
                            {ver.changes.map((change: string, j: number) => (
                                <li key={j} className="flex items-center text-gray-700 dark:text-gray-300">
                                    <CheckCircle size={16} className="mr-2 text-green-500" /> {change}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* Reliability Indicator */}
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
                    <p className="text-gray-500 dark:text-gray-400">Source: /api/system/versions</p>
                </div>
            </div>
        </div>
    );
}
