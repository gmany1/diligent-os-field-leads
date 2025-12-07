'use client';

import { useQuery } from '@tanstack/react-query';
import { FileWarning, CheckCircle, Clock, Server } from 'lucide-react';

async function fetchData() {
    const res = await fetch('/api/compliance/ccpa');
    if (!res.ok) throw new Error('Failed to fetch data');
    const json = await res.json();
    return json;
}

export default function CcpaPage() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['ccpa-requests'],
        queryFn: fetchData,
    });

    if (isLoading) return <div className="p-8">Loading requests...</div>;
    if (error) return <div className="p-8 text-red-500">Error loading data.</div>;

    return (
        <div className="p-6 md:p-8 space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                CCPA / GDPR Requests
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data?.data?.map((req: any) => (
                    <div key={req.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-blue-500">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{req.type}</h3>
                                <p className="text-sm text-gray-500">ID: {req.id}</p>
                            </div>
                            {req.status === 'Completed' ? <CheckCircle className="text-green-500" /> : <Clock className="text-yellow-500" />}
                        </div>
                        <div className="space-y-2 text-sm">
                            <p><span className="font-semibold">Requester:</span> {req.requester}</p>
                            <p><span className="font-semibold">Submitted:</span> {req.submitted}</p>
                            <p><span className="font-semibold text-red-600">Due By:</span> {req.due}</p>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${req.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {req.status}
                            </span>
                        </div>
                    </div>
                ))}
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
                    <p className="text-gray-500 dark:text-gray-400">Source: /api/compliance/ccpa</p>
                </div>
            </div>
        </div>
    );
}
