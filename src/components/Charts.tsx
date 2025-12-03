'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell
} from 'recharts';

interface Lead {
    id: string;
    stage: string;
    createdAt: string;
    name: string;
}

interface ChartsProps {
    leads: Lead[];
    onStageClick?: (stage: string) => void;
}

const STAGE_COLORS = {
    COLD: '#3b82f6', // Blue
    WARM: '#eab308', // Yellow
    HOT: '#f97316', // Orange
    WON: '#22c55e', // Green
    LOST: '#ef4444', // Red
};

export default function Charts({ leads, onStageClick }: ChartsProps) {
    // 1. Pipeline Funnel (Leads by Stage)
    const pipelineData = [
        { name: 'COLD', count: leads.filter(l => l.stage === 'COLD').length },
        { name: 'WARM', count: leads.filter(l => l.stage === 'WARM').length },
        { name: 'HOT', count: leads.filter(l => l.stage === 'HOT').length },
        { name: 'WON', count: leads.filter(l => l.stage === 'WON').length },
        { name: 'LOST', count: leads.filter(l => l.stage === 'LOST').length },
    ];

    // 2. Weekly Trends (Leads Created per Day - Last 7 Days)
    const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
    }).reverse();

    const trendData = last7Days.map(date => ({
        date,
        count: leads.filter(l => l.createdAt.startsWith(date)).length
    }));

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Pipeline Chart */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Pipeline Overview</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={pipelineData} onClick={(data: any) => {
                            if (data && data.activePayload && data.activePayload.length > 0 && onStageClick) {
                                onStageClick(data.activePayload[0].payload.name);
                            }
                        }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip cursor={{ fill: 'transparent' }} />
                            <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} cursor="pointer">
                                {pipelineData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={(STAGE_COLORS as any)[entry.name] || '#8884d8'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Trend Chart */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Weekly Lead Volume</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" tickFormatter={(str) => str.slice(5)} />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
