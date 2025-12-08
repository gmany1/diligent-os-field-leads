'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Phone, Mail, MapPin, Calendar, Edit, Trash2, MessageSquare, DollarSign, Brain } from 'lucide-react';
import { toast } from 'sonner';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function LeadDetailPage() {
    const params = useParams();
    const router = useRouter();
    const leadId = params.id as string;

    const { data: lead, isLoading, error } = useQuery({
        queryKey: ['lead', leadId],
        queryFn: async () => {
            const res = await fetch(`/api/leads/${leadId}`);
            if (!res.ok) {
                if (res.status === 404) throw new Error('Lead not found');
                throw new Error('Failed to fetch lead');
            }
            return res.json();
        }
    });

    if (isLoading) {
        return (
            <div className="p-8 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error || !lead) {
        return (
            <div className="p-8 text-center text-red-500">
                <h2 className="text-xl font-bold">Error loading lead</h2>
                <p>{error?.message || 'Lead not found'}</p>
                <button onClick={() => router.back()} className="mt-4 text-indigo-600 hover:underline">
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                    <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        {lead.name}
                        <span className={`text-sm px-2.5 py-0.5 rounded-full border ${lead.stage === 'WON' ? 'bg-green-100 text-green-800 border-green-200' :
                                lead.stage === 'HOT' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                                    'bg-gray-100 text-gray-800 border-gray-200'
                            }`}>
                            {lead.stage}
                        </span>
                    </h1>
                    <p className="text-sm text-gray-500">{lead.companyName || 'No Company'} • {lead.industry || 'Unknown Industry'}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Contact & Info */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Details</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                <Phone size={18} />
                                <span>{lead.phone || 'No phone'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                <Mail size={18} />
                                <a href={`mailto:${lead.email}`} className="text-indigo-600 hover:underline">{lead.email || 'No email'}</a>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                <MapPin size={18} />
                                <span>{lead.address || 'No address'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Details</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Source</span>
                                <span className="font-medium text-gray-900 dark:text-white">{lead.source}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Created</span>
                                <span className="font-medium text-gray-900 dark:text-white">{new Date(lead.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Owner</span>
                                <span className="font-medium text-gray-900 dark:text-white">{lead.assignedTo?.name || 'Unassigned'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Branch</span>
                                <span className="font-medium text-gray-900 dark:text-white">{lead.branch?.name || 'Global'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Middle Column: Activity & Timeline */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Quick Actions */}
                    <div className="flex gap-3 overflow-x-auto pb-2">
                        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 shadow-sm whitespace-nowrap">
                            <MessageSquare size={16} /> Log Activity
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm whitespace-nowrap">
                            <DollarSign size={16} /> Create Quote
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm whitespace-nowrap">
                            <Brain size={16} /> AI Insight
                        </button>
                    </div>

                    {/* Timeline */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Activity Timeline</h3>

                        <div className="relative border-l border-gray-200 dark:border-gray-700 ml-3 space-y-8">
                            {lead.activities?.map((activity: any) => (
                                <div key={activity.id} className="relative pl-8">
                                    <span className={`absolute top-0 left-[-5px] w-2.5 h-2.5 rounded-full ring-4 ring-white dark:ring-gray-800 ${activity.type === 'CALL' ? 'bg-blue-500' :
                                            activity.type === 'EMAIL' ? 'bg-purple-500' :
                                                activity.type === 'MEETING' ? 'bg-green-500' : 'bg-gray-400'
                                        }`}></span>
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {activity.type} - <span className="font-normal text-gray-500">{activity.description}</span>
                                            </p>
                                        </div>
                                        <span className="text-xs text-gray-500 whitespace-nowrap">
                                            {new Date(activity.date).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {(!lead.activities || lead.activities.length === 0) && (
                                <p className="text-sm text-gray-500 italic pl-8">No activities recorded yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
