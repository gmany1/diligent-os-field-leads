'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Book, Plus, Edit2, Trash2, Save, X, FileText, Server } from 'lucide-react';

type Doc = {
    id: string;
    title: string;
    category: string;
    content: string;
};

async function fetchDocs() {
    const res = await fetch('/api/support/docs');
    if (!res.ok) throw new Error('Failed to fetch docs');
    return res.json();
}

export default function DocumentationPage() {
    const queryClient = useQueryClient();
    const { data, isLoading } = useQuery({ queryKey: ['docs'], queryFn: fetchDocs });

    const [isEditing, setIsEditing] = useState(false);
    const [currentDoc, setCurrentDoc] = useState<Partial<Doc>>({});

    const createMutation = useMutation({
        mutationFn: async (newDoc: Partial<Doc>) => {
            await fetch('/api/support/docs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newDoc)
            });
        },
        onSuccess: () => {
            setIsEditing(false);
            setCurrentDoc({});
            queryClient.invalidateQueries({ queryKey: ['docs'] });
        }
    });

    const updateMutation = useMutation({
        mutationFn: async (doc: Partial<Doc>) => {
            await fetch('/api/support/docs', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(doc)
            });
        },
        onSuccess: () => {
            setIsEditing(false);
            setCurrentDoc({});
            queryClient.invalidateQueries({ queryKey: ['docs'] });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await fetch(`/api/support/docs?id=${id}`, { method: 'DELETE' });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['docs'] })
    });

    const handleSubmit = () => {
        if (currentDoc.id) {
            updateMutation.mutate(currentDoc);
        } else {
            createMutation.mutate(currentDoc);
        }
    };

    if (isLoading) return <div className="p-8">Loading documentation...</div>;

    const docs = data?.data || [];

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                    <Book className="mr-3 text-indigo-600" /> System Documentation
                </h1>
                <button
                    onClick={() => { setCurrentDoc({}); setIsEditing(true); }}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center shadow"
                >
                    <Plus size={18} className="mr-2" /> New Article
                </button>
            </div>

            {isEditing && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-indigo-200 dark:border-indigo-900 mb-6 animate-fade-in-down">
                    <h3 className="text-lg font-bold mb-4">{currentDoc.id ? 'Edit Article' : 'Create New Article'}</h3>
                    <div className="space-y-4">
                        <input
                            placeholder="Article Title"
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                            value={currentDoc.title || ''}
                            onChange={e => setCurrentDoc({ ...currentDoc, title: e.target.value })}
                        />
                        <input
                            placeholder="Category (e.g., CRM, Finance)"
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                            value={currentDoc.category || ''}
                            onChange={e => setCurrentDoc({ ...currentDoc, category: e.target.value })}
                        />
                        <textarea
                            placeholder="Content (Markdown supported)..."
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 h-32"
                            value={currentDoc.content || ''}
                            onChange={e => setCurrentDoc({ ...currentDoc, content: e.target.value })}
                        />
                        <div className="flex justify-end space-x-3">
                            <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                            <button onClick={handleSubmit} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center">
                                <Save size={18} className="mr-2" /> Save Article
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {docs.map((doc: Doc) => (
                    <div key={doc.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow relative group">
                        <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => { setCurrentDoc(doc); setIsEditing(true); }} className="p-1.5 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100"><Edit2 size={14} /></button>
                            <button onClick={() => { if (confirm('Delete?')) deleteMutation.mutate(doc.id); }} className="p-1.5 bg-red-50 text-red-600 rounded-full hover:bg-red-100"><Trash2 size={14} /></button>
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center">
                            <FileText size={18} className="mr-2 text-gray-400" /> {doc.title}
                        </h3>
                        <span className="inline-block mt-2 px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                            {doc.category}
                        </span>
                        <p className="mt-4 text-sm text-gray-500 line-clamp-3">
                            {doc.content}
                        </p>
                    </div>
                ))}
                {docs.length === 0 && (
                    <div className="col-span-3 text-center py-12 text-gray-400">
                        No documentation found. Create your first article.
                    </div>
                )}
            </div>

            <div className="fixed bottom-6 right-6 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 flex items-center space-x-3 z-50">
                <div className="relative">
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <Server size={20} className="text-gray-600 dark:text-gray-300" />
                </div>
                <div className="text-xs">
                    <p className="font-bold text-gray-900 dark:text-white">API Connected</p>
                    <p className="text-gray-500 dark:text-gray-400">Source: /api/support/docs</p>
                </div>
            </div>
        </div>
    );
}
