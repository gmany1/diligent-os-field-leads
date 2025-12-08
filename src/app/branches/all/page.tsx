'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Building2, Users, TrendingUp, MapPin, Plus, Map as MapIcon, List } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import GlobalEcosystemMap from '@/components/branches/GlobalEcosystemMap';

export default function BranchesAllPage() {
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

    const { data: branches, isLoading } = useQuery({
        queryKey: ['branches'],
        queryFn: async () => {
            const res = await fetch('/api/branches');
            if (!res.ok) throw new Error('Failed to fetch');
            return res.json();
        }
    });

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

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Global Command Center</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Manage all branch locations and view global performance.
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    {/* View Toggle */}
                    <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg flex items-center border border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow text-indigo-600' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400'}`}
                            title="List View"
                        >
                            <List size={20} />
                        </button>
                        <button
                            onClick={() => setViewMode('map')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'map' ? 'bg-white dark:bg-gray-700 shadow text-indigo-600' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400'}`}
                            title="Map View (CEO)"
                        >
                            <MapIcon size={20} />
                        </button>
                    </div>

                    <button
                        onClick={() => toast.info('Create branch functionality coming soon')}
                        className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30"
                    >
                        <Plus size={20} className="mr-2" />
                        New Branch
                    </button>
                </div>
            </div>

            {/* Summary Cards (Global Stats) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Network Size</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{branches?.length || 0}</p>
                        </div>
                        <Building2 className="text-indigo-500 opacity-80" size={28} />
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Global Headcount</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {branches?.reduce((sum: number, b: any) => sum + (b._count?.users || 0), 0) || 0}
                            </p>
                        </div>
                        <Users className="text-purple-500 opacity-80" size={28} />
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Total Leads</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {branches?.reduce((sum: number, b: any) => sum + (b._count?.leads || 0), 0) || 0}
                            </p>
                        </div>
                        <TrendingUp className="text-blue-500 opacity-80" size={28} />
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Global Revenue (Est)</p>
                            <p className="text-2xl font-bold text-emerald-600">
                                {branches?.reduce((sum: number, b: any) => sum + (b.stats?.revenue || 0), 0).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) || '$0'}
                            </p>
                        </div>
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full text-emerald-600">
                            <span className="font-bold">$</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            {viewMode === 'map' ? (
                <div className="animate-fadeIn">
                    <GlobalEcosystemMap branches={branches || []} />
                    <p className="text-center text-sm text-gray-500 mt-2">
                        Interactive Map: Click a Branch Node to enter its Nexus. Color indicates Performance Score.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
                    {branches?.map((branch: any) => (
                        <div key={branch.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700 group">
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className={`p-3 rounded-xl ${branch.status === 'ARCHIVED' ? 'bg-gray-100 text-gray-400' : 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600'}`}>
                                            <Building2 size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                                                {branch.name}
                                            </h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded inline-block">
                                                {branch.code}
                                            </p>
                                        </div>
                                    </div>
                                    {branch.status === 'ARCHIVED' && <span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-1 rounded-full">ARCHIVED</span>}
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                        <MapPin size={16} className="mr-3 text-gray-400" />
                                        {branch.city}, {branch.state}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                        <Users size={16} className="mr-3 text-gray-400" />
                                        {branch._count?.users || 0} users
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                        <TrendingUp size={16} className="mr-3 text-gray-400" />
                                        {branch._count?.leads || 0} leads
                                        <span className="mx-2">•</span>
                                        <span className="text-emerald-600 font-medium">
                                            {branch.stats?.revenue?.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
                                        </span>
                                    </div>
                                </div>

                                <Link
                                    href={`/branches/${branch.id}`}
                                    className="block w-full text-center px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-indigo-600 hover:text-white transition-all font-medium text-sm"
                                >
                                    Enter Nexus
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
