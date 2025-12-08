'use client';

import React, { useState } from 'react';
import { User, Mail, Calendar, MapPin, Shield, Activity, Settings, TrendingUp, Award, FileText } from 'lucide-react';
// We can reuse the ActivityTimeline if it accepts a user filter, or build a simple feed here.
// For now, let's build a dedicated view.

interface UserNexusProps {
    user: any;
}

export default function UserNexusClient({ user }: UserNexusProps) {
    const [activeTab, setActiveTab] = useState('overview');

    const joinedDate = new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
    });

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Hero Profile Header */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden relative">
                {/* Decorative Background */}
                <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>

                <div className="px-8 pb-8">
                    <div className="flex flex-col md:flex-row items-start md:items-end -mt-12 space-y-4 md:space-y-0">
                        {/* Avatar */}
                        <div className="h-24 w-24 rounded-full bg-white dark:bg-gray-800 p-1 shadow-lg z-10">
                            <div className="h-full w-full rounded-full bg-indigo-100 dark:bg-gray-700 flex items-center justify-center text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                                {user.name?.charAt(0)}
                            </div>
                        </div>

                        {/* Info */}
                        <div className="md:ml-6 flex-1 pt-2 md:pb-1">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                                <span className="flex items-center"><Mail size={14} className="mr-1" /> {user.email}</span>
                                <span className="flex items-center"><Shield size={14} className="mr-1" /> {user.role.replace(/_/g, ' ')}</span>
                                {user.branch && <span className="flex items-center"><MapPin size={14} className="mr-1" /> {user.branch.name}</span>}
                                <span className="flex items-center"><Calendar size={14} className="mr-1" /> Joined {joinedDate}</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-2 z-10 mt-4 md:mt-0">
                            <button className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                                Reset Password
                            </button>
                            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-sm text-sm font-medium hover:bg-indigo-700 transition-colors">
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Performance Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total Leads</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{user.stats?.totalLeads || 0}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Leads Won</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">{user.stats?.leadsWon || 0}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Conversion</p>
                    <div className="flex items-end">
                        <p className="text-2xl font-bold text-indigo-600 mt-1">{user.stats?.conversionRate || '0.0%'}</p>
                        <TrendingUp size={16} className="mb-1.5 ml-1 text-indigo-500" />
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Commission (Est)</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{user.stats?.currentCommission || '$0.00'}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 min-h-[400px]">
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="flex space-x-8 px-6" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'overview' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            <User size={16} className="mr-2" /> Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('activity')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'activity' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            <Activity size={16} className="mr-2" /> Activity Log
                        </button>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'settings' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            <Settings size={16} className="mr-2" /> Settings
                        </button>
                        <button
                            onClick={() => setActiveTab('documents')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'documents' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            <FileText size={16} className="mr-2" /> Documents
                        </button>
                    </nav>
                </div>

                <div className="p-6">
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Achievements</h3>
                                <button className="text-sm text-indigo-600 hover:text-indigo-700">View All</button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Mock Achievements */}
                                <div className="p-4 border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg flex items-center">
                                    <Award className="text-yellow-600 mr-3" size={24} />
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white">Top Performer</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Highest conversion rate in November</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'activity' && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Audit Logs</h3>
                            {user.recentActivity?.length > 0 ? (
                                <div className="space-y-4">
                                    {user.recentActivity.map((log: any) => (
                                        <div key={log.id} className="flex items-start pb-4 border-b last:border-0 border-gray-100 dark:border-gray-700">
                                            <div className="mt-1 mr-3 p-1.5 bg-gray-100 dark:bg-gray-700 rounded-full">
                                                <Activity size={12} className="text-gray-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">{log.action}</p>
                                                <div className="flex items-center text-xs text-gray-500 mt-0.5 space-x-2">
                                                    <span>{new Date(log.createdAt).toLocaleString()}</span>
                                                    <span>•</span>
                                                    <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">{log.resource}</span>
                                                </div>
                                                {log.details && (
                                                    <p className="text-xs text-gray-500 mt-1 bg-gray-50 dark:bg-gray-900/50 p-2 rounded w-full">
                                                        {JSON.stringify(log.details)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm">No recent activity found.</p>
                            )}
                        </div>
                    )}

                    {activeTab === 'documents' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Compliance Documents</h3>
                                    <p className="text-sm text-gray-500">I-9, W-4, and Contract Agreements.</p>
                                </div>
                                <button onClick={() => alert('S3 Upload Coming Soon')} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-lg hover:bg-indigo-100">
                                    + Upload Document
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Checklist */}
                                {['I-9 Form', 'W-4 Form', 'Employment Contract', 'NDA'].map((docName) => {
                                    const exists = user.documents?.find((d: any) => d.name.includes(docName));
                                    return (
                                        <div key={docName} className={`p-4 rounded-xl border-2 ${exists ? 'border-green-100 bg-green-50 dark:bg-green-900/10' : 'border-dashed border-gray-200 bg-gray-50 dark:bg-gray-800'}`}>
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center">
                                                    <FileText size={18} className={exists ? 'text-green-600' : 'text-gray-400'} />
                                                    <span className={`ml-2 font-medium ${exists ? 'text-green-900 dark:text-green-100' : 'text-gray-500'}`}>{docName}</span>
                                                </div>
                                                {exists ? <Shield size={16} className="text-green-600" /> : <div className="w-2 h-2 rounded-full bg-red-400"></div>}
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                {exists ? `Uploaded on ${new Date(exists.uploadedAt).toLocaleDateString()}` : 'Required for compliance.'}
                                            </p>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* List of uploaded files */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                                <div className="bg-gray-50 px-4 py-2 border-b border-gray-100 dark:border-gray-700 font-medium text-sm text-gray-500">
                                    All Files
                                </div>
                                {(!user.documents || user.documents.length === 0) ? (
                                    <div className="p-8 text-center text-gray-400 text-sm">No documents uploaded yet.</div>
                                ) : (
                                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {user.documents.map((doc: any) => (
                                            <div key={doc.id} className="p-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                                <div className="flex items-center">
                                                    <FileText size={16} className="text-gray-500 mr-3" />
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{doc.name}</span>
                                                </div>
                                                <span className="text-xs text-gray-400">{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="max-w-xl">
                            <p className="text-gray-500 mb-6">Administrative settings for this user.</p>
                            <div className="space-y-4 opacity-50 pointer-events-none">
                                {/* Placeholder for future implementation */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">System Role</label>
                                    <input value={user.role} readOnly className="w-full p-2 border rounded bg-gray-50" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Assigned Branch</label>
                                    <input value={user.branch?.name || 'Unassigned'} readOnly className="w-full p-2 border rounded bg-gray-50" />
                                </div>
                                <p className="text-xs text-indigo-600">Editing is currently managed in the Users table modal.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
