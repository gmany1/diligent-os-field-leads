'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, Shield, Edit, Trash2, Plus, Server, Save, X, Lock } from 'lucide-react';

async function fetchRoles() {
    const res = await fetch('/api/admin/roles');
    if (!res.ok) throw new Error('Failed to fetch roles');
    return res.json();
}

type Role = {
    id: string;
    name: string;
    desc: string;
    type: string;
    isSystem: boolean;
    _count?: { users: number }; // Made optional to fit defensive coding
};

export default function RolesPage() {
    const queryClient = useQueryClient();
    const { data, isLoading } = useQuery({
        queryKey: ['roles'],
        queryFn: fetchRoles
    });

    const [isEditing, setIsEditing] = useState(false);
    const [currentRole, setCurrentRole] = useState<Partial<Role>>({});

    const createMutation = useMutation({
        mutationFn: async (newRole: Partial<Role>) => {
            await fetch('/api/admin/roles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newRole)
            });
        },
        onSuccess: () => {
            setIsEditing(false);
            setCurrentRole({});
            queryClient.invalidateQueries({ queryKey: ['roles'] });
        }
    });

    const updateMutation = useMutation({
        mutationFn: async (role: Partial<Role>) => {
            await fetch('/api/admin/roles', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(role)
            });
        },
        onSuccess: () => {
            setIsEditing(false);
            setCurrentRole({});
            queryClient.invalidateQueries({ queryKey: ['roles'] });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/admin/roles?id=${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Cannot delete this role');
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['roles'] }),
        onError: () => alert('Cannot delete system roles.')
    });

    const handleSubmit = () => {
        if (!currentRole.name) return alert('Role Name is required');

        if (currentRole.id && !currentRole.id.includes('NEW_')) {
            // Editing existing
            updateMutation.mutate(currentRole);
        } else {
            // Creating new
            createMutation.mutate(currentRole);
        }
    };

    if (isLoading) return <div className="p-8">Loading roles...</div>;

    const roles = data?.data || [];

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                        <Shield className="mr-3 text-indigo-600" /> Role Management
                    </h1>
                    <p className="text-gray-500 mt-1">Manage system roles and permissions</p>
                </div>
                <button
                    onClick={() => { setCurrentRole({ id: 'NEW_' }); setIsEditing(true); }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors shadow"
                >
                    <Plus size={18} className="mr-2" /> New Role
                </button>
            </div>

            {/* Edit Modal */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {currentRole.id === 'NEW_' ? 'Create Role' : 'Edit Role'}
                            </h2>
                            <button onClick={() => setIsEditing(false)}><X size={20} className="text-gray-400" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Role Name</label>
                                <input
                                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                                    value={currentRole.name || ''}
                                    onChange={e => setCurrentRole({ ...currentRole, name: e.target.value })}
                                    disabled={currentRole.isSystem} // Cannot rename system roles for consistency
                                    title={currentRole.isSystem ? "System role names cannot be changed" : ""}
                                />
                                {currentRole.isSystem && <p className="text-xs text-yellow-600 mt-1">System role names are locked.</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                <textarea
                                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 h-24 resize-none"
                                    value={currentRole.desc || ''}
                                    onChange={e => setCurrentRole({ ...currentRole, desc: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Type</label>
                                <select
                                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                                    value={currentRole.type || 'Custom'}
                                    onChange={e => setCurrentRole({ ...currentRole, type: e.target.value })}
                                >
                                    <option value="Executive">Executive</option>
                                    <option value="Management">Management</option>
                                    <option value="Field">Field</option>
                                    <option value="Staff">Staff</option>
                                    <option value="Custom">Custom</option>
                                </select>
                            </div>
                        </div>
                        <div className="p-6 bg-gray-50 dark:bg-gray-900/50 flex justify-end space-x-3">
                            <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                            <button onClick={handleSubmit} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center shadow">
                                <Save size={18} className="mr-2" /> Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Role Name</th>
                            <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Description</th>
                            <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Type</th>
                            <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Users</th>
                            <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {roles.map((role: Role) => {
                            const userCount = role._count?.users || 0;
                            return (
                                <tr key={role.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className={`p-2 rounded-lg mr-3 ${role.isSystem ? 'bg-indigo-100 text-indigo-700' : 'bg-orange-100 text-orange-700'}`}>
                                                {role.isSystem ? <Shield size={18} /> : <Users size={18} />}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 dark:text-white">{role.name}</div>
                                                <div className="text-xs text-gray-400 font-mono">{role.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-sm max-w-xs truncate">{role.desc}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                                            {role.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                                            <div className="flex -space-x-2 mr-2">
                                                {[...Array(Math.min(3, userCount))].map((_, i) => (
                                                    <div key={i} className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white dark:border-gray-800"></div>
                                                ))}
                                                {userCount > 3 && <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[10px] text-gray-600">+{userCount - 3}</div>}
                                            </div>
                                            {userCount}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button
                                            onClick={() => { setCurrentRole(role); setIsEditing(true); }}
                                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Edit Role"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        {role.isSystem ? (
                                            <button className="p-2 text-gray-400 cursor-not-allowed" title="System roles cannot be deleted"><Lock size={16} /></button>
                                        ) : (
                                            <button
                                                onClick={() => { if (confirm('Delete Role?')) deleteMutation.mutate(role.id); }}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete Role"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="fixed bottom-6 right-6 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 flex items-center space-x-3 z-50">
                <div className="relative">
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <Server size={20} className="text-gray-600 dark:text-gray-300" />
                </div>
                <div className="text-xs">
                    <p className="font-bold text-gray-900 dark:text-white">API Connected</p>
                    <p className="text-gray-500 dark:text-gray-400">Source: /api/admin/roles</p>
                </div>
            </div>
        </div>
    );
}
