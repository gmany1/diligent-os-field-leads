'use client';

import { useQuery } from '@tanstack/react-query';
import { Building2, Users, TrendingUp, MapPin, Plus } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function BranchesAllPage() {
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
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Branches</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Manage all branch locations
                    </p>
                </div>
                <button
                    onClick={() => toast.info('Create branch functionality coming soon')}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <Plus size={20} className="mr-2" />
                    Add Branch
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Branches</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{branches?.length || 0}</p>
                        </div>
                        <Building2 className="text-indigo-600" size={32} />
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                            <p className="text-2xl font-bold text-green-600">
                                {branches?.reduce((sum: number, b: any) => sum + (b._count?.users || 0), 0) || 0}
                            </p>
                        </div>
                        <Users className="text-green-600" size={32} />
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Leads</p>
                            <p className="text-2xl font-bold text-blue-600">
                                {branches?.reduce((sum: number, b: any) => sum + (b._count?.leads || 0), 0) || 0}
                            </p>
                        </div>
                        <TrendingUp className="text-blue-600" size={32} />
                    </div>
                </div>
            </div>

            {/* Branches Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {branches?.map((branch: any) => (
                    <div key={branch.id} className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow">
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                                        <Building2 className="text-indigo-600 dark:text-indigo-400" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {branch.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {branch.code}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                    <MapPin size={16} className="mr-2" />
                                    {branch.city}, {branch.state}
                                </div>
                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                    <Users size={16} className="mr-2" />
                                    {branch._count?.users || 0} users
                                </div>
                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                    <TrendingUp size={16} className="mr-2" />
                                    {branch._count?.leads || 0} leads
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <Link
                                    href={`/branches/${branch.id}`}
                                    className="w-full flex items-center justify-center px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors font-medium"
                                >
                                    Enter Nexus
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
