'use client';

import { useRouter } from 'next/navigation';
import LeadList from '@/components/LeadList';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export default function AllLeadsPage() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const handleLeadClick = (id: string) => {
        router.push(`/leads/${id}`);
    };

    const handleQuoteClick = (id: string) => {
        router.push(`/quotes/create?leadId=${id}`);
    };

    const handleEmailClick = (id: string) => {
        toast.info('Email feature coming soon');
    };

    const handleCallClick = (id: string) => {
        toast.info('Call feature coming soon');
    };

    const handleDeleteClick = async (id: string) => {
        if (!confirm('Are you sure you want to delete this lead?')) return;

        try {
            const res = await fetch(`/api/leads/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete');

            toast.success('Lead deleted');
            queryClient.invalidateQueries({ queryKey: ['leads'] });
        } catch (error) {
            toast.error('Failed to delete lead');
            console.error(error);
        }
    };

    const handleStatusChange = async (id: string, status: string) => {
        // Implementation pending API support for update
        toast.info(`Status change to ${status} pending implementation`);
    };

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Leads</h1>
                    <p className="text-sm text-gray-500">Manage and track all leads in the system</p>
                </div>
                <button
                    onClick={() => router.push('/leads/create')}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition shadow-sm font-medium text-sm"
                >
                    + Create Lead
                </button>
            </div>

            <LeadList
                onLeadClick={handleLeadClick}
                onQuoteClick={handleQuoteClick}
                onEmailClick={handleEmailClick}
                onCallClick={handleCallClick}
                onDeleteClick={handleDeleteClick}
                onStatusChange={handleStatusChange}
                branchFilter="ALL"
            />
        </div>
    );
}
