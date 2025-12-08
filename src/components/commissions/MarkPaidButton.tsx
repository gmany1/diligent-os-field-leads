'use client';

import { useState } from 'react';
import { markCommissionAsPaid } from '@/lib/commission-actions';
import { toast } from 'sonner';
import { Check, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MarkPaidButton({ id, status }: { id: string, status: string }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    if (status === 'PAID') return <span className="text-green-600 flex items-center"><Check size={16} className="mr-1" /> Paid</span>;
    if (status === 'REJECTED') return <span className="text-red-600">Rejected</span>;

    const handleMarkPaid = async () => {
        if (!confirm('Are you sure you want to mark this commission as PAID? This action is irreversible.')) return;

        setLoading(true);
        try {
            await markCommissionAsPaid(id);
            toast.success('Commission marked as PAID');
            router.refresh(); // Refresh server data
        } catch (error) {
            toast.error('Failed to mark as paid');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleMarkPaid}
            disabled={loading}
            className="flex items-center px-3 py-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50 rounded-full text-xs font-medium transition-colors"
        >
            {loading ? <Loader2 size={14} className="animate-spin mr-1" /> : <Check size={14} className="mr-1" />}
            Mark Paid
        </button>
    );
}
