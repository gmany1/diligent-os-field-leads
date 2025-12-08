'use client';

import React, { useState } from 'react';
import EcosystemGraph from '@/components/visualizer/EcosystemGraph';
import { LayoutDashboard, Users, Share2, TrendingUp, MapPin, Mail, Phone } from 'lucide-react';

interface BranchDetailsProps {
    branch: any;
}

export default function BranchDetailsClient({ branch }: BranchDetailsProps) {
    const [activeTab, setActiveTab] = useState('nexus');

    const manager = branch.users.find((u: any) => u.role === 'BRANCH_MANAGER' || u.role === 'MANAGER');
    const staff = branch.users.filter((u: any) => u.role !== 'BRANCH_MANAGER' && u.role !== 'MANAGER');

    // Calculate simple stats
    const totalLeads = branch._count?.leads || 0;
    const activeLeads = branch.users.reduce((acc: number, u: any) => acc + (u._count?.leads || 0), 0);
    // Mock Revenue
    const revenue = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalLeads * 1500);

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header / Hero Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start space-y-4 md:space-y-0">
                    <div>
                        <div className="flex items-center space-x-3">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{branch.name}</h1>
                            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-full text-xs font-bold font-mono">
                                {branch.code}
                            </span>
                        </div>
                        <div className="flex items-center text-gray-500 dark:text-gray-400 mt-2 space-x-4 text-sm">
                            <span className="flex items-center"><MapPin size={14} className="mr-1" /> {branch.city}, {branch.state}</span>
                            {manager && <span className="flex items-center"><Users size={14} className="mr-1" /> Mgr: {manager.name}</span>}
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow">
                            Edit Branch
                        </button>
                    </div>
                </div>

                {/* KPI Cards Strip */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="p-4 bg-gray-50 dark:bg-gray-750 rounded-xl border border-gray-100 dark:border-gray-700">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Revenue</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{revenue}</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-750 rounded-xl border border-gray-100 dark:border-gray-700">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Leads</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{totalLeads}</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-750 rounded-xl border border-gray-100 dark:border-gray-700">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Staff</p>
                        <div className="flex items-end space-x-2">
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{branch.users.length}</p>
                            <span className="text-xs text-green-600 font-medium mb-1 flex items-center bg-green-100 px-1.5 py-0.5 rounded">
                                <TrendingUp size={10} className="mr-1" /> Healthy
                            </span>
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-750 rounded-xl border border-gray-100 dark:border-gray-700">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Performance</p>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3 dark:bg-gray-700">
                            <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                        <p className="text-xs text-right mt-1 text-gray-500">85% Target</p>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('nexus')}
                        className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'nexus'
                                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        <Share2 className={`-ml-0.5 mr-2 h-5 w-5 ${activeTab === 'nexus' ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'}`} />
                        The Nexus (Map)
                    </button>
                    <button
                        onClick={() => setActiveTab('team')}
                        className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'team'
                                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        <Users className={`-ml-0.5 mr-2 h-5 w-5 ${activeTab === 'team' ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'}`} />
                        Team Roster
                    </button>
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'overview'
                                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        <LayoutDashboard className={`-ml-0.5 mr-2 h-5 w-5 ${activeTab === 'overview' ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'}`} />
                        Overview Details
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            <div className="min-h-[500px]">
                {activeTab === 'nexus' && (
                    <div className="animate-fadeIn">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Ecosystem Map</h3>
                            <button className="text-sm text-gray-500 hover:text-indigo-600 flex items-center">
                                <Users size={14} className="mr-1" /> Legend: Green = Active
                            </button>
                        </div>
                        <EcosystemGraph branch={branch} />
                    </div>
                )}

                {activeTab === 'team' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
                        {branch.users.map((user: any) => (
                            <div key={user.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                                <div className="flex items-center space-x-4">
                                    <div className={`h-12 w-12 rounded-full flex items-center justify-center text-lg font-bold ${user.role.includes('MANAGER')
                                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                                            : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                                        }`}>
                                        {user.name?.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white">{user.name}</h4>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">{user.role.replace(/_/g, ' ')}</p>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500 text-xs">Email</p>
                                        <p className="truncate text-gray-700 dark:text-gray-300 font-medium">{user.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs">Leads</p>
                                        <p className="text-gray-700 dark:text-gray-300 font-medium">{user._count?.leads || 0}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'overview' && (
                    <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300 animate-fadeIn">
                        Detailed charts and historical data would go here.
                    </div>
                )}
            </div>
        </div>
    );
}
