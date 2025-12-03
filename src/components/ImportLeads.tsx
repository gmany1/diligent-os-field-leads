'use client';

import { useState } from 'react';

export default function ImportLeads({ onImportSuccess }: { onImportSuccess: () => void }) {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setMessage(null);
        }
    };

    const handleImport = async () => {
        if (!file) return;

        setUploading(true);
        setMessage(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/leads/import', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: `Successfully imported ${data.count} leads!` });
                setFile(null);
                // Reset file input
                const fileInput = document.getElementById('file-upload') as HTMLInputElement;
                if (fileInput) fileInput.value = '';

                onImportSuccess();
            } else {
                setMessage({ type: 'error', text: data.error || 'Import failed' });
            }
        } catch (error) {
            console.error('Import error:', error);
            setMessage({ type: 'error', text: 'An unexpected error occurred' });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Import Leads from Excel</h3>

            <div className="flex items-end gap-4">
                <div className="flex-1">
                    <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Select File (.xlsx, .csv)
                    </label>
                    <input
                        id="file-upload"
                        type="file"
                        accept=".xlsx, .xls, .csv"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900 dark:file:text-indigo-300"
                    />
                </div>

                <button
                    onClick={handleImport}
                    disabled={!file || uploading}
                    className={`px-4 py-2 rounded-md text-sm font-semibold text-white shadow-sm ${!file || uploading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600'
                        }`}
                >
                    {uploading ? 'Importing...' : 'Import Leads'}
                </button>
            </div>

            {message && (
                <div className={`mt-3 text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                    {message.text}
                </div>
            )}

            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Supported columns: Name, Company, Email, Phone. Other columns will be added to notes.
            </p>
        </div>
    );
}
