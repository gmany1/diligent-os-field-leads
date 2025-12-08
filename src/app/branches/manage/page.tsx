'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Building2, Plus, Edit, Trash2, MapPin, Search, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import ManageBranchModal from '@/components/branches/ManageBranchModal';
import { createBranch, updateBranch, deleteBranch } from '@/lib/branch-actions';

export default function ManageBranchesPage() {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBranch, setEditingBranch] = useState<any | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    // Fetch Branches - reusing the public API we made earlier or direct server action if we preferred
    // Using API for consistency with other parts for now, but server action is also viable.
    // Let's stick to API for fetching list to keep 'client' component clean
    const { data: branches, isLoading } = useQuery({
        queryKey: ['branches'],
        queryFn: async () => {
            const res = await fetch('/api/branches');
            if (!res.ok) throw new Error('Failed to fetch');
            return res.json();
        }
    });

    // Mutations
    const createMutation = useMutation({
        mutationFn: createBranch,
        onSuccess: (res) => {
            if (res.success) {
                toast.success('Branch created successfully');
                setIsModalOpen(false);
                setEditingBranch(null);
                queryClient.invalidateQueries({ queryKey: ['branches'] });
            } else {
                toast.error(res.error || 'Failed to create branch');
            }
        }
    });

    const updateMutation = useMutation({
        mutationFn: (data: any) => updateBranch(editingBranch.id, data),
        onSuccess: (res) => {
            if (res.success) {
                toast.success('Branch updated successfully');
                setIsModalOpen(false);
                setEditingBranch(null);
                queryClient.invalidateQueries({ queryKey: ['branches'] });
            } else {
                toast.error(res.error || 'Failed to update branch');
            }
        }
    });

    const deleteMutation = useMutation({
        mutationFn: deleteBranch,
        onSuccess: (res) => {
            if (res.success) {
                toast.success('Branch deleted successfully');
                setDeleteConfirm(null);
                queryClient.invalidateQueries({ queryKey: ['branches'] });
            } else {
                toast.error(res.error || 'Failed to delete branch');
            }
        }
    });

    const handleSubmit = async (data: any) => {
        if (editingBranch) {
            updateMutation.mutate(data);
        } else {
            createMutation.mutate(data);
        }
    };

    const handleEdit = (branch: any) => {
        setEditingBranch(branch);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string, code: string) => {
        if (deleteConfirm === id) {
            deleteMutation.mutate(id);
        } else {
            toast.warning(`Click delete again to confirm. Ensure no active users/leads linked to ${code}.`);
            setDeleteConfirm(id);
            // Auto-reset confirm after 3s
            setTimeout(() => setDeleteConfirm(null), 3000);
        }
    };

    // Filter
    const filteredBranches = branches?.filter((b: any) =>
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const isSubmitting = createMutation.isPending || updateMutation.isPending;

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Branches</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Create, edit, and manage company operating locations
                    </p>
                </div>
                <button
                    onClick={() => { setEditingBranch(null); setIsModalOpen(true); }}
                    className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                    <Plus size={20} className="mr-2" />
                    New Branch
                </button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                    type="text"
                    placeholder="Search branches..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <div key={i} className="h-40 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />)}
                </div>
            )}

            {/* Mobile Cards / Desktop Table Hybrid Container */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">

                {/* Mobile View (Cards) */}
                <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredBranches?.map((branch: any) => (
                        <div key={branch.id} className="p-4 space-y-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center space-x-2">
                                        <Building2 size={18} className="text-indigo-600" />
                                        <h3 className="font-bold text-gray-900 dark:text-white">{branch.name}</h3>
                                    </div>
                                    <p className="text-xs font-mono text-gray-500 mt-1 ml-6">{branch.code}</p>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleEdit(branch)}
                                        className="p-2 text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(branch.id, branch.code)}
                                        className={`p-2 rounded-lg transition-colors ${deleteConfirm === branch.id ? 'bg-red-600 text-white' : 'text-red-500 bg-red-50 dark:bg-red-900/20'}`}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 ml-1">
                                <MapPin size={14} className="mr-2 text-gray-400" />
                                {branch.city}, {branch.state}
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mt-2 bg-gray-50 dark:bg-gray-900/50 p-2 rounded">
                                <div>Users: <span className="font-bold text-gray-700 dark:text-gray-300">{branch._count?.users || 0}</span></div>
                                <div>Leads: <span className="font-bold text-gray-700 dark:text-gray-300">{branch._count?.leads || 0}</span></div>
                            </div>

                            {deleteConfirm === branch.id && (
                                <div className="p-2 bg-red-50 text-red-700 text-xs rounded border border-red-200 flex items-center">
                                    <AlertTriangle size={12} className="mr-1" />
                                    Tap trash again to verify deletion.
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Desktop View (Table) */}
                <table className="hidden md:table w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-500">Branch Name</th>
                            <th className="px-6 py-4 font-semibold text-gray-500">Code</th>
                            <th className="px-6 py-4 font-semibold text-gray-500">Location</th>
                            <th className="px-6 py-4 font-semibold text-gray-500">Stats</th>
                            <th className="px-6 py-4 font-semibold text-gray-500 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredBranches?.map((branch: any) => (
                            <tr key={branch.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 group">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded text-indigo-600">
                                            <Building2 size={16} />
                                        </div>
                                        <span>{branch.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-mono text-sm text-gray-500">{branch.code}</td>
                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                    {branch.city}, {branch.state}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    <span className="mr-3">{branch._count?.users || 0} users</span>
                                    <span>{branch._count?.leads || 0} leads</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleEdit(branch)}
                                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded"
                                            title="Edit Branch"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(branch.id, branch.code)}
                                            className={`p-1.5 rounded transition-colors ${deleteConfirm === branch.id ? 'bg-red-600 text-white' : 'text-red-500 hover:bg-red-50'}`}
                                            title="Delete Branch"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {!isLoading && filteredBranches?.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        <Building2 size={48} className="mx-auto text-gray-300 mb-4" />
                        <p>No branches found matching "{searchTerm}"</p>
                    </div>
                )}
            </div>

            <ManageBranchModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                initialData={editingBranch}
                isLoading={isSubmitting}
            />
        </div>
    );
}
