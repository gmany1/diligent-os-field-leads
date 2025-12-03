'use client';

import { useState, useEffect } from 'react';

interface Activity {
    id: string;
    type: 'CALL' | 'EMAIL' | 'MEETING' | 'NOTE';
    notes: string;
    createdAt: string;
}

export default function ActivityTimeline({ leadId }: { leadId: string }) {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [newNote, setNewNote] = useState('');
    const [type, setType] = useState<'CALL' | 'EMAIL' | 'MEETING' | 'NOTE'>('NOTE');

    const fetchActivities = async () => {
        try {
            const res = await fetch(`/api/activities?leadId=${leadId}`);
            if (res.ok) {
                const data = await res.json();
                setActivities(data);
            }
        } catch (error) {
            console.error('Error fetching activities:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivities();
    }, [leadId]);

    const handleAddActivity = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newNote.trim()) return;

        try {
            const res = await fetch('/api/activities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    leadId,
                    type,
                    notes: newNote
                }),
            });

            if (res.ok) {
                setNewNote('');
                fetchActivities(); // Refresh list
            }
        } catch (error) {
            console.error('Error adding activity:', error);
        }
    };

    if (loading) return <div className="text-sm text-gray-500">Loading history...</div>;

    return (
        <div className="mt-6 border-t pt-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Activity Timeline</h4>

            {/* Add Activity Form */}
            <form onSubmit={handleAddActivity} className="mb-6 bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                <div className="flex gap-2 mb-2">
                    {(['NOTE', 'CALL', 'EMAIL', 'MEETING'] as const).map((t) => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => setType(t)}
                            className={`text-xs px-2 py-1 rounded border ${type === t
                                    ? 'bg-indigo-100 text-indigo-700 border-indigo-300 dark:bg-indigo-900 dark:text-indigo-200'
                                    : 'bg-white text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
                                }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
                <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Log a call, note, or email..."
                    className="w-full text-sm p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    rows={2}
                />
                <div className="flex justify-end mt-2">
                    <button
                        type="submit"
                        className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-500"
                    >
                        Log Activity
                    </button>
                </div>
            </form>

            {/* Timeline List */}
            <div className="space-y-4">
                {activities.length === 0 ? (
                    <p className="text-xs text-gray-500 italic">No activities recorded yet.</p>
                ) : (
                    activities.map((activity) => (
                        <div key={activity.id} className="flex gap-3 text-sm">
                            <div className="flex-none mt-0.5">
                                <span className={`block w-2 h-2 rounded-full ${activity.type === 'CALL' ? 'bg-green-400' :
                                        activity.type === 'EMAIL' ? 'bg-blue-400' :
                                            activity.type === 'MEETING' ? 'bg-purple-400' : 'bg-gray-400'
                                    }`} />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <span className="font-medium text-gray-900 dark:text-gray-200">{activity.type}</span>
                                    <span className="text-xs text-gray-500">
                                        {new Date(activity.createdAt).toLocaleString()}
                                    </span>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 mt-0.5">{activity.notes}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
