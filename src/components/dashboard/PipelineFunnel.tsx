'use client';

import { FunnelChart, Funnel, LabelList, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const DATA = [
    { value: 100, name: 'New', fill: '#6366f1' },
    { value: 70, name: 'Contacted', fill: '#8b5cf6' },
    { value: 30, name: 'Proposal', fill: '#ec4899' },
    { value: 5, name: 'Won', fill: '#10b981' },
];

export default function PipelineFunnel({ data }: { data?: any[] }) {
    const chartData = data || DATA;

    return (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 h-full">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Pipeline Health</h3>
            <div className="h-[300px] w-full min-w-0">
                <ResponsiveContainer width="99%" height="100%" debounce={200}>
                    <FunnelChart>
                        <Tooltip />
                        <Funnel
                            dataKey="value"
                            data={chartData}
                            isAnimationActive
                        >
                            <LabelList position="right" fill="#6b7280" stroke="none" dataKey="name" />
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Funnel>
                    </FunnelChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-2 text-center text-xs text-gray-500">
                Conversion drop-off at Proposal stage needs attention.
            </div>
        </div>
    );
}
