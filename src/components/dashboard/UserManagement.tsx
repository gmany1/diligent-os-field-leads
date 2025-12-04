'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Fetchers
const fetchUsers = async () => {
    const res = await fetch('/api/users');
    if (!res.ok) throw new Error('Failed to fetch users');
    const json = await res.json();
    return json.data || [];
};

export default function UserManagement() {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [formData, setFormData] = useState({ name: '', email: '', role: 'FIELD_LEAD_REP', territory: '', password: '' });

    const { data: users = [], isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: fetchUsers,
    });

    const createUserMutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Failed to create user');
            }
            return res.json();
        },
        onSuccess: () => {
            toast.success('User created successfully');
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setIsModalOpen(false);
        },
        onError: (error: any) => {
            toast.error(error.message);
        }
    });

    const updateUserMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: any }) => {
            const res = await fetch(`/api/users/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Failed to update user');
            }
            return res.json();
        },
        onSuccess: () => {
            toast.success('User updated successfully');
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setIsModalOpen(false);
        },
        onError: (error: any) => {
            toast.error(error.message);
        }
    });

    const handleAddClick = () => {
        setEditingUser(null);
        setFormData({ name: '', email: '', role: 'FIELD_LEAD_REP', territory: '', password: '' });
        setIsModalOpen(true);
    };

    const handleCardClick = (user: any) => {
        setEditingUser(user);
        // Don't populate password for edit
        setFormData({ name: user.name || '', email: user.email, role: user.role, territory: user.territory || '', password: '' });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingUser) {
            updateUserMutation.mutate({ id: editingUser.id, data: formData });
        } else {
            if (!formData.password) {
                toast.error('Password is required for new users');
                return;
            }
            createUserMutation.mutate(formData);
        }
    };

    if (isLoading) return <div className="p-6 text-center">Loading users...</div>;

    return (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl h-auto flex flex-col">
            {/* Header Section */}
            <div className="px-4 py-4 sm:px-6 sm:py-5 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50 dark:bg-gray-900/50">
                <div className="w-full sm:w-auto">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white leading-tight">User Management</h3>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Manage access and permissions</p>
                </div>

                {/* Add User Button - Mobile First */}
                <button
                    onClick={handleAddClick}
                    className="w-full sm:w-auto h-[44px] bg-indigo-600 hover:bg-indigo-700 text-white px-4 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-2 mb-[16px] sm:mb-0"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    Add User
                </button>
            </div>

            {/* Content Section - Grid Layout - Removed internal scroll, max 2 columns */}
            <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px] w-full">
                    {users.map((user: any) => (
                        <div
                            key={user.id}
                            onClick={() => handleCardClick(user)}
                            className="w-full p-[12px] rounded-[12px] flex flex-col gap-[6px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
                        >
                            {/* Header: Avatar + Edit Icon */}
                            <div className="flex items-center justify-between">
                                <div className={`w-[42px] h-[42px] text-[16px] rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold shadow-sm ${user.role === 'IT_ADMIN' ? 'bg-purple-600' :
                                    user.role === 'MANAGER' ? 'bg-blue-600' :
                                        'bg-emerald-600'
                                    }`}>
                                    {user.name ? user.name[0] : '?'}
                                </div>
                                <div className="w-[16px] h-[16px] opacity-60 text-gray-500 dark:text-gray-400">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                    </svg>
                                </div>
                            </div>

                            {/* Info Block */}
                            <div className="flex flex-col gap-[2px] break-words">
                                <div className="text-[16px] font-semibold text-gray-900 dark:text-white leading-tight">
                                    {user.name || 'Unnamed'}
                                </div>
                                <div className="text-[13px] text-gray-500 dark:text-gray-400 leading-tight">
                                    {user.email}
                                </div>
                            </div>

                            {/* Badges */}
                            <div className="flex flex-wrap gap-2 mt-1">
                                <span className={`inline-flex px-[8px] py-[4px] text-[12px] rounded-[6px] flex-wrap max-w-full font-medium ${user.role === 'IT_ADMIN' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                                    user.role === 'MANAGER' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                                        'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                                    }`}>
                                    {user.role.replace(/_/g, ' ')}
                                </span>
                                {user.territory && (
                                    <span className="inline-flex px-[8px] py-[4px] text-[12px] rounded-[6px] bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 font-medium">
                                        {user.territory}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add/Edit User Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl transform transition-all">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                {editingUser ? 'Edit User' : 'Add New User'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white py-2 px-3"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white py-2 px-3"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                                <input
                                    type="password"
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white py-2 px-3"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    placeholder={editingUser ? "Leave blank to keep current" : "Required for new user"}
                                    required={!editingUser}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                                <select
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white py-2 px-3"
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="FIELD_LEAD_REP">Field Rep</option>
                                    <option value="MANAGER">Manager</option>
                                    <option value="IT_ADMIN">Admin</option>
                                    <option value="EXECUTIVE">Executive</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Territory / Branch</label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white py-2 px-3"
                                    value={formData.territory}
                                    onChange={e => setFormData({ ...formData, territory: e.target.value })}
                                    placeholder="e.g. Los Angeles"
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-8">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={createUserMutation.isPending || updateUserMutation.isPending}
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50"
                                >
                                    {createUserMutation.isPending || updateUserMutation.isPending ? 'Saving...' : (editingUser ? 'Save Changes' : 'Create User')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
