'use client';

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const DATA = [
    { name: 'Completed', value: 8, color: '#10b981' }, // Green
    { name: 'Remaining', value: 2, color: '#e5e7eb' }, // Gray
];

export default function ProgressRing() {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center h-full">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">My Progress Today</h3>
            <div className="relative w-32 h-32">
                <PieChart width={128} height={128}>
                    <Pie
                        data={DATA}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={55}
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                        stroke="none"
                    >
                        {DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                </PieChart>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">8/10</span>
                    <span className="text-xs text-gray-500">Calls</span>
                </div>
            </div>
            <p className="mt-4 text-sm text-center text-green-600 font-medium">Almost there! 🚀</p>
        </div>
    );
}
