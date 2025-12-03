'use client';

import { useState } from 'react';
import { toast } from 'sonner';

interface CallLoggerProps {
    lead: any;
    onClose: () => void;
    onLog: (leadId: string, note: string) => void;
}

export default function CallLogger({ lead, onClose, onLog }: CallLoggerProps) {
    const [note, setNote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!note.trim()) {
            toast.error('Please enter call notes');
            return;
        }
        setIsSubmitting(true);
        try {
            // Simulate API call or use the passed handler
            // In a real app, this would post to /api/activities
            await new Promise(resolve => setTimeout(resolve, 500));
            onLog(lead.id, `Call Log: ${note}`);
            toast.success('Call logged successfully');
            onClose();
        } catch (error) {
            toast.error('Failed to log call');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Log Call</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400">✕</button>
                </div>

                <div className="mb-4">
                    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded mb-4">
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{lead.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{lead.phone || 'No Phone'}</p>
                        </div>
                        {lead.phone && (
                            <a
                                href={`tel:${lead.phone}`}
                                className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold hover:bg-green-200"
                            >
                                📞 Call Now
                            </a>
                        )}
                    </div>

                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Call Notes
                    </label>
                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Outcome of the call..."
                        rows={4}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Saving...' : 'Save Log'}
                    </button>
                </div>
            </div>
        </div>
    );
}
