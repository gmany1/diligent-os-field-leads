'use client';

import { useState } from 'react';
import { updateCommissionStatus } from '@/lib/commission-actions'; // Updated import
import { toast } from 'sonner';
import { Check, Loader2, MoreHorizontal, X, FileCheck, Banknote } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CommissionActionMenu({ id, status }: { id: string, status: string }) {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const handleUpdate = async (newStatus: string) => {
        if (!confirm(`Mark this commission as ${newStatus}?`)) return;

        setLoading(true);
        setOpen(false);
        try {
            const res = await updateCommissionStatus(id, newStatus);
            if (res.success) {
                toast.success(`Updated to ${newStatus}`);
                router.refresh();
            } else {
                toast.error(res.error || 'Failed to update');
            }
        } catch (error) {
            toast.error('Failed to update status');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (status === 'PAID') {
        return <span className="text-green-600 flex items-center text-xs font-bold border border-green-200 bg-green-50 px-2 py-1 rounded-full"><Check size={14} className="mr-1" /> PAID</span>;
    }

    return (
        <div className="relative">
            {loading ? (
                <Loader2 size={16} className="animate-spin text-gray-500" />
            ) : (
                <div className="flex items-center space-x-2">
                    {/* Quick Actions based on current status */}
                    {status === 'PENDING' && (
                        <button
                            onClick={() => handleUpdate('APPROVED')}
                            className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1 rounded text-xs font-medium flex items-center transition-colors"
                        >
                            <FileCheck size={14} className="mr-1" /> Approve
                        </button>
                    )}

                    {(status === 'APPROVED' || status === 'PROCESSING') && (
                        <button
                            onClick={() => handleUpdate('PAID')}
                            className="bg-green-50 text-green-700 hover:bg-green-100 px-3 py-1 rounded text-xs font-medium flex items-center transition-colors"
                        >
                            <Banknote size={14} className="mr-1" /> Pay
                        </button>
                    )}

                    {/* More Actions Dropdown Trigger (Simplified for this demo, just distinct buttons if preferred, but a simple toggle for 'Dispute' etc is good) */}
                    <div className="relative">
                        <button onClick={() => setOpen(!open)} className="p-1 hover:bg-gray-100 rounded text-gray-500">
                            <MoreHorizontal size={16} />
                        </button>

                        {/* Dropdown Menu */}
                        {open && (
                            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-50 p-1">
                                <button onClick={() => handleUpdate('PENDING')} className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-200">
                                    Reset to Pending
                                </button>
                                <button onClick={() => handleUpdate('PROCESSING')} className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-200">
                                    Mark Processing
                                </button>
                                <button onClick={() => handleUpdate('DISPUTED')} className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 rounded text-orange-600">
                                    Dispute / Hold
                                </button>
                                <button onClick={() => handleUpdate('REJECTED')} className="w-full text-left px-3 py-2 text-xs hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-red-600">
                                    Reject
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Backdrop to close */}
            {open && (
                <div className="fixed inset-0 z-40" onClick={() => setOpen(false)}></div>
            )}
        </div>
    );
}
