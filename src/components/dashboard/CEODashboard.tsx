'use client';

import { useQuery } from '@tanstack/react-query';
import SalesVelocityChart from './SalesVelocityChart';
import MarketSegmentAnalysis from './MarketSegmentAnalysis';
import GrowthTrendChart from './GrowthTrendChart';
import BranchComparisonChart from './BranchComparisonChart';
import LeadMapWidget from './LeadMapWidget';
import AIInsights from '../AIInsights';

export default function CEODashboard() {
    const { data: analytics, isLoading: statsLoading } = useQuery({
        queryKey: ['analytics'],
        queryFn: async () => {
            const res = await fetch('/api/analytics');
            if (!res.ok) throw new Error('Failed');
            return res.json();
        }
    });

    if (statsLoading) return <div className="p-8 animate-pulse space-y-4">
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div className="grid grid-cols-2 gap-4">
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
    </div>;

    return (
        <div className="space-y-8">
            {/* 1. The Perspective (Strategy) - High Level KPIs & Velocity */}
            <div>
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome, Sal & Ana</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Strategic insights for Q4 2024</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700">
                            Export Board Report
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Key Strategic Metrics */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                            <dt className="text-sm font-medium text-gray-500 truncate uppercase tracking-wider">Total Pipeline Value</dt>
                            <dd className="mt-2 text-4xl font-bold text-gray-900 dark:text-white">
                                ${analytics?.pipelineValue?.toLocaleString() || '0'}
                            </dd>
                            <div className="mt-4 flex items-center text-sm">
                                <span className="text-green-600 font-medium bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded">↑ 24% YoY</span>
                                <span className="text-gray-400 ml-2">vs Q4 2023</span>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                            <dt className="text-sm font-medium text-gray-500 truncate uppercase tracking-wider">Avg. Deal Size</dt>
                            <dd className="mt-2 text-4xl font-bold text-gray-900 dark:text-white">$12,450</dd>
                            <div className="mt-4 flex items-center text-sm">
                                <span className="text-green-600 font-medium bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded">↑ 8% QoQ</span>
                            </div>
                        </div>
                    </div>

                    {/* Sales Velocity Chart */}
                    <div className="lg:col-span-2">
                        <SalesVelocityChart />
                    </div>
                </div>
            </div>

            {/* 2. The Allocation (Investment) & The Powerful Moment (Growth) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Market Segment Analysis (Allocation) */}
                <div className="h-[450px]">
                    <MarketSegmentAnalysis />
                </div>

                {/* Growth Trend (The Powerful Moment) */}
                <div className="h-[450px]">
                    <GrowthTrendChart />
                </div>
            </div>

            {/* 3. Expansion & Operations (New Section for Ops Director/Execs) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 h-[400px]">
                    <BranchComparisonChart />
                </div>
                <div className="h-[400px]">
                    <LeadMapWidget />
                </div>
            </div>

            {/* 3. The Narrative (AI Insights) */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-indigo-100 dark:border-indigo-800">
                <h3 className="text-lg font-bold text-indigo-900 dark:text-white mb-4 flex items-center gap-2">
                    <span>✨</span> AI Strategic Summary
                </h3>
                <p className="text-indigo-800 dark:text-indigo-200 leading-relaxed">
                    Based on current velocity and pipeline growth, we are projected to exceed Q4 targets by <strong>12%</strong>.
                    The <strong>Technology sector</strong> is showing the highest ROI, suggesting a strategic pivot in resource allocation.
                    Recommendation: Increase ad spend in Tech vertical by 20% for the remaining quarter to maximize yield.
                </p>
            </div>
        </div>
    );
}
