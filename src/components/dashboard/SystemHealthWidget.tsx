'use client';

import { useQuery } from '@tanstack/react-query';

export default function SystemHealthWidget() {
    const { data: health, isLoading, isError } = useQuery({
        queryKey: ['system-health'],
        queryFn: async () => {
            const res = await fetch('/api/health');
            if (!res.ok) throw new Error('Failed to fetch health');
            return res.json();
        },
        refetchInterval: 30000 // Check every 30 seconds
    });

    if (isLoading) return (
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg p-5 border-l-4 border-gray-300">
            <dt className="text-sm font-medium text-gray-500 truncate">System Health</dt>
            <dd className="mt-1 text-lg font-semibold text-gray-400">Checking...</dd>
        </div>
    );

    if (isError || health?.status !== 'healthy') {
        return (
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg p-5 border-l-4 border-red-500">
                <dt className="text-sm font-medium text-gray-500 truncate">System Health</dt>
                <dd className="mt-1 text-lg font-semibold text-red-600">Degraded</dd>
                <p className="text-xs text-red-500 mt-1">DB: {health?.checks?.database?.status || 'Error'}</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg p-5 border-l-4 border-green-500">
            <dt className="text-sm font-medium text-gray-500 truncate">System Health</dt>
            <div className="flex justify-between items-end">
                <dd className="mt-1 text-2xl font-semibold text-green-600">Healthy</dd>
                <span className="text-xs text-gray-400">{health.checks.database.latency} latency</span>
            </div>
            <div className="mt-2 text-xs text-gray-500 flex gap-2">
                <span>Mem: {health.checks.memory.used}</span>
                <span>•</span>
                <span>Uptime: {Math.round(health.checks.uptime.seconds / 60)}m</span>
            </div>
        </div>
    );
}
