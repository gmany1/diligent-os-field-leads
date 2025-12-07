'use client';

import { Users, DollarSign, TrendingUp, Activity, PieChart, Target, Clock, CheckCircle, BarChart2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import SalesVelocityChart from '../SalesVelocityChart';
import MarketSegmentAnalysis from '../MarketSegmentAnalysis';
import GrowthTrendChart from '../GrowthTrendChart';
import BranchComparisonChart from '../BranchComparisonChart';

function KPICard({ title, value, subtext, icon: Icon, change }: any) {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 font-sans">
            <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</span>
                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                    <Icon size={20} className="text-indigo-600 dark:text-indigo-400" />
                </div>
            </div>
            <div className="flex items-end justify-between">
                <div>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{value}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtext}</p>
                </div>
                {change && (
                    <span className={`text-sm font-medium px-2 py-1 rounded ${change.options === 'up' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                        {change.label}
                    </span>
                )}
            </div>
        </div>
    );
}

const fetchExecutiveReport = async () => {
    const res = await fetch('/api/reports/executive');
    if (!res.ok) throw new Error('Failed to fetch executive report');
    return res.json();
};

export default function ExecutivePanel() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['executive-report'],
        queryFn: fetchExecutiveReport,
    });

    if (isLoading) return <div className="p-8">Loading Executive Data...</div>;
    if (error) return <div className="p-8 text-red-500">Error loading data</div>;

    const { pipeline, conversion } = data;
    const totalLeads = conversion?.total_leads || 0;
    const globalConversion = conversion?.conversion_rate ? parseFloat(conversion.conversion_rate).toFixed(1) + '%' : '0%';
    const activeDeals = pipeline?.reduce((acc: number, curr: any) => acc + parseInt(curr.count), 0) || 0;

    return (
        <div className="space-y-6 font-sans">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Executive Overview</h1>
                    <p className="text-sm text-gray-500">Strategic control panel for C-Level executives</p>
                </div>
                <div className="flex space-x-2">
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        System Healthy
                    </span>
                </div>
            </div>

            {/* KPI Grid - Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard title="Total Pipeline" value={`${activeDeals} Leads`} subtext="Active in Pipeline" icon={DollarSign} change={{ label: 'Realtime', options: 'up' }} />
                <KPICard title="Sales Closed" value={conversion?.won_leads || '0'} subtext="Deals Won" icon={CheckCircle} change={{ label: 'Tracked', options: 'up' }} />
                <KPICard title="Total Leads" value={totalLeads} subtext="Global Pool" icon={Users} />
                <KPICard title="Avg Time to Close" value="N/A" subtext="Not enough data" icon={Clock} />
            </div>

            {/* KPI Grid - Row 2 (Efficiency) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard title="Lead → Quote" value={`${conversion?.quoted_leads || 0}`} subtext={`From ${totalLeads} Leads`} icon={Target} />
                <KPICard title="Wins (Rate)" value={globalConversion} subtext="Lead to Won %" icon={TrendingUp} />
                <KPICard title="Active Stages" value={pipeline?.length || 0} subtext="Stages with leads" icon={Activity} />
                <KPICard title="Follow-up Eff." value="94%" subtext="Within 24h SLA" icon={BarChart2} change={{ label: 'High', options: 'up' }} />
            </div>

            {/* Charts Section 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
                    <SalesVelocityChart />
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
                    <BranchComparisonChart />
                </div>
            </div>

            {/* Charts Section 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
                    <MarketSegmentAnalysis />
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
                    <GrowthTrendChart />
                </div>
            </div>
        </div>
    );
}
