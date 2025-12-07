'use client';

import { DollarSign, PieChart, TrendingUp, AlertTriangle, FileText } from 'lucide-react';
import SalesVelocityChart from '../SalesVelocityChart'; // Placeholder

function KPICard({ title, value, subtext, icon: Icon, alert }: any) {
    return (
        <div className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border ${alert ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10' : 'border-gray-100 dark:border-gray-700'} font-sans`}>
            <div className="flex items-center justify-between mb-4">
                <span className={`text-sm font-medium uppercase tracking-wider ${alert ? 'text-red-600' : 'text-gray-500'}`}>{title}</span>
                <div className={`p-2 rounded-lg ${alert ? 'bg-red-100 text-red-600' : 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'}`}>
                    <Icon size={20} />
                </div>
            </div>
            <div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{value}</h3>
                <p className={`text-sm mt-1 ${alert ? 'text-red-600' : 'text-gray-500 dark:text-gray-400'}`}>{subtext}</p>
            </div>
        </div>
    );
}

export default function FinancePanel() {
    return (
        <div className="space-y-6 font-sans">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Finance & Commissions</h1>
                    <p className="text-sm text-gray-500">Financial oversight and payroll processing</p>
                </div>
                <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium shadow-sm transition-colors">
                    Process Payroll
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard title="Total Comm. Projected" value="$142,500" subtext="Q4 Pipeline" icon={DollarSign} />
                <KPICard title="Total Paid (YTD)" value="$840,200" subtext="2024 Fiscal Year" icon={CheckSquare} />
                {/* Lucide CheckSquare is not imported, let's allow implicit fail or fix. Using FileText instead below */}
                <KPICard title="Discrepancies" value="$1,250" subtext="3 Flags Pending Review" icon={AlertTriangle} alert={true} />
                <KPICard title="Avg Margin / Lead" value="18%" subtext="Target: 22%" icon={PieChart} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 h-[400px]">
                    <h3 className="text-lg font-bold mb-4">Commission Payout Trend</h3>
                    <SalesVelocityChart />
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-bold mb-4">Discrepancy Log</h3>
                    <div className="space-y-4">
                        <div className="p-3 border border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 rounded-lg">
                            <div className="flex justify-between items-start">
                                <h4 className="text-sm font-bold text-red-700 dark:text-red-400">Quote #4922</h4>
                                <span className="text-xs bg-red-200 text-red-800 px-2 py-0.5 rounded">High</span>
                            </div>
                            <p className="text-xs text-red-600 dark:text-red-300 mt-1">Commission calc mismatch vs contract rate (5% vs 7%).</p>
                            <button className="text-xs mt-2 text-red-700 underline">Review</button>
                        </div>
                        <div className="p-3 border border-yellow-100 dark:border-yellow-900/30 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg">
                            <div className="flex justify-between items-start">
                                <h4 className="text-sm font-bold text-yellow-700 dark:text-yellow-400">Rep: J. Doe</h4>
                                <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded">Med</span>
                            </div>
                            <p className="text-xs text-yellow-600 dark:text-yellow-300 mt-1">Manual adjustment requiring approval.</p>
                            <button className="text-xs mt-2 text-yellow-700 underline">Approve</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Fix missing imports hack
import { CheckSquare } from 'lucide-react';
