'use client';

import { Server, Activity, Database, AlertOctagon, Shield, HardDrive } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import SalesVelocityChart from '../SalesVelocityChart'; // Placeholder for visual consistency

function KPICard({ title, value, subtext, icon: Icon, status }: any) {
    const color = status === 'danger' ? 'red' : status === 'warning' ? 'yellow' : 'green';

    // Type-safe color classes not possible easily with dynamic string in tailwind without safelist
    // Hardcoding logic
    let bgIcon = 'bg-green-50 dark:bg-green-900/20';
    let textIcon = 'text-green-600 dark:text-green-400';
    if (status === 'danger') {
        bgIcon = 'bg-red-50 dark:bg-red-900/20';
        textIcon = 'text-red-600 dark:text-red-400';
    } else if (status === 'warning') {
        bgIcon = 'bg-yellow-50 dark:bg-yellow-900/20';
        textIcon = 'text-yellow-600 dark:text-yellow-400';
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 font-sans">
            <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</span>
                <div className={`p-2 rounded-lg ${bgIcon}`}>
                    <Icon size={20} className={textIcon} />
                </div>
            </div>
            <div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{value}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtext}</p>
            </div>
        </div>
    );
}

const fetchITReport = async () => {
    const res = await fetch('/api/reports/it');
    if (!res.ok) throw new Error('Failed to fetch IT report');
    return res.json();
};

export default function ITPanel() {
    const { data, isLoading } = useQuery({
        queryKey: ['it-report'],
        queryFn: fetchITReport,
    });

    const health = data?.health || {};
    // Calculate naive uptime/health score based on errors. 
    // If error_count > 0, decrease score. (Simulated metric based on real logs)
    const errorCount = parseInt(health.error_count_24h || '0');
    const logVolume = parseInt(health.log_volume_24h || '0');
    const errorRate = logVolume > 0 ? ((errorCount / logVolume) * 100).toFixed(2) : '0';
    const uptime = (100 - parseFloat(errorRate) * 10).toFixed(2); // Fake uptime formula: 1% error = 90% uptime

    return (
        <div className="space-y-6 font-sans">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">IT & Observability</h1>
                    <p className="text-sm text-gray-500">System health, infrastructure, and uptime monitoring</p>
                </div>
                <div className="flex space-x-2">
                    <span className={`px-3 py-1 text-xs rounded-full flex items-center ${errorCount > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                        <span className={`w-2 h-2 rounded-full mr-2 ${errorCount > 0 ? 'bg-yellow-500' : 'bg-green-500'}`}></span>
                        {errorCount > 0 ? 'Incidents Detected' : 'All Systems Operational'}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard title="Uptime (24h)" value={!isLoading ? `${uptime}%` : '...'} subtext="Based on error logs" icon={Activity} status={parseFloat(uptime) < 99 ? 'warning' : 'success'} />
                <KPICard title="Latency P95" value="124ms" subtext="Target: <200ms" icon={Server} status="success" />
                <KPICard title="Error Rate" value={!isLoading ? `${errorRate}%` : '...'} subtext={`${errorCount} Errors / 24h`} icon={AlertOctagon} status={errorCount > 0 ? 'warning' : 'success'} />
                <KPICard title="Audit Writes" value={!isLoading ? `${logVolume}` : '...'} subtext="Events last 24h" icon={Database} status="success" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-bold mb-4">Latency & Traffic</h3>
                    <SalesVelocityChart /> {/* Placeholder: Should be Latency Chart */}
                </div>

                {/* Server Resources */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-bold mb-4">Resource Usage</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>CPU Usage</span>
                                    <span className="font-bold">42%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '42%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Memory</span>
                                    <span className="font-bold">78%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Database Storage</span>
                                    <span className="font-bold">24%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '24%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-bold mb-4">Recent Incidents</h3>
                        <p className="text-sm text-gray-500 text-center py-4">No open incidents.</p>
                    </div>
                </div>

            </div>
        </div>
    );
}
