'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

export default function SourceEffectivenessChart({ data }: { data?: any[] }) {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 h-full flex items-center justify-center">
                <p className="text-gray-500">No source data available</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 h-full">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Lead Source Effectiveness</h3>
            <div className="h-[300px] w-full min-w-0">
                <ResponsiveContainer width="99%" height="100%" debounce={200}>
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={100} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '0.5rem', color: '#fff' }}
                            cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                        />
                        <Legend />
                        <Bar dataKey="total" name="Total Leads" fill="#6366f1" radius={[0, 4, 4, 0]} />
                        <Bar dataKey="won" name="Won Leads" fill="#10b981" radius={[0, 4, 4, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
                {data.map((source) => (
                    <div key={source.name} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{source.name}</span>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${source.conversionRate > 20 ? 'bg-green-100 text-green-800' :
                                    source.conversionRate > 10 ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-gray-100 text-gray-800'
                                }`}>
                                {source.conversionRate}% Conv.
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
