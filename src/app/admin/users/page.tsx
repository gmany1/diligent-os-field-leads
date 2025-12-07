'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Users, Shield, Mail, Building2, Edit, Trash2, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function UsersPage() {
    const queryClient = useQueryClient();
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const { data: users, isLoading, error } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await fetch('/api/users');
            if (!res.ok) throw new Error('Failed to fetch users');
            return res.json();
        }
    });

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

    return (
        <div className="p-6 space-y-6">
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
                                            onClick={() => toast.info('Edit user form coming soon')}
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
