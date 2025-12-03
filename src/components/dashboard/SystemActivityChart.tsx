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
    { day: 'Mon', logins: 120 },
    { day: 'Tue', logins: 132 },
    { day: 'Wed', logins: 101 },
    { day: 'Thu', logins: 134 },
    { day: 'Fri', logins: 90 },
    { day: 'Sat', logins: 23 },
    { day: 'Sun', logins: 21 },
];

export default function SystemActivityChart() {
    return (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 h-full">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">System Activity</h3>
            <div className="h-[250px] w-full min-w-0">
                <ResponsiveContainer width="99%" height="100%" debounce={200}>
                    <AreaChart data={DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorLogins" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                        <Tooltip />
                        <Area
                            type="monotone"
                            dataKey="logins"
                            stroke="#6366f1"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorLogins)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
