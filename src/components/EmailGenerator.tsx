'use client';

import { useState } from 'react';
import { toast } from 'sonner';

interface EmailGeneratorProps {
    lead: any;
    onClose: () => void;
}

export default function EmailGenerator({ lead, onClose }: EmailGeneratorProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedEmail, setGeneratedEmail] = useState<{ subject: string; body: string } | null>(null);

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            const res = await fetch('/api/ai/email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lead }),
            });
            const data = await res.json();
            if (data.success) {
                setGeneratedEmail(data.data);
                toast.success('Email draft generated!');
            } else {
                toast.error('Failed to generate email');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error generating email');
        } finally {
            setIsGenerating(false);
        }
    };

    const copyToClipboard = () => {
        if (!generatedEmail) return;
        const text = `Subject: ${generatedEmail.subject}\n\n${generatedEmail.body}`;
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard');
    };

    const openMailClient = () => {
        if (!generatedEmail || !lead.email) return;
        const subject = encodeURIComponent(generatedEmail.subject);
        const body = encodeURIComponent(generatedEmail.body);
        window.open(`mailto:${lead.email}?subject=${subject}&body=${body}`, '_blank');
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">AI Email Generator</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400">✕</button>
                </div>

                <div className="mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        Drafting email for <span className="font-semibold">{lead.name}</span> ({lead.company})
                    </p>
                </div>

                {!generatedEmail ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">Generate a personalized cold outreach email based on this lead's data.</p>
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2 mx-auto"
                        >
                            {isGenerating ? (
                                <>
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Writing...
                                </>
                            ) : (
                                <>✨ Generate Draft</>
                            )}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Subject</label>
                            <input
                                type="text"
                                value={generatedEmail.subject}
                                readOnly
                                className="w-full rounded-md border-gray-300 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Body</label>
                            <textarea
                                value={generatedEmail.body}
                                readOnly
                                rows={8}
                                className="w-full rounded-md border-gray-300 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm font-mono"
                            />
                        </div>
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={copyToClipboard}
                                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                            >
                                Copy
                            </button>
                            {lead.email && (
                                <button
                                    onClick={openMailClient}
                                    className="px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                                >
                                    Open in Mail
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
