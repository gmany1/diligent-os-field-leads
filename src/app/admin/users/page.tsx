'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Users, Shield, Mail, Building2, Edit, Trash2, UserPlus, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface EditUserData {
    id: string;
    name: string;
    email: string;
    role: string;
    branchId: string | null;
    territory: string | null;
}

export default function UsersPage() {
    const queryClient = useQueryClient();
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [editingUser, setEditingUser] = useState<EditUserData | null>(null);
    const [editForm, setEditForm] = useState({
        name: '',
        email: '',
        role: '',
        branchId: '',
        territory: '',
        password: ''
    });

    const { data: users, isLoading, error } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await fetch('/api/users');
            if (!res.ok) throw new Error('Failed to fetch users');
            return res.json();
        }
    });

    const { data: branches } = useQuery({
        queryKey: ['branches'],
        queryFn: async () => {
            const res = await fetch('/api/branches');
            if (!res.ok) return [];
            return res.json();
        }
    });

    const handleEditClick = (user: any) => {
        setEditingUser(user);
        setEditForm({
            name: user.name || '',
            email: user.email || '',
            role: user.role || '',
            branchId: user.branchId || '',
            territory: user.territory || '',
            password: ''
        });
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;

        try {
            const updateData: any = {
                name: editForm.name,
                email: editForm.email,
                role: editForm.role,
                branchId: editForm.branchId || null,
                territory: editForm.territory || null,
            };

            // Only include password if it's been changed
            if (editForm.password && editForm.password.trim() !== '') {
                updateData.password = editForm.password;
            }

            const res = await fetch(`/api/users/${editingUser.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || 'Failed to update user');
                return;
            }

            toast.success('User updated successfully');
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setEditingUser(null);
        } catch (error) {
            toast.error('Failed to update user');
            console.error(error);
        }
    };

    const handleDelete = async (userId: string, userName: string) => {
        if (deleteConfirm !== userId) {
            setDeleteConfirm(userId);
            toast.warning(`Click delete again to confirm deletion of ${userName}`);
            setTimeout(() => setDeleteConfirm(null), 3000);
            return;
        }

        try {
            const res = await fetch(`/api/users/${userId}`, {
                method: 'DELETE',
            });

            const data = await res.json();

            if (!res.ok) {
                if (data.details) {
                    toast.error(`Cannot delete user: Has ${data.details.leads} leads, ${data.details.activities} activities, ${data.details.quotes} quotes, ${data.details.commissions} commissions`);
                } else {
                    toast.error(data.error || 'Failed to delete user');
                }
                return;
            }

            toast.success('User deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setDeleteConfirm(null);
        } catch (error) {
            toast.error('Failed to delete user');
            console.error(error);
        }
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

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-red-600 dark:text-red-400">Error loading users. Please try again.</p>
                </div>
            </div>
        );
    }

    const getRoleBadgeColor = (role: string) => {
        const colors: Record<string, string> = {
            CEO: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
            CAO: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
            DOO: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
            IT_SUPER_ADMIN: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
            BRANCH_MANAGER: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
            STAFFING_REP: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
            SALES_REP: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
        };
        return colors[role] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    };

    const roles = ['CEO', 'CAO', 'DOO', 'IT_SUPER_ADMIN', 'BRANCH_MANAGER', 'STAFFING_REP', 'SALES_REP'];

    return (
        <div className="p-6 space-y-6">
            {/* Edit Modal */}
            {editingUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit User</h2>
                                <button
                                    onClick={() => setEditingUser(null)}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleEditSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={editForm.email}
                                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Role
                                    </label>
                                    <select
                                        value={editForm.role}
                                        onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        required
                                    >
                                        <option value="">Select role...</option>
                                        {roles.map(role => (
                                            <option key={role} value={role}>{role.replace(/_/g, ' ')}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Branch
                                    </label>
                                    <select
                                        value={editForm.branchId}
                                        onChange={(e) => setEditForm({ ...editForm, branchId: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                        <option value="">No branch</option>
                                        {branches?.map((branch: any) => (
                                            <option key={branch.id} value={branch.id}>{branch.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Territory
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.territory}
                                        onChange={(e) => setEditForm({ ...editForm, territory: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="Optional"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        New Password (leave blank to keep current)
                                    </label>
                                    <input
                                        type="password"
                                        value={editForm.password}
                                        onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="Enter new password or leave blank"
                                    />
                                </div>

                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setEditingUser(null)}
                                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Users</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Manage user accounts and permissions
                    </p>
                </div>
                <button
                    onClick={() => toast.info('User creation form coming soon')}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <UserPlus size={20} className="mr-2" />
                    Add User
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{users?.length || 0}</p>
                        </div>
                        <Users className="text-indigo-600" size={32} />
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Executives</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {users?.filter((u: any) => ['CEO', 'CAO', 'DOO'].includes(u.role)).length || 0}
                            </p>
                        </div>
                        <Shield className="text-purple-600" size={32} />
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Managers</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {users?.filter((u: any) => u.role === 'BRANCH_MANAGER').length || 0}
                            </p>
                        </div>
                        <Building2 className="text-blue-600" size={32} />
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Reps</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {users?.filter((u: any) => ['STAFFING_REP', 'SALES_REP'].includes(u.role)).length || 0}
                            </p>
                        </div>
                        <Users className="text-green-600" size={32} />
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Branch
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Activity
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Created
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {users?.map((user: any) => (
                                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                                                <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                                                    {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {user.name || 'No name'}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                                                    <Mail size={12} className="mr-1" />
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                                            {user.role.replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {user.branch?.name || 'No branch'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        <div className="text-xs">
                                            {user._count?.leads || 0} leads, {user._count?.activities || 0} activities
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleEditClick(user)}
                                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3"
                                            title="Edit user"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.id, user.name || user.email)}
                                            className={`${deleteConfirm === user.id ? 'text-red-900 dark:text-red-200' : 'text-red-600 dark:text-red-400'} hover:text-red-900 dark:hover:text-red-300 transition-colors`}
                                            title={deleteConfirm === user.id ? 'Click again to confirm' : 'Delete user'}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
