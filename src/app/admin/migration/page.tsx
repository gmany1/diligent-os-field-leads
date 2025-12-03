'use client'; // Rebuild trigger

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { mapRowToEntity, type RawCSVRow, type NormalizedLead } from '@/lib/migration';
import { findDuplicates, mergeLeads, type DuplicateGroup } from '@/lib/deduplication';
import { useSession } from 'next-auth/react';

// Mock CSV Data for demonstration
const MOCK_CSV_DATA: RawCSVRow[] = [
    {
        lead_name: 'Acme Corp',
        address: '123 Industrial Way, Springfield',
        phone: '(555) 123-4567',
        contact_name_number: 'John Manager 555-999-8888',
        industry: 'Manufacturing',
        quote_given: '$15,000 sent last week',
        source_sheet: 'Week 42',
        follow_up_1: '10/01/2024 - Initial call, interested',
        follow_up_2: '10/05/2024 - Sent brochure',
    },
    {
        lead_name: 'Acme Corporation', // Duplicate Name
        address: '123 Industrial Way', // Duplicate Address
        phone: '555-123-4567', // Duplicate Phone
        source_sheet: 'Week 44',
        follow_up_1: '10/10/2024 - Follow up call',
    },
    {
        lead_name: 'Beta LLC',
        address: '789 Tech Park',
        phone: '5550001111',
        industry: 'Technology',
        source_sheet: 'Week 43',
        follow_up_1: 'Left voicemail',
    },
    {
        lead_name: 'Gamma Inc',
        address: '456 Market St',
        industry: 'Retail',
        quote_given: 'Drafting quote',
        source_sheet: 'Week 41',
    }
];

export default function MigrationPage() {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState<'normalize' | 'deduplicate'>('normalize');
    const [previewData, setPreviewData] = useState<NormalizedLead[]>([]);
    const [duplicates, setDuplicates] = useState<DuplicateGroup[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [mergeGroupId, setMergeGroupId] = useState<string | null>(null);
    const [showImportConfirm, setShowImportConfirm] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [importSuccessCount, setImportSuccessCount] = useState(0);

    const handleMerge = (groupId: string) => {
        setMergeGroupId(groupId);
    };

    const confirmMerge = () => {
        if (!mergeGroupId) return;
        const group = duplicates.find(d => d.id === mergeGroupId);
        if (!group) return;

        const mergedLead = mergeLeads(group.leads);

        const newPreviewData = previewData.filter(l => !group.leads.includes(l));
        newPreviewData.push(mergedLead);
        setPreviewData(newPreviewData);

        setDuplicates(duplicates.filter(d => d.id !== mergeGroupId));
        toast.success('Leads merged successfully');
        setMergeGroupId(null);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0]) return;

        const file = e.target.files[0];
        setIsProcessing(true);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/migration/import', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();
            if (data.success) {
                setPreviewData(data.data);
                const dups = findDuplicates(data.data);
                setDuplicates(dups);
                toast.success(`Parsed ${data.data.length} records.`);
            } else {
                toast.error(data.error || 'Failed to parse file');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error uploading file');
        } finally {
            setIsProcessing(false);
            // Reset input
            e.target.value = '';
        }
    };

    const executeImport = async () => {
        console.log('Starting import process...');
        setIsProcessing(true);
        try {
            console.log('Sending fetch request to /api/migration/import');
            console.log('Payload size:', JSON.stringify({ leads: previewData }).length);

            const userId = (session?.user as any)?.id || 'user_field_rep_1';

            const res = await fetch('/api/migration/import', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    leads: previewData,
                    userId: userId
                }),
            });

            console.log('Fetch response received:', res.status, res.statusText);
            const data = await res.json();
            console.log('Response data:', data);

            if (data.success) {
                setImportSuccessCount(data.importedCount);
                setShowSuccessModal(true);
                setPreviewData([]);
                setDuplicates([]);
                setActiveTab('normalize');
                setShowImportConfirm(false);
            } else {
                console.error('Import failed:', data.error);
                toast.error(data.error || 'Failed to import leads');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            toast.error('Error importing leads');
        } finally {
            setIsProcessing(false);
            console.log('Import process finished');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Data Migration Dashboard</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Manage the migration process from Excel to DiligentOS.
                    </p>
                </header>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex space-x-4">
                            <button
                                onClick={() => setActiveTab('normalize')}
                                className={`px-4 py-2 rounded-md font-medium ${activeTab === 'normalize' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                1. Clean & Normalize
                            </button>
                            <button
                                onClick={() => setActiveTab('deduplicate')}
                                className={`px-4 py-2 rounded-md font-medium ${activeTab === 'deduplicate' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                2. Deduplicate ({duplicates.length})
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="file"
                                accept=".xlsx, .xls, .csv"
                                onChange={handleFileUpload}
                                disabled={isProcessing}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900 dark:file:text-indigo-300"
                            />
                        </div>
                    </div>

                    {activeTab === 'normalize' && (
                        <>
                            {previewData.length > 0 ? (
                                <div className="space-y-6">
                                    {previewData.map((lead, idx) => (
                                        <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                            <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between">
                                                <span className="font-medium text-gray-700 dark:text-gray-300">Record #{idx + 1}</span>
                                                <span className="text-xs text-gray-500">Source: {lead.source}</span>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-700">
                                                <div className="p-4 bg-gray-50/50 dark:bg-gray-800/50">
                                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Raw Data (CSV)</h3>
                                                    <pre className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap font-mono">
                                                        {JSON.stringify(lead.originalData, null, 2)}
                                                    </pre>
                                                </div>
                                                <div className="p-4 bg-white dark:bg-gray-800">
                                                    <h3 className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-3">Mapped Entity (System)</h3>
                                                    <div className="space-y-2 text-sm">
                                                        <div><span className="font-medium text-gray-500">Name:</span> {lead.name}</div>
                                                        <div><span className="font-medium text-gray-500">Address:</span> {lead.address || 'N/A'}</div>
                                                        <div><span className="font-medium text-gray-500">Industry:</span> {lead.industry || 'N/A'}</div>
                                                        <div className="mt-2">
                                                            <span className="font-medium text-gray-500">Contacts ({lead.contacts.length}):</span>
                                                            <ul className="list-disc pl-5 mt-1 text-gray-600 dark:text-gray-400">
                                                                {lead.contacts.map((c, i) => (
                                                                    <li key={i}>{c.name}: {c.phone}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                        <div className="mt-2">
                                                            <span className="font-medium text-gray-500">Activities ({lead.activities.length}):</span>
                                                            <ul className="list-disc pl-5 mt-1 text-gray-600 dark:text-gray-400">
                                                                {lead.activities.map((a, i) => (
                                                                    <li key={i}>
                                                                        <span className="text-xs text-gray-400">{new Date(a.date).toLocaleDateString()}</span> - {a.content}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                        {lead.quotes.length > 0 && (
                                                            <div className="mt-2">
                                                                <span className="font-medium text-gray-500">Quotes:</span>
                                                                <div className="mt-1">
                                                                    {lead.quotes.map((q, i) => (
                                                                        <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                                                            ${q.amount.toLocaleString()} ({q.status})
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                    Upload a file to test the mapping logic.
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === 'deduplicate' && (
                        <div className="space-y-6">
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-medium text-blue-800 dark:text-blue-400">Ready to Import?</h3>
                                    <p className="text-sm text-blue-600 dark:text-blue-300">
                                        You have {previewData.length} unique leads ready for production.
                                        {duplicates.length > 0 ? ` Warning: ${duplicates.length} duplicate groups remaining.` : ' No duplicates found.'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowImportConfirm(true)}
                                    className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-500 font-bold shadow-sm"
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? 'Importing...' : 'Import to Production'}
                                </button>
                            </div>

                            {duplicates.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    {previewData.length === 0 ? 'Import data first.' : 'No duplicates found. Ready for import.'}
                                </div>
                            ) : (
                                duplicates.map((group) => (
                                    <div key={group.id} className="border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10 dark:border-yellow-900/30 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-500">Potential Duplicate Group</h3>
                                                <p className="text-sm text-yellow-700 dark:text-yellow-600">
                                                    Confidence: {(group.confidence * 100).toFixed(0)}% • Reasons: {group.reason.join(', ')}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleMerge(group.id)}
                                                className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-500"
                                            >
                                                Merge Group
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {group.leads.map((lead, idx) => (
                                                <div key={idx} className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700 text-sm">
                                                    <div className="font-bold">{lead.name}</div>
                                                    <div className="text-gray-500">{lead.address}</div>
                                                    <div className="text-gray-500">{lead.contacts[0]?.phone}</div>
                                                    <div className="mt-2 text-xs text-gray-400">Source: {lead.source}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Merge Confirmation Modal */}
            {mergeGroupId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Confirm Merge</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Are you sure you want to merge this group? This will combine all activities and contacts into a single lead record.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setMergeGroupId(null)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmMerge}
                                className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-500"
                            >
                                Yes, Merge Group
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Import Authorization Modal */}
            {showImportConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4 border-t-4 border-green-600">
                        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Authorize Import</h3>
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded mb-6">
                            <p className="text-green-800 dark:text-green-300 font-medium">
                                You are about to import {previewData.length} leads to production.
                            </p>
                            <p className="text-green-700 dark:text-green-400 text-sm mt-1">
                                This action will add these records to the live database.
                            </p>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowImportConfirm(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={executeImport}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 font-bold shadow-lg"
                                disabled={isProcessing}
                            >
                                {isProcessing ? 'Processing...' : 'Authorize & Import'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Reset Confirmation Modal */}
            {showResetConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4 border-t-4 border-red-600">
                        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Reset Database?</h3>
                        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded mb-6">
                            <p className="text-red-800 dark:text-red-300 font-bold">
                                Warning: This action is irreversible.
                            </p>
                            <p className="text-red-700 dark:text-red-400 text-sm mt-2">
                                You are about to permanently delete all leads, quotes, and activities from the database.
                            </p>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowResetConfirm(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    try {
                                        const res = await fetch('/api/admin/reset', { method: 'DELETE' });
                                        if (res.ok) {
                                            const data = await res.json();
                                            const counts = data.deletedCounts;
                                            toast.success(`Reset Complete. Deleted: ${counts.leads} Leads, ${counts.quotes} Quotes, ${counts.activities} Activities.`);
                                            setTimeout(() => window.location.reload(), 2000);
                                        } else {
                                            const data = await res.json();
                                            toast.error(data.error || 'Failed to reset database.');
                                        }
                                    } catch (e) {
                                        console.error(e);
                                        toast.error('Error resetting database.');
                                    } finally {
                                        setShowResetConfirm(false);
                                    }
                                }}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-bold shadow-lg"
                            >
                                Yes, Wipe Everything
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Danger Zone */}
            <div className="mt-12 border-t border-red-200 pt-8">
                <h2 className="text-lg font-medium text-red-600">Danger Zone</h2>
                <p className="mt-1 text-sm text-gray-500">
                    Irreversible actions. Proceed with caution.
                </p>
                <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-red-800">Reset Database</h3>
                            <p className="mt-1 text-sm text-red-700">
                                This will permanently delete all leads, quotes, and activities. This action cannot be undone.
                            </p>
                        </div>
                        <button
                            onClick={() => setShowResetConfirm(true)}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            Reset Database
                        </button>
                        {/* Success Modal */}
                        {showSuccessModal && (
                            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4 text-center">
                                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                                        <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Import Successful!</h3>
                                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                                        Successfully imported <span className="font-bold text-gray-900 dark:text-white">{importSuccessCount}</span> leads into the database.
                                    </p>
                                    <div className="flex flex-col gap-3">
                                        <button
                                            onClick={() => {
                                                setShowSuccessModal(false);
                                                window.location.href = '/history';
                                            }}
                                            className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 font-bold shadow-lg"
                                        >
                                            View Historical Leads
                                        </button>
                                        <button
                                            onClick={() => setShowSuccessModal(false)}
                                            className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                                        >
                                            Stay Here
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
