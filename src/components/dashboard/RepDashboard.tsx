'use client';

import { useQuery } from '@tanstack/react-query';

import Link from 'next/link';
import DailyFocusWidget from './DailyFocusWidget';
import ProgressRing from './ProgressRing';
import ConversionGauge from './ConversionGauge';


interface RepDashboardProps {
    onAddLeadClick?: () => void;
    onViewCalendarClick?: () => void;
}

export default function RepDashboard({ onAddLeadClick, onViewCalendarClick }: RepDashboardProps) {
    const { data: statsData, isLoading } = useQuery({
        queryKey: ['dashboard-stats', 'REP'],
        queryFn: async () => {
            const res = await fetch('/api/dashboard/stats?role=FIELD_LEAD_REP');
            if (!res.ok) throw new Error('Failed to fetch stats');
            return res.json();
        }
    });

    const kpis = statsData?.data || {
        pipeline: 125000, // Mocked for visual match
        revenue: 0,
        activeLeadsCount: 0
    };

    if (isLoading) return <div className="p-4 animate-pulse">Loading Your Data...</div>;

    return (
        <div className="space-y-6">
            {/* 1. Top Bar: Quick Actions & Welcome */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Hola, Manuel! 👋</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Ready to capture Los Angeles today?</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <button
                        onClick={onAddLeadClick}
                        className="flex-1 sm:flex-none justify-center items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-all hover:scale-105 active:scale-95"
                    >
                        <span>+</span> Add New Lead
                    </button>
                    <button
                        onClick={onViewCalendarClick}
                        className="flex-1 sm:flex-none justify-center items-center gap-2 px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                    >
                        📅 Calendar
                    </button>
                </div>
            </div>

            {/* 2. High Priority: Daily Focus Widget (KPI 1) */}
            <DailyFocusWidget />

            {/* 3. The "Executor" KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* KPI 2: My Progress Today */}
                <ProgressRing />

                {/* KPI 3: Pipeline Value */}
                <Link href="/crm" className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-center hover:border-indigo-200 transition-colors group">
                    <div className="flex items-start justify-between">
                        <dt className="text-sm font-medium text-gray-500 uppercase tracking-wider">Pipeline Value</dt>
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                            Active
                        </span>
                    </div>
                    <dd className="mt-4 text-4xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600">
                        ${kpis.pipeline.toLocaleString()}
                    </dd>
                    <p className="mt-2 text-sm text-gray-500">Sum of all open proposals</p>
                </Link>

                {/* KPI 4: Conversion Rate */}
                <ConversionGauge />
            </div>
        </div>
    );
}
