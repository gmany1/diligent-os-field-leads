import { auth } from '@/auth';
import { register } from '@/lib/metrics';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import React from 'react';

export const dynamic = 'force-dynamic';

export default async function SystemPage() {
    const session = await auth();
    if (session?.user?.role !== 'IT_ADMIN' && session?.user?.role !== 'MANAGER') {
        redirect('/');
    }

    // 1. Get Metrics Directly
    let metricsStr = '';
    try {
        metricsStr = await register.metrics();
    } catch (e) {
        metricsStr = '# Error fetching metrics';
    }

    // 2. Parse basic stats
    const parseMetric = (name: string) => {
        const regex = new RegExp(`^${name}.*?\\s+(\\d+(\\.\\d+)?)`, 'm');
        const match = metricsStr.match(regex);
        return match ? parseFloat(match[1]) : 0;
    };

    const httpRequests = parseMetric('http_requests_total');
    const heapUsed = (parseMetric('nodejs_heap_size_used_bytes') / 1024 / 1024).toFixed(2); // MB
    const uptimeSec = process.uptime();
    const uptimeHours = (uptimeSec / 3600).toFixed(2);

    // 3. Check DB Status
    let dbStatus = 'Unknown';
    let dbLatency = 0;
    try {
        const start = performance.now();
        await prisma.$queryRaw`SELECT 1`;
        dbLatency = performance.now() - start;
        dbStatus = 'Connected';
    } catch (e) {
        dbStatus = 'Error';
    }

    // 4. Counts
    const userCount = await prisma.user.count();
    const leadCount = await prisma.lead.count();
    const errorLogCount = (metricsStr.match(/level="error"/g) || []).length; // Rough count from metrics if we had a log counter, else 0. 
    // Actually we don't have a log counter in metrics yet, let's use a mocked one or skip.

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-10">
            <div className="sm:flex sm:items-center mb-8">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold leading-6 text-gray-900 dark:text-white">System Observability</h1>
                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                        Real-time metrics, system health, and performance status.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {/* Status Card */}
                <Card title="System Status" value={dbStatus === 'Connected' ? 'Healthy' : 'Critical'}
                    color={dbStatus === 'Connected' ? 'text-green-600' : 'text-red-600'}
                    sub={`DB Latency: ${dbLatency.toFixed(2)}ms`} />

                {/* Uptime Card */}
                <Card title="Uptime" value={`${uptimeHours} hrs`} sub="Continuous Availability" />

                {/* HTTP Requests */}
                <Card title="Total Requests" value={httpRequests.toFixed(0)} sub="Since last restart" />

                {/* Create a Memory Card */}
                <Card title="Memory Usage" value={`${heapUsed} MB`} sub="NodeJS Heap Used" />
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">Database Stats</h3>
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                        <Stat label="Total Users" value={userCount} />
                        <Stat label="Total Leads" value={leadCount} />
                        <Stat label="DB Connection" value={dbStatus} />
                        <Stat label="DB Latency" value={`${dbLatency.toFixed(2)}ms`} />
                    </dl>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">Raw Metrics Preview</h3>
                    <pre className="mt-2 p-4 bg-gray-100 dark:bg-gray-900 rounded-md overflow-auto h-64 text-xs font-mono text-gray-800 dark:text-gray-200">
                        {metricsStr.split('\n').filter(l => !l.startsWith('#') && l.trim() !== '').slice(0, 50).join('\n')}
                        {metricsStr.split('\n').length > 50 && '\n...'}
                    </pre>
                </div>
            </div>
        </div>
    );
}

function Card({ title, value, sub, color = 'text-gray-900 dark:text-white' }: { title: string, value: string | number, sub?: string, color?: string }) {
    return (
        <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 py-5 shadow sm:p-6">
            <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">{title}</dt>
            <dd className={`mt-1 text-3xl font-semibold tracking-tight ${color}`}>{value}</dd>
            {sub && <p className="mt-1 text-xs text-gray-400">{sub}</p>}
        </div>
    );
}

function Stat({ label, value }: { label: string, value: string | number }) {
    return (
        <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
            <dt className="font-medium text-gray-500 dark:text-gray-400">{label}</dt>
            <dd className="mt-1 text-lg text-gray-900 dark:text-white">{value}</dd>
        </div>
    );
}
