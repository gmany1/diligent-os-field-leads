'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, MapPin, Building, AlertTriangle } from 'lucide-react';

interface BranchFormData {
    name: string;
    code: string;
    address: string;
    city: string;
    state: string;
}

interface ManageBranchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: BranchFormData) => Promise<void>;
    initialData?: BranchFormData | null;
    isLoading?: boolean;
}

export default function ManageBranchModal({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    isLoading = false
}: ManageBranchModalProps) {
    const [formData, setFormData] = useState<BranchFormData>({
        name: '',
        code: '',
        address: '',
        city: '',
        state: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({ name: '', code: '', address: '', city: '', state: '' }); // Reset
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const isEditing = !!initialData;

    return (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
            {/* Modal Content */}
            <div
                className="w-full md:w-[600px] bg-white dark:bg-gray-800 md:rounded-xl rounded-t-2xl shadow-2xl transform transition-transform animate-slideUp"
            >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                            <Building className="mr-2 text-indigo-600" size={24} />
                            {isEditing ? 'Edit Branch' : 'New Branch'}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {isEditing ? `Update details for ${initialData?.code}` : 'Initialize a new operating location'}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Branch Name</label>
                            <input
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Los Angeles HQ"
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent dark:text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Branch Code</label>
                            <input
                                required
                                disabled={isEditing} // Code immutable after creation to preserve ID consistency
                                value={formData.code}
                                onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                placeholder="e.g. BR-LA-001"
                                className={`w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent font-mono dark:text-white ${isEditing ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed text-gray-500' : ''}`}
                            />
                            {isEditing && <p className="text-xs text-yellow-600 flex items-center"><AlertTriangle size={10} className="mr-1" /> Code cannot be changed</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Street Address</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-2.5 text-gray-400" size={16} />
                            <input
                                value={formData.address}
                                onChange={e => setFormData({ ...formData, address: e.target.value })}
                                placeholder="123 Main St"
                                className="w-full pl-9 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">City</label>
                            <input
                                value={formData.city}
                                onChange={e => setFormData({ ...formData, city: e.target.value })}
                                placeholder="Los Angeles"
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent dark:text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">State</label>
                            <input
                                value={formData.state}
                                onChange={e => setFormData({ ...formData, state: e.target.value })}
                                placeholder="CA"
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Saving...' : (
                                <>
                                    <Save size={18} className="mr-2" />
                                    {isEditing ? 'Save Changes' : 'Create Branch'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
