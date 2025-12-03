'use client';

import { useState } from 'react';

const TEAM_DATA = [
    { id: '1', name: 'Manuel Cardenas', pipeline: 125000, activeLeads: 45, meetings: 12, proposals: 8, status: 'On Track' },
    { id: '2', name: 'Saira (Staffing)', pipeline: 0, activeLeads: 32, meetings: 28, proposals: 0, status: 'On Track' },
    { id: '3', name: 'Maria (Staffing)', pipeline: 0, activeLeads: 28, meetings: 25, proposals: 0, status: 'On Track' },
    { id: '4', name: 'Alondra (Staffing)', pipeline: 0, activeLeads: 25, meetings: 20, proposals: 0, status: 'Needs Attention' },
];

export default function TeamPerformance() {
    const [selectedRep, setSelectedRep] = useState<string | null>(null);

    return (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Team Performance (Drill-Down)</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rep Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pipeline Value</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Active Leads</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Meetings</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {TEAM_DATA.map((rep) => (
                            <tr key={rep.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                                            {rep.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">{rep.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                    ${rep.pipeline.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                    {rep.activeLeads}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                    {rep.meetings}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${rep.status === 'On Track' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {rep.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => setSelectedRep(rep.id)}
                                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                    >
                                        View Dashboard
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Drill Down Modal/View Placeholder */}
            {selectedRep && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                {TEAM_DATA.find(r => r.id === selectedRep)?.name}'s Dashboard
                            </h3>
                            <button onClick={() => setSelectedRep(null)} className="text-gray-500 hover:text-gray-700">✕</button>
                        </div>
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md mb-4">
                            <h4 className="font-bold text-yellow-800 mb-1">⚠️ Coaching Opportunity Detected</h4>
                            <p className="text-sm text-yellow-700">
                                This rep has <strong>{TEAM_DATA.find(r => r.id === selectedRep)?.meetings} meetings</strong> but only <strong>{TEAM_DATA.find(r => r.id === selectedRep)?.proposals} proposals</strong>.
                                Consider reviewing their qualification process or meeting pitch.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded text-center">
                                <span className="block text-2xl font-bold text-gray-900 dark:text-white">12</span>
                                <span className="text-sm text-gray-500">Stalled Leads</span>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded text-center">
                                <span className="block text-2xl font-bold text-gray-900 dark:text-white">5</span>
                                <span className="text-sm text-gray-500">Upcoming Calls</span>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <button onClick={() => setSelectedRep(null)} className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50">Close</button>
                            <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Start Coaching Session</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
