'use client';

import { useState } from 'react';
import { toast } from 'sonner';

export default function AIArchitectWidget() {
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<any[]>([]);

    const generateSuggestions = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/ai/architect', { method: 'POST' });
            if (!res.ok) throw new Error('Failed');
            const data = await res.json();
            setSuggestions(data.suggestions || []);
            toast.success('AI Analysis Complete');
        } catch (e) {
            toast.error('Failed to analyze system');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="text-purple-500">✨</span> AI System Architect
                </h3>
                <button
                    onClick={generateSuggestions}
                    disabled={loading}
                    className="text-sm bg-purple-50 text-purple-700 px-3 py-1 rounded hover:bg-purple-100 disabled:opacity-50"
                >
                    {loading ? 'Analyzing...' : 'Analyze & Improve'}
                </button>
            </div>

            {suggestions.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                    Click analyze to let AI review your system and suggest improvements.
                </p>
            ) : (
                <ul className="space-y-3">
                    {suggestions.map((s, idx) => (
                        <li key={idx} className="border border-gray-100 dark:border-gray-700 rounded p-3 bg-gray-50 dark:bg-gray-700/30">
                            <div className="flex justify-between items-start">
                                <span className="font-medium text-gray-900 dark:text-white text-sm">{s.title}</span>
                                <span className={`text-xs px-2 py-0.5 rounded font-medium
                                    ${s.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                                        s.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-blue-100 text-blue-800'}`}>
                                    {s.priority}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{s.description}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
