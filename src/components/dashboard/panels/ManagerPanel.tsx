'use client';

import { Users, ClipboardList, TrendingUp, AlertCircle, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
// Reusing some charts for demonstration
import SalesVelocityChart from '../SalesVelocityChart';

function KPICard({ title, value, subtext, icon: Icon, change }: any) {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 font-sans">
            <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</span>
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Icon size={20} className="text-blue-600 dark:text-blue-400" />
                </div>
            </div>
            <div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{value}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtext}</p>
            </div>
        </div>
    );
}

const fetchManagerReport = async () => {
    const res = await fetch('/api/reports/manager');
    if (!res.ok) throw new Error('Failed to fetch manager report');
    return res.json();
};

export default function ManagerPanel() {
    // Import useQuery from @tanstack/react-query
    const { data, isLoading, error } = useQuery({
        queryKey: ['manager-report'],
        queryFn: fetchManagerReport,
    });

    if (isLoading) return <div className="p-8">Loading Manager Data...</div>;
    if (error) return <div className="p-8 text-red-500">Error loading data</div>;

    const { activity, pipeline } = data;

    // Aggregations
    const totalPipeline = pipeline.reduce((acc: number, curr: any) => acc + curr.count, 0);
    const totalActivity = activity.reduce((acc: number, curr: any) => acc + curr.count, 0);

    return (
        <div className="space-y-6 font-sans">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manager Overview</h1>
                    <p className="text-sm text-gray-500">Team performance and territory control</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard title="Pipeline Count" value={totalPipeline} subtext="Active Leads in Branch" icon={Users} />
                <KPICard title="Activities Activity" value={totalActivity} subtext="Total Branch Actions" icon={ClipboardList} />
                <KPICard title="Lead Conversion" value="-" subtext="Pipeline to Won (Calc)" icon={TrendingUp} />
                <KPICard title="Stalled Leads" value="-" subtext="Coming soon" icon={AlertCircle} />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold mb-4">Pipeline by Stage</h3>
                <div className="space-y-4">
                    {pipeline.map((p: any) => (
                        <div key={p.stage} className="flex justify-between items-center border-b pb-2 dark:border-gray-700">
                            <span className="text-gray-700 dark:text-gray-300">{p.stage}</span>
                            <span className="font-bold text-gray-900 dark:text-white">{p.count}</span>
                        </div>
                    ))}
                    {pipeline.length === 0 && <p className="text-gray-500">No leads in pipeline.</p>}
                </div>
            </div>

            {/* Team Ranking Placeholder - Needs Users Report endpoints for detail */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold mb-4">Activity Breakdown</h3>
                <div className="space-y-4">
                    {activity.map((a: any) => (
                        <div key={a.type} className="flex justify-between items-center border-b pb-2 dark:border-gray-700">
                            <span className="text-gray-700 dark:text-gray-300">{a.type}</span>
                            <span className="font-bold text-gray-900 dark:text-white">{a.count}</span>
                        </div>
                    ))}
                    {activity.length === 0 && <p className="text-gray-500">No activity recorded.</p>}
                </div>
            </div>
        </div>
    );
}
