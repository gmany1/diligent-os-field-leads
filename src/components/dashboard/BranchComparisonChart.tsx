'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';

const DATA = [
    { branch: 'Los Angeles', pipeline: 125000, revenue: 45000 },
    { branch: 'El Monte', pipeline: 98000, revenue: 32000 },
    { branch: 'Norwalk', pipeline: 85000, revenue: 28000 },
    { branch: 'Moreno Valley', pipeline: 65000, revenue: 15000 },
    { branch: 'San Antonio', pipeline: 45000, revenue: 12000 },
];

import { useMounted } from '@/hooks/useMounted';

export default function BranchComparisonChart() {
    const mounted = useMounted();

    if (!mounted) return <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 h-full animate-pulse" />;

    return (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 h-full">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Branch Performance</h3>
            <div className="h-[300px] w-full min-w-0 relative">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <BarChart data={DATA} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis dataKey="branch" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} tickFormatter={(value) => `$${value / 1000}k`} />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                        />
                        <Legend />
                        <Bar dataKey="pipeline" name="Pipeline Value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="revenue" name="Revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-4 text-xs text-gray-500 text-center">
                San Antonio is lagging behind in pipeline generation.
            </div>
        </div>
    );
}
