'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

const fetchLeads = async () => {
    const res = await fetch('/api/leads');
    if (!res.ok) throw new Error('Failed to fetch leads');
    return res.json();
};

export default function HistoryPage() {
    const { data: response, isLoading } = useQuery({
        queryKey: ['leads'],
        queryFn: fetchLeads,
    });

    const leads = response?.data || [];

    const [filter, setFilter] = useState<'ALL' | 'WON' | 'LOST' | 'IMPORTED'>('ALL');

    const historicalLeads = leads.filter((lead: any) => {
        const isImported = lead.source && lead.source !== 'Manual';
        if (filter === 'ALL') return lead.stage === 'WON' || lead.stage === 'LOST' || isImported;
        if (filter === 'IMPORTED') return isImported;
        return lead.stage === filter;
    });

    if (isLoading) return <div className="p-8">Loading history...</div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Historical Leads</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Archive of closed deals, lost opportunities, and imported legacy data.
                    </p>
                </header>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex gap-2 overflow-x-auto">
                        {['ALL', 'WON', 'LOST', 'IMPORTED'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f as any)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === f
                                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                                    : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                                    }`}
                            >
                                {f.charAt(0) + f.slice(1).toLowerCase()}
                            </button>
                        ))}
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Lead Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stage</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Source</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Value</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {historicalLeads.map((lead: any) => (
                                    <tr key={lead.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">{lead.name}</div>
                                            <div className="text-xs text-gray-500">{lead.company}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${lead.stage === 'WON' ? 'bg-green-100 text-green-800' :
                                                lead.stage === 'LOST' ? 'bg-red-100 text-red-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                {lead.stage}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {lead.source || 'Manual'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(lead.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            ${lead.value?.toLocaleString() || '0'}
                                        </td>
                                    </tr>
                                ))}
                                {historicalLeads.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                                            No historical leads found matching this filter.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
