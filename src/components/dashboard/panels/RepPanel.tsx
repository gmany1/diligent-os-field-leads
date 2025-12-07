'use client';

import { CheckSquare, Calendar, DollarSign, List, FileText } from 'lucide-react';
import SalesVelocityChart from '../SalesVelocityChart'; // Reusing for visual, ideally distinct

function KPICard({ title, value, subtext, icon: Icon }: any) {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 font-sans">
            <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</span>
                <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <Icon size={20} className="text-orange-600 dark:text-orange-400" />
                </div>
            </div>
            <div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{value}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtext}</p>
            </div>
        </div>
    );
}

export default function RepPanel() {
    return (
        <div className="space-y-6 font-sans">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Dashboard</h1>
                    <p className="text-sm text-gray-500">Daily tasks and performance tracking</p>
                </div>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm font-medium transition-colors">
                    + Quick Action
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard title="My Active Leads" value="45" subtext="In pipeline" icon={List} />
                <KPICard title="Tasks Today" value="8" subtext="3 High Priority" icon={CheckSquare} />
                <KPICard title="Quotes Sent" value="12" subtext="This Month" icon={FileText} />
                <KPICard title="Est. Commission" value="$4,250" subtext="Pending Approval" icon={DollarSign} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 h-[400px]">
                    <h3 className="text-lg font-bold mb-4">Monthly Progress</h3>
                    <SalesVelocityChart />
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-bold mb-4">Daily Focus</h3>
                    <ul className="space-y-3">
                        <li className="flex items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800">
                            <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">Call: Acme Corp</p>
                                <p className="text-xs text-red-600 dark:text-red-400">High Priority - Contract Review</p>
                            </div>
                            <button className="text-xs bg-white dark:bg-gray-800 border px-2 py-1 rounded">Start</button>
                        </li>
                        <li className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">Email: John Smith</p>
                                <p className="text-xs text-gray-500">Follow up on quote #402</p>
                            </div>
                            <button className="text-xs bg-white dark:bg-gray-800 border px-2 py-1 rounded">Start</button>
                        </li>
                        <li className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">Visit: Site 404</p>
                                <p className="text-xs text-gray-500">Site Inspection</p>
                            </div>
                            <button className="text-xs bg-white dark:bg-gray-800 border px-2 py-1 rounded">Map</button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
