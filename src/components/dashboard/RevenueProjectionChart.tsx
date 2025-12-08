'use client';

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const DATA = [
    { month: 'Jan', actual: 40000, projected: 40000 },
    { month: 'Feb', actual: 45000, projected: 42000 },
    { month: 'Mar', actual: 55000, projected: 48000 },
    { month: 'Apr', actual: 52000, projected: 55000 },
    { month: 'May', actual: 68000, projected: 60000 },
    { month: 'Jun', actual: null, projected: 75000 },
    { month: 'Jul', actual: null, projected: 82000 },
];

export default function RevenueProjectionChart() {
    return (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 h-full">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Revenue Projection</h3>
                    <p className="text-sm text-gray-500">Actual vs Projected Growth</p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
                        <span className="text-gray-600 dark:text-gray-300">Actual</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-indigo-200 border border-indigo-500 border-dashed"></span>
                        <span className="text-gray-600 dark:text-gray-300">Projected</span>
                    </div>
                </div>
            </div>

            <div className="h-[300px] w-full min-w-0">
                <ResponsiveContainer width="99%" height="100%" debounce={200} minWidth={0}>
                    <AreaChart data={DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} tickFormatter={(value) => `$${value / 1000}k`} />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                        />
                        <Area
                            type="monotone"
                            dataKey="projected"
                            stroke="#818cf8"
                            strokeDasharray="5 5"
                            fillOpacity={1}
                            fill="url(#colorProjected)"
                            name="Projected"
                        />
                        <Area
                            type="monotone"
                            dataKey="actual"
                            stroke="#6366f1"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorActual)"
                            name="Actual"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
