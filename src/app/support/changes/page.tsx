'use client';

import { useQuery } from '@tanstack/react-query';
import { GitPullRequest, CheckCircle, Clock, Save, Server } from 'lucide-react';

async function fetchData() {
    // Calling the API we created
    const res = await fetch('/api/admin/changes');
    if (!res.ok) throw new Error('Failed to fetch data');
    const json = await res.json();
    return json;
}

export default function ChangeRequestsPage() {
    const { data, isLoading, error } = useQuery({ queryKey: ['changes'], queryFn: fetchData });
    if (isLoading) return <div className="p-8">Loading changes...</div>;
    if (error) return <div className="p-8 text-red-500">Error loading data</div>;

    const items = data?.data || [];

    return (
        <div className="p-8 space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                <GitPullRequest className="mr-3 text-indigo-600" /> Change Requests
            </h1>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-500">ID</th>
                            <th className="px-6 py-4 font-semibold text-gray-500">Title</th>
                            <th className="px-6 py-4 font-semibold text-gray-500">Type</th>
                            <th className="px-6 py-4 font-semibold text-gray-500">Status</th>
                            <th className="px-6 py-4 font-semibold text-gray-500">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {items.map((item: any) => (
                            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="px-6 py-4 font-mono text-sm text-gray-500">{item.id}</td>
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{item.title}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${item.type === 'Feature' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                                        {item.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {item.status === 'Approved' ? (
                                        <span className="flex items-center text-green-600 font-medium text-sm"><CheckCircle size={14} className="mr-1" /> Approved</span>
                                    ) : (
                                        <span className="flex items-center text-yellow-600 font-medium text-sm"><Clock size={14} className="mr-1" /> Pending</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">{new Date(item.date).toLocaleDateString()}</td>
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
                    <p className="text-gray-500 dark:text-gray-400">Source: /api/admin/changes</p>
                </div>
            </div>
        </div>
    );
}
