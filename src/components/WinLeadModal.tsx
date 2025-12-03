'use client';

import { useState } from 'react';
import { toast } from 'sonner';

interface WinLeadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (vacancies: number, note: string) => void;
    leadName: string;
}

export default function WinLeadModal({ isOpen, onClose, onConfirm, leadName }: WinLeadModalProps) {
    const [vacancies, setVacancies] = useState<number>(1);
    const [note, setNote] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (vacancies < 1) {
            toast.error('Please enter at least 1 vacancy');
            return;
        }
        onConfirm(vacancies, note);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all scale-100 animate-in zoom-in-95 duration-200 border border-gray-200 dark:border-gray-700">

                {/* Header with Celebration Vibe */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/20 mb-4 backdrop-blur-md">
                        <span className="text-3xl">🎉</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">Deal Won!</h3>
                    <p className="text-indigo-100 mt-1">Great job closing {leadName}!</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label htmlFor="vacancies" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            How many vacancies are associated with this contract?
                        </label>
                        <div className="relative rounded-md shadow-sm">
                            <input
                                type="number"
                                id="vacancies"
                                min="1"
                                value={vacancies}
                                onChange={(e) => setVacancies(parseInt(e.target.value) || 0)}
                                className="block w-full rounded-lg border-0 py-3 pl-4 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6 dark:bg-gray-900 dark:ring-gray-700 dark:text-white"
                                placeholder="e.g. 3"
                                autoFocus
                            />
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <span className="text-gray-500 sm:text-sm">roles</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="note" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Any specific requirements? (Optional)
                        </label>
                        <textarea
                            id="note"
                            rows={3}
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="block w-full rounded-lg border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 dark:ring-gray-700 dark:text-white"
                            placeholder="e.g. Senior Java Developers needed asap..."
                        />
                    </div>

                    <div className="flex gap-3 mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:text-gray-300 dark:ring-gray-600 dark:hover:bg-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all hover:scale-[1.02]"
                        >
                            Confirm & Celebrate 🚀
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
