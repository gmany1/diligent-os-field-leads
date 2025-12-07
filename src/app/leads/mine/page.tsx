'use client';

import { useQuery } from '@tanstack/react-query';
import { FileText, Download, Calendar, User } from 'lucide-react';

async function fetchMyLeads() {
    const res = await fetch('/api/leads?mine=true');
    if (!res.ok) throw new Error('Failed to fetch leads');
    return res.json();
}

export default function MyLeadsPage() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['my-leads'],
        queryFn: fetchMyLeads,
    });

    if (isLoading) return <div className="p-8">Loading your leads...</div>;
    if (error) return <div className="p-8 text-red-500">Error loading leads</div>;

    const leads = data?.data || [];

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Leads</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Leads assigned to you</p>
                </div>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                    <Download className="inline mr-2" size={18} />
                    Export
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Assigned</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{leads.length}</p>
                        </div>
                        <FileText className="text-indigo-600" size={24} />
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Lead</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stage</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Branch</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {leads.map((lead: any) => (
                            <tr key={lead.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{lead.name}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">{lead.phone || 'No phone'}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${lead.stage === 'WON' ? 'bg-green-100 text-green-800' :
                                            lead.stage === 'LOST' ? 'bg-red-100 text-red-800' :
                                                lead.stage === 'HOT' ? 'bg-orange-100 text-orange-800' :
                                                    'bg-blue-100 text-blue-800'
                                        }`}>
                                        {lead.stage}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {lead.branch?.name || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(lead.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <a href={`/leads/${lead.id}`} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400">View</a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
