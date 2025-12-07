'use client';

import { useQuery } from '@tanstack/react-query';
import { BarChart3, TrendingUp, Users, DollarSign } from 'lucide-react';

export default function SystemStatusPage() {
    return (
        <div className="p-8 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">System Status</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">System health monitoring</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Items</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">0</p>
                        </div>
                        <BarChart3 className="text-indigo-600" size={24} />
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                <div className="text-center py-12">
                    <BarChart3 className="mx-auto text-gray-400" size={48} />
                    <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                        Report data will appear here
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Configure your report parameters to view insights
                    </p>
                </div>
            </div>
        </div>
    );
}
