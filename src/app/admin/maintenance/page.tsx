'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertOctagon, Power, Calendar, Save, Server } from 'lucide-react';
import { useState } from 'react';

async function fetchData() {
    const res = await fetch('/api/system/maintenance');
    if (!res.ok) throw new Error('Failed to fetch data');
    const json = await res.json();
    return json;
}

export default function MaintenancePage() {
    const queryClient = useQueryClient();
    const { data, isLoading } = useQuery({ queryKey: ['maintenance'], queryFn: fetchData });

    // Local state to handle form if needed, for simplicity we just toggle
    const status = data?.data || { active: false, message: '' };

    const mutation = useMutation({
        mutationFn: async (newState: any) => {
            await fetch('/api/system/maintenance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newState)
            });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['maintenance'] })
    });

    if (isLoading) return <div className="p-8">Loading configuration...</div>;

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                    <AlertOctagon className="mr-3 text-red-600" /> Maintenance Mode
                </h1>
            </div>

            <div className={`rounded-xl shadow-sm p-8 border-2 transition-colors ${status.active ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' : 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'}`}>
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            System is {status.active ? 'Under Maintenance' : 'Operational'}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            {status.active ? 'Users will see the maintenance page and cannot log in.' : 'System is fully accessible to all users.'}
                        </p>
                    </div>
                    <button
                        onClick={() => mutation.mutate({ active: !status.active })}
                        className={`px-6 py-3 rounded-lg font-bold text-white shadow transition-transform transform active:scale-95 ${status.active ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                    >
                        {status.active ? 'Deactivate Maintenance' : 'Activate Maintenance'}
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold mb-4">Configuration</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Display Message</label>
                        <input
                            className="w-full border-gray-300 dark:border-gray-600 rounded-lg p-2 dark:bg-gray-700"
                            defaultValue={status.message}
                            placeholder="Reason for maintenance..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Scheduled Window</label>
                        <div className="flex items-center text-gray-500">
                            <Calendar className="mr-2" size={20} />
                            <span>No scheduled maintenance pending.</span>
                        </div>
                    </div>
                    <div className="pt-4 flex justify-end">
                        <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                            <Save className="mr-2" size={18} /> Save Settings
                        </button>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-6 right-6 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 flex items-center space-x-3 z-50">
                <div className="relative">
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <Server size={20} className="text-gray-600 dark:text-gray-300" />
                </div>
                <div className="text-xs">
                    <p className="font-bold text-gray-900 dark:text-white">API Connected</p>
                    <p className="text-gray-500 dark:text-gray-400">Source: /api/system/maintenance</p>
                </div>
            </div>
        </div>
    );
}
