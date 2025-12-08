'use client';

import { useQuery } from '@tanstack/react-query';
import { LifeBuoy, AlertCircle, CheckCircle, Clock, Server } from 'lucide-react';

async function fetchData() {
    const res = await fetch('/api/support/incidents'); // Correct endpoint
    if (!res.ok) throw new Error('Failed to fetch data');
    const json = await res.json();
    return json;
}

export default function SupportIncidentsPage() {
    const { data, isLoading, error } = useQuery({ queryKey: ['support-incidents'], queryFn: fetchData });

    if (isLoading) return <div className="p-8">Loading tickets...</div>;
    // Removed the error placeholder, will show actual error message if fails
    if (error) return <div className="p-8 text-red-500">Error loading support tickets: {(error as Error).message}</div>;

    const items = data?.data || [];

    return (
        <div className="p-8 space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                <LifeBuoy className="mr-3 text-indigo-600" /> My Support Tickets
            </h1>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Mobile Cards */}
                <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
                    {items.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No active support tickets.</div>
                    ) : items.map((tkt: any) => (
                        <div key={tkt.id} className="p-4 space-y-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">{tkt.subject}</h3>
                                    <p className="text-xs font-mono text-gray-400 mt-1">{tkt.id} • {new Date(tkt.created).toLocaleDateString()}</p>
                                </div>
                                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${tkt.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                                    {tkt.status}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${tkt.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {tkt.priority} Priority
                                </span>
                                <button className="text-indigo-600 text-sm font-medium">View Ticket</button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Desktop Table */}
                <table className="hidden md:table w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-500">Ticket ID</th>
                            <th className="px-6 py-4 font-semibold text-gray-500">Subject</th>
                            <th className="px-6 py-4 font-semibold text-gray-500">Priority</th>
                            <th className="px-6 py-4 font-semibold text-gray-500">Status</th>
                            <th className="px-6 py-4 font-semibold text-gray-500">Created</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {items.length === 0 ? (
                            <tr><td colSpan={5} className="p-8 text-center text-gray-500">No active support tickets.</td></tr>
                        ) : items.map((tkt: any) => (
                            <tr key={tkt.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="px-6 py-4 font-mono text-sm text-gray-500">{tkt.id}</td>
                                <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{tkt.subject}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${tkt.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {tkt.priority}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${tkt.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                                        {tkt.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">{new Date(tkt.created).toLocaleDateString()}</td>
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
                    <p className="text-gray-500 dark:text-gray-400">Source: /api/support/incidents</p>
                </div>
            </div>
        </div>
    );
}
