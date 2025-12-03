'use client';

import {
    ComposedChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const DATA = [
    { quarter: 'Q1', days: 45, trend: 45 },
    { quarter: 'Q2', days: 42, trend: 43 },
    { quarter: 'Q3', days: 38, trend: 40 },
    { quarter: 'Q4', days: 32, trend: 35 },
];

export default function SalesVelocityChart() {
    return (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 h-full">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Closing Velocity</h3>
                    <p className="text-sm text-gray-500">Avg. Days to Close (Quarterly)</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-600 font-medium bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">
                    <span>↓ Faster & Efficient</span>
                </div>
            </div>

            <div className="h-[300px] w-full min-w-0">
                <ResponsiveContainer width="99%" height="100%" debounce={200}>
                    <ComposedChart data={DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis dataKey="quarter" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="days" barSize={40} fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                        <Line
                            type="monotone"
                            dataKey="trend"
                            stroke="#ef4444"
                            strokeWidth={3}
                            dot={false}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
