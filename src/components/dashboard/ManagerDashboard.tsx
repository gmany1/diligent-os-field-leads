'use client';

import { useQuery } from '@tanstack/react-query';

import TeamPerformance from './TeamPerformance';
import RecentWins from './RecentWins'; // Keeping RecentWins as it fits "Validation"
import RevenueProjectionChart from './RevenueProjectionChart';
import PipelineFunnel from './PipelineFunnel';

export default function ManagerDashboard() {
    const { data: statsData, isLoading } = useQuery({
        queryKey: ['dashboard-stats', 'MANAGER'],
        queryFn: async () => {
            const res = await fetch('/api/dashboard/stats?role=MANAGER');
            if (!res.ok) throw new Error('Failed to fetch stats');
            return res.json();
        }
    });

    const kpis = statsData?.data || {
        pipeline: 0,
        conversionRate: 0,
        activeLeadsCount: 0
    };

    if (isLoading) return <div className="p-8 animate-pulse space-y-4">
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div className="grid grid-cols-3 gap-4">
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg col-span-2"></div>
        </div>
    </div>;

    return (
        <div className="space-y-8">
            {/* 1. The Vision (Control) - Top KPIs */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Hola, Jesus (LA Branch)</h2>
                <p className="text-sm text-gray-500 mb-6">Here is your branch performance overview.</p>

                {/* Manager KPIs */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-8">
                    {/* KPI 1: Team Performance (Weekly) - Visualized in TeamPerformance component below, but let's put a summary here or just use the big chart */}
                    {/* Let's stick to the "Big Number" style for the top row as per "Glanceability" */}

                    {/* KPI 3: Revenue Projection (Big Number with Trend) */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-xl p-6 border-l-4 border-indigo-500">
                        <dt className="text-sm font-medium text-gray-500 truncate uppercase tracking-wider">Projected Revenue (Month)</dt>
                        <dd className="mt-2 text-4xl font-bold text-gray-900 dark:text-white">$45,000</dd>
                        <div className="mt-2 flex items-center text-sm text-green-600">
                            <span className="font-bold text-lg">↑ 15%</span>
                            <span className="text-gray-400 ml-2">vs last month</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-xl p-6 border-l-4 border-yellow-500">
                        <dt className="text-sm font-medium text-gray-500 truncate uppercase tracking-wider">Active Proposals</dt>
                        <dd className="mt-2 text-4xl font-bold text-gray-900 dark:text-white">8</dd>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                            <span className="text-gray-400">Avg. Deal Size: $12.5k</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-xl p-6 border-l-4 border-green-500">
                        <dt className="text-sm font-medium text-gray-500 truncate uppercase tracking-wider">Team Goal Progress</dt>
                        <div className="flex items-end justify-between">
                            <dd className="mt-2 text-4xl font-bold text-gray-900 dark:text-white">78%</dd>
                            <span className="text-sm text-gray-500 mb-1">Target: $250k</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. The Moment "Powerful" (Real-time Projection) & Validation (Hand-off) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* KPI 2: Pipeline Health (Funnel) */}
                <div className="h-[400px]">
                    <PipelineFunnel />
                </div>

                {/* Revenue Projection Chart (Visualizing the trend) */}
                <div className="lg:col-span-2 h-[400px]">
                    <RevenueProjectionChart />
                </div>
            </div>

            {/* KPI 1: Team Performance (Detailed View) */}
            <TeamPerformance />
        </div>
    );
}
