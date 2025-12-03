'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { toast } from 'sonner';

export default function DailyFocusWidget() {
    const { data, isLoading } = useQuery({
        queryKey: ['daily-focus'],
        queryFn: async () => {
            const res = await fetch('/api/dashboard/focus');
            if (!res.ok) throw new Error('Failed');
            return res.json();
        }
    });

    if (isLoading) return <div className="h-48 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />;

    const leads = data?.leads || [];

    return (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="text-orange-500">🔥</span> Today's Focus
                </h3>
                <span className="text-xs text-gray-500">Leads needing attention</span>
            </div>

            {leads.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                    <p>All caught up! No neglected leads found.</p>
                    <Link href="/crm" className="text-indigo-600 hover:underline mt-2 inline-block">
                        Browse all leads
                    </Link>
                </div>
            ) : (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {leads.map((lead: any) => (
                        <li key={lead.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <div>
                                <Link href={`/crm?leadId=${lead.id}`} className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                                    {lead.name}
                                </Link>
                                <div className="text-xs text-gray-500 mt-1 flex gap-2">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium 
                                        ${lead.stage === 'HOT' ? 'bg-orange-100 text-orange-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {lead.stage}
                                    </span>
                                    <span>Last updated: {new Date(lead.updatedAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {lead.phone && (
                                    <a
                                        href={`tel:${lead.phone}`}
                                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
                                        title="Call"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        📞
                                    </a>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
