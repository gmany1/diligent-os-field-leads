'use client';

import { useQuery } from '@tanstack/react-query';
import { Terminal, RefreshCw, Server } from 'lucide-react';

async function fetchData() {
    const res = await fetch('/api/system/logs');
    if (!res.ok) throw new Error('Failed to fetch logs');
    return res.json();
}

export default function SystemLogsPage() {
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['system-logs'],
        queryFn: fetchData,
    });

    if (isLoading) return <div className="p-8">Loading logs...</div>;

    const logs = data?.data || [];

    return (
        <div className="p-6 h-screen flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold font-mono flex items-center">
                    <Terminal className="mr-2" /> System Logs
                </h1>
                <button onClick={() => refetch()} className="p-2 hover:bg-gray-200 rounded-full">
                    <RefreshCw size={20} />
                </button>
            </div>
            <div className="flex-1 bg-gray-900 text-green-400 font-mono p-4 rounded-lg overflow-auto shadow-inner text-sm mb-16">
                {logs.map((log: any, i: number) => (
                    <div key={i} className="mb-1 border-b border-gray-800 pb-1 last:border-0">
                        <span className="text-gray-500">[{new Date(log.timestamp).toISOString()}]</span>{' '}
                        <span className={log.level === 'ERROR' ? 'text-red-500 font-bold' : log.level === 'WARN' ? 'text-yellow-500' : 'text-blue-400'}>
                            {log.level}
                        </span>{' '}
                        <span className="text-purple-400">[{log.service}]</span>{' '}
                        <span className="text-white">{log.message}</span>
                    </div>
                ))}
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
                    <p className="text-gray-500 dark:text-gray-400">Source: /api/system/logs</p>
                </div>
            </div>
        </div>
    );
}
