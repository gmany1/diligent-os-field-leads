'use client';

import { useQuery } from '@tanstack/react-query';

interface Activity {
    id: string;
    leadId: string;
    userId: string;
    type: string;
    content: string;
    createdAt: string;
}

const fetchActivities = async () => {
    const res = await fetch('/api/activities');
    if (!res.ok) throw new Error('Failed to fetch activities');
    return res.json();
};

export default function RecentActivityFeed() {
    const { data: activities = [], isLoading } = useQuery({
        queryKey: ['activities'],
        queryFn: fetchActivities,
        refetchInterval: 30000, // Refresh every 30s
    });

    if (isLoading) return <div className="p-4 text-gray-500 text-sm">Loading activity...</div>;

    return (
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg mb-8">
            <div className="p-5 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    Recent Activity
                </h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
                {activities.length === 0 ? (
                    <div className="p-5 text-center text-gray-500 text-sm">
                        No recent activity found.
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {activities.map((activity: Activity) => (
                            <li key={activity.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <div className="flex space-x-3">
                                    <div className="flex-shrink-0">
                                        <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold
                                            ${activity.type === 'NOTE' ? 'bg-gray-400' :
                                                activity.type === 'CALL' ? 'bg-green-500' :
                                                    activity.type === 'EMAIL' ? 'bg-blue-500' :
                                                        activity.type === 'MEETING' ? 'bg-purple-500' :
                                                            'bg-indigo-500'}`}>
                                            {activity.type.charAt(0)}
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                                                {activity.type}
                                            </h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {new Date(activity.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                                            {activity.content}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
