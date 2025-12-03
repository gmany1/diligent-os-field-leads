'use client';

import { useQuery } from '@tanstack/react-query';

const fetchInsights = async () => {
    const res = await fetch('/api/ai/analyze');
    if (!res.ok) throw new Error('Failed to fetch insights');
    return res.json();
};

import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// ... existing imports ...

export default function AIInsights() {
    const router = useRouter();
    // ... existing query ...
    const { data, isLoading, isError } = useQuery({
        queryKey: ['ai-insights'],
        queryFn: fetchInsights,
        retry: 1
    });

    if (isLoading) return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8 animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
        </div>
    );

    if (isError) return (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8 text-red-800 dark:text-red-200">
            <h3 className="font-bold">AI Insights Unavailable</h3>
            <p className="text-sm">Could not load strategic insights at this time.</p>
        </div>
    );

    const insights = data?.insights || [];

    const handleAction = (action: string, actionUrl?: string) => {
        if (actionUrl) {
            toast.success(`Navigating to: ${action}`);
            // Force full reload to ensure state updates correctly without complex routing hooks
            window.location.href = actionUrl;
        } else {
            toast.info(`Action: ${action}`, {
                description: "This action does not have a direct link yet."
            });
        }
    };

    return (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-6 text-white mb-8">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Strategic AI Insights
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {insights.map((insight: any, idx: number) => (
                    <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                        <div className="flex items-center gap-2 mb-2">
                            {insight.type === 'critical' && <span className="w-2 h-2 rounded-full bg-red-400"></span>}
                            {insight.type === 'warning' && <span className="w-2 h-2 rounded-full bg-yellow-400"></span>}
                            {insight.type === 'success' && <span className="w-2 h-2 rounded-full bg-green-400"></span>}
                            <h3 className="font-semibold text-sm">{insight.title}</h3>
                        </div>
                        <p className="text-sm text-white/90 mb-3">{insight.message}</p>
                        <button
                            onClick={() => handleAction(insight.action, insight.actionUrl)}
                            className="text-xs font-medium underline hover:text-white/80"
                        >
                            {insight.action} &rarr;
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
