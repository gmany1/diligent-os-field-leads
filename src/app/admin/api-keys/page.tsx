'use client';

import { useQuery } from '@tanstack/react-query';
import { Key, Copy, Trash2, Plus, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function APIKeysPage() {
    const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

    const { data, isLoading } = useQuery({
        queryKey: ['api-keys'],
        queryFn: async () => {
            const res = await fetch('/api/admin/api-keys');
            if (!res.ok) throw new Error('Failed to fetch');
            return res.json();
        }
    });

    const toggleKeyVisibility = (id: string) => {
        setShowKeys(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const copyToClipboard = (key: string) => {
        navigator.clipboard.writeText(key);
        toast.success('API key copied to clipboard');
    };

    if (isLoading) {
        return (
            <div className="p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
            </div>
        );
    }

    const apiKeys = data?.data || [];
    const summary = data?.summary || { total: 0, active: 0 };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">API Keys</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Manage API keys for external integrations
                    </p>
                </div>
                <button
                    onClick={() => toast.info('Create API key functionality coming soon')}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <Plus size={20} className="mr-2" />
                    Create API Key
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Keys</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary.total}</p>
                        </div>
                        <Key className="text-indigo-600" size={32} />
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Active Keys</p>
                            <p className="text-2xl font-bold text-green-600">{summary.active}</p>
                        </div>
                        <Key className="text-green-600" size={32} />
                    </div>
                </div>
            </div>

            {/* API Keys List */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your API Keys</h2>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {apiKeys.length === 0 ? (
                        <div className="p-12 text-center">
                            <Key className="mx-auto text-gray-400 mb-4" size={48} />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                No API keys yet
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Create your first API key to get started with integrations
                            </p>
                        </div>
                    ) : (
                        apiKeys.map((apiKey: any) => (
                            <div key={apiKey.id} className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                {apiKey.name}
                                            </h3>
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${apiKey.status === 'ACTIVE'
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                                }`}>
                                                {apiKey.status}
                                            </span>
                                        </div>

                                        <div className="flex items-center space-x-2 mb-3">
                                            <code className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono text-gray-900 dark:text-white">
                                                {showKeys[apiKey.id] ? apiKey.key : apiKey.key.replace(/./g, '*')}
                                            </code>
                                            <button
                                                onClick={() => toggleKeyVisibility(apiKey.id)}
                                                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                                title={showKeys[apiKey.id] ? 'Hide' : 'Show'}
                                            >
                                                {showKeys[apiKey.id] ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                            <button
                                                onClick={() => copyToClipboard(apiKey.key)}
                                                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                                title="Copy to clipboard"
                                            >
                                                <Copy size={18} />
                                            </button>
                                        </div>

                                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                                            <span>Created: {new Date(apiKey.createdAt).toLocaleDateString()}</span>
                                            <span>Last used: {new Date(apiKey.lastUsed).toLocaleDateString()}</span>
                                            <span>Permissions: {apiKey.permissions.join(', ')}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => toast.warning('Delete functionality coming soon')}
                                        className="ml-4 p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                        title="Delete API key"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Security Notice */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                    Security Best Practices
                </h3>
                <ul className="list-disc list-inside text-yellow-700 dark:text-yellow-300 space-y-1">
                    <li>Never share your API keys publicly</li>
                    <li>Rotate keys regularly for security</li>
                    <li>Use different keys for different environments</li>
                    <li>Revoke unused keys immediately</li>
                </ul>
            </div>
        </div>
    );
}
