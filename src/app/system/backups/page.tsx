'use client';

import { useQuery } from '@tanstack/react-query';
import { Database, Download, Play, Clock, CheckCircle, Server } from 'lucide-react';

async function fetchData() {
    // We created the endpoint at /api/admin/backups
    const res = await fetch('/api/admin/backups');
    if (!res.ok) throw new Error('Failed to fetch backups');
    return res.json();
}

export default function BackupsPage() {
    const { data, isLoading } = useQuery({
        queryKey: ['backups'],
        queryFn: fetchData,
    });

    if (isLoading) return <div className="p-8">Loading backups...</div>;

    const backups = data?.data || [];

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                        <Database className="mr-3 text-indigo-600" /> Database Backups
                    </h1>
                    <p className="text-gray-500 mt-1">Manage automated and manual snapshots</p>
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors">
                    <Play size={16} className="mr-2" /> Trigger Backup Now
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                    {/* Mobile Cards */}
                    <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
                        {backups.map((bk: any) => (
                            <div key={bk.id} className="p-4 space-y-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white">{bk.name}</p>
                                        <p className="text-xs text-gray-500 flex items-center mt-1">
                                            <Clock size={12} className="mr-1" /> {new Date(bk.date).toLocaleString()}
                                        </p>
                                    </div>
                                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{bk.type}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Size: <span className="font-mono text-gray-700 dark:text-gray-300">{bk.size}</span></span>
                                    <span className="flex items-center text-green-600 font-medium text-xs">
                                        <CheckCircle size={14} className="mr-1" /> {bk.status}
                                    </span>
                                </div>
                                <button className="w-full mt-2 py-2 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded text-indigo-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <Download size={16} className="mr-2" /> Download
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Desktop Table */}
                    <table className="hidden md:table w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Backup Name</th>
                                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Date Taken</th>
                                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Size</th>
                                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Type</th>
                                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Status</th>
                                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {backups.map((bk: any) => (
                                <tr key={bk.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{bk.name}</td>
                                    <td className="px-6 py-4 text-gray-500 text-sm flex items-center">
                                        <Clock size={14} className="mr-2" /> {new Date(bk.date).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 font-mono text-sm">{bk.size}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{bk.type}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="flex items-center text-green-600 font-medium text-sm">
                                            <CheckCircle size={14} className="mr-1" /> {bk.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center justify-end w-full">
                                            <Download size={16} className="mr-1" /> Download
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
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
                    <p className="text-gray-500 dark:text-gray-400">Source: /api/admin/backups</p>
                </div>
            </div>
        </div>
    );
}
