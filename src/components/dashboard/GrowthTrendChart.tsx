'use client';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart
} from 'recharts';

const DATA = [
    { month: 'Jan', revenue: 120000 },
    { month: 'Feb', revenue: 135000 },
    { month: 'Mar', revenue: 145000 },
    { month: 'Apr', revenue: 160000 },
    { month: 'May', revenue: 185000 },
    { month: 'Jun', revenue: 210000 },
    { month: 'Jul', revenue: 240000 },
    { month: 'Aug', revenue: 265000 },
    { month: 'Sep', revenue: 290000 },
    { month: 'Oct', revenue: 310000 },
];

import { useMounted } from '@/hooks/useMounted';

export default function GrowthTrendChart() {
    const mounted = useMounted();

    if (!mounted) return <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 h-full animate-pulse" />;

    return (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 h-full">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Revenue Growth</h3>
                    <p className="text-sm text-gray-500">Monthly Revenue from New Clients</p>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">+158%</p>
                    <p className="text-xs text-gray-500">YoY Growth</p>
                </div>
            </div>

            <div className="h-[300px] w-full min-w-0 relative">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <AreaChart data={DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorRevenueGrowth" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} tickFormatter={(value) => `$${value / 1000}k`} />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                        />
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorRevenueGrowth)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
