'use client';

import { useQuery } from '@tanstack/react-query';
import { FileText, Download } from 'lucide-react';

async function fetchData() {
    const res = await fetch('/api/privacy/access-log');
    if (!res.ok) throw new Error('Failed to fetch data');
    return res.json();
}

export default function PIIAccessLogPage() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['pii-access-log'],
        queryFn: fetchData,
    });

    if (isLoading) return <div className="p-8">Loading...</div>;
    if (error) return <div className="p-8 text-red-500">Error loading data</div>;

    const items = data?.data || [];

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">PII Access Log</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Personal data access history</p>
                </div>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                    <Download className="inline mr-2" size={18} />
                    Export
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="text-center py-12">
                    <FileText className="mx-auto text-gray-400" size={48} />
                    <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                        {items.length} items found
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Data will be displayed here
                    </p>
                </div>
            </div>
        </div>
    );
}
