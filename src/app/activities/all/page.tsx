'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export default function AllActivitiesPage() {
    const router = useRouter();

    // We reuse the /api/activities endpoint but need to support fetching ALL vs by leadId.
    // Assuming /api/activities returns all if no leadId provided.
    const { data: activities = [], isLoading } = useQuery({
        queryKey: ['all-activities'],
        queryFn: async () => {
            const res = await fetch('/api/activities');
            if (!res.ok) throw new Error('Failed to fetch activities');
            return res.json();
        }
    });

    if (isLoading) return <div className="p-8">Loading Activities...</div>;

    return (
        <div className="p-8 space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Activities</h1>

            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Notes</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {activities.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">No activities found.</td>
                            </tr>
                        ) : (
                            activities.map((activity: any) => (
                                <tr key={activity.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${activity.type === 'CALL' ? 'bg-green-100 text-green-800' :
                                                activity.type === 'EMAIL' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-gray-100 text-gray-800'}`}>
                                            {activity.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900 dark:text-white truncate max-w-xs">{activity.notes}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(activity.createdAt).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <button
                                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                            onClick={() => router.push(`/leads/${activity.leadId}`)} // Navigate to context
                                        >
                                            View Lead
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
