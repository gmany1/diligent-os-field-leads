'use client';

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';

const DATA = [
    { name: 'Technology', value: 45, color: '#6366f1' }, // Indigo
    { name: 'Health', value: 30, color: '#10b981' }, // Emerald
    { name: 'Manufacturing', value: 25, color: '#f59e0b' }, // Amber
];

export default function MarketSegmentAnalysis() {
    return (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 h-full">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Acquisition by Segment</h3>
                    <p className="text-sm text-gray-500">New Clients Distribution</p>
                </div>
            </div>

            <div className="h-[300px] w-full relative min-w-0">
                <ResponsiveContainer width="99%" height="100%" debounce={200}>
                    <PieChart>
                        <Pie
                            data={DATA}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {DATA.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            formatter={(value: number) => [`${value}%`, 'Share']}
                        />
                        <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                </ResponsiveContainer>
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">45%</span>
                    <span className="text-xs text-gray-500">Tech</span>
                </div>
            </div>
            <div className="mt-2 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800">
                <p className="text-sm text-indigo-800 dark:text-indigo-200">
                    <strong>Strategy:</strong> Tech is our best market. Double down on marketing here.
                </p>
            </div>
        </div>
    );
}
