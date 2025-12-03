'use client';

import { useState } from 'react';

interface Lead {
    id: string;
    name: string;
    stage: string;
    createdAt: string;
    lastContactedAt?: string;
}

interface KanbanBoardProps {
    leads: Lead[];
    onUpdateStage: (id: string, stage: string) => void;
}

const STAGES = ['COLD', 'WARM', 'HOT', 'QUOTE', 'WON', 'LOST'];

export default function KanbanBoard({ leads, onUpdateStage }: KanbanBoardProps) {
    const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
    const [mobileMenuOpenId, setMobileMenuOpenId] = useState<string | null>(null);

    // AI State
    const [scores, setScores] = useState<Record<string, { score: number, reason: string }>>({});
    const [loadingScore, setLoadingScore] = useState<string | null>(null);
    const [generatedEmail, setGeneratedEmail] = useState<{ subject: string, body: string } | null>(null);
    const [emailModalOpen, setEmailModalOpen] = useState(false);
    const [loadingEmail, setLoadingEmail] = useState<string | null>(null);

    const handleDragStart = (e: React.DragEvent, leadId: string) => {
        e.dataTransfer.setData('leadId', leadId);
        setDraggedLeadId(leadId);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, stage: string) => {
        e.preventDefault();
        const leadId = e.dataTransfer.getData('leadId');
        if (leadId) {
            onUpdateStage(leadId, stage);
        }
        setDraggedLeadId(null);
    };

    const handleCalculateScore = async (lead: Lead) => {
        setLoadingScore(lead.id);
        try {
            const res = await fetch('/api/ai/score', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lead })
            });
            const data = await res.json();
            if (data.success) {
                setScores(prev => ({ ...prev, [lead.id]: data.data }));
            }
        } catch (error) {
            console.error('Error calculating score:', error);
        } finally {
            setLoadingScore(null);
        }
    };

    const handleGenerateEmail = async (lead: Lead) => {
        setLoadingEmail(lead.id);
        try {
            const res = await fetch('/api/ai/email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lead })
            });
            const data = await res.json();
            if (data.success) {
                setGeneratedEmail(data.data);
                setEmailModalOpen(true);
            }
        } catch (error) {
            console.error('Error generating email:', error);
        } finally {
            setLoadingEmail(null);
        }
    };

    const getStageColor = (stage: string) => {
        switch (stage) {
            case 'COLD': return 'bg-blue-50 border-blue-200 text-blue-700';
            case 'WARM': return 'bg-yellow-50 border-yellow-200 text-yellow-700';
            case 'HOT': return 'bg-orange-50 border-orange-200 text-orange-700';
            case 'QUOTE': return 'bg-purple-50 border-purple-200 text-purple-700';
            case 'WON': return 'bg-green-50 border-green-200 text-green-700';
            case 'LOST': return 'bg-gray-50 border-gray-200 text-gray-700';
            default: return 'bg-white border-gray-200';
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'bg-green-100 text-green-800';
        if (score >= 50) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    return (
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
            {STAGES.map((stage) => (
                <div
                    key={stage}
                    className={`min-w-[280px] flex-1 rounded-lg border-2 border-dashed ${draggedLeadId ? 'border-indigo-300 bg-indigo-50/30' : 'border-gray-200 bg-gray-50/50'
                        } p-4 dark:border-gray-700 dark:bg-gray-800/50 snap-center`}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, stage)}
                >
                    <h3 className={`font-bold mb-4 px-2 py-1 rounded text-sm inline-block ${getStageColor(stage)}`}>
                        {stage} ({leads.filter(l => l.stage === stage).length})
                    </h3>

                    <div className="space-y-3">
                        {leads
                            .filter((lead) => lead.stage === stage)
                            .map((lead) => (
                                <div
                                    key={lead.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, lead.id)}
                                    className="bg-white dark:bg-gray-800 p-3 rounded shadow-sm border border-gray-200 dark:border-gray-700 cursor-move hover:shadow-md transition-shadow relative group"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900 dark:text-white">{lead.name}</div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {new Date(lead.createdAt).toLocaleDateString()}
                                            </div>

                                            {/* AI Score Badge */}
                                            <div className="mt-2 flex items-center gap-2">
                                                {scores[lead.id] ? (
                                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getScoreColor(scores[lead.id].score)}`} title={scores[lead.id].reason}>
                                                        Score: {scores[lead.id].score}
                                                    </span>
                                                ) : (
                                                    <button
                                                        onClick={() => handleCalculateScore(lead)}
                                                        disabled={loadingScore === lead.id}
                                                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full transition-colors disabled:opacity-50"
                                                    >
                                                        {loadingScore === lead.id ? '...' : 'Get Score'}
                                                    </button>
                                                )}
                                            </div>

                                            {/* AI Email Button */}
                                            <div className="mt-2">
                                                <button
                                                    onClick={() => handleGenerateEmail(lead)}
                                                    disabled={loadingEmail === lead.id}
                                                    className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
                                                >
                                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                    {loadingEmail === lead.id ? 'Drafting...' : 'Draft Email'}
                                                </button>
                                            </div>

                                        </div>
                                        {/* Mobile Move Button */}
                                        <button
                                            onClick={() => setMobileMenuOpenId(lead.id)}
                                            className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            ))}

            {/* Email Modal */}
            {emailModalOpen && generatedEmail && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">AI Drafted Email</h3>
                            <button onClick={() => setEmailModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label>
                                <input
                                    type="text"
                                    readOnly
                                    value={generatedEmail.subject}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50 dark:bg-gray-700 dark:border-gray-600 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Body</label>
                                <textarea
                                    rows={8}
                                    readOnly
                                    value={generatedEmail.body}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50 dark:bg-gray-700 dark:border-gray-600 sm:text-sm font-mono"
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(`${generatedEmail.subject}\n\n${generatedEmail.body}`);
                                        alert('Copied to clipboard!');
                                    }}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
                                >
                                    Copy to Clipboard
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Move Modal */}
            {mobileMenuOpenId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-sm overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Move Lead</h3>
                            <button onClick={() => setMobileMenuOpenId(null)} className="text-gray-500 hover:text-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-2 space-y-1">
                            {STAGES.map((stage) => (
                                <button
                                    key={stage}
                                    onClick={() => {
                                        const lead = leads.find(l => l.id === mobileMenuOpenId);
                                        if (lead && lead.stage !== stage) {
                                            onUpdateStage(mobileMenuOpenId, stage);
                                        }
                                        setMobileMenuOpenId(null);
                                    }}
                                    className={`w-full text-left px-4 py-3 rounded-md font-medium transition-colors ${leads.find(l => l.id === mobileMenuOpenId)?.stage === stage
                                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300'
                                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    {stage}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
