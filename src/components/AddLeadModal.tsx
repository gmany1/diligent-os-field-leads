'use client';

import { useState } from 'react';
import { BRANCHES } from '@/lib/constants';

interface AddLeadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    newLeadName: string;
    setNewLeadName: (name: string) => void;
    newLeadBranch: string;
    setNewLeadBranch: (branch: string) => void;
    isEnriching: boolean;
    onEnrich: () => void;
    isSubmitting: boolean;
    leads: any[];
}

export default function AddLeadModal({
    isOpen,
    onClose,
    onSubmit,
    newLeadName,
    setNewLeadName,
    newLeadBranch,
    setNewLeadBranch,
    isEnriching,
    onEnrich,
    isSubmitting,
    leads,
    enrichedData // New prop
}: AddLeadModalProps & { enrichedData?: any }) {
    const [formData, setFormData] = useState({
        contactPerson: '',
        phone: '',
        email: '',
        address: '',
        industry: '',
        leadType: 'Commercial',
        hiringNeeds: '',
        currentVendor: ''
    });

    // Update form data when enrichedData changes
    if (enrichedData && (formData.phone !== enrichedData.phone || formData.email !== enrichedData.email)) {
        setFormData(prev => ({
            ...prev,
            ...enrichedData
        }));
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Create a synthetic event or pass data differently. 
        // Since the parent expects a FormEvent and uses FormData, we need to ensure the inputs have names and values.
        // But wait, the parent uses `new FormData(e.currentTarget)`. 
        // Since we are using controlled inputs, the `value` attribute is set, so `FormData` will still work correctly!
        onSubmit(e);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all scale-100 animate-in zoom-in-95 duration-200 border border-gray-200 dark:border-gray-700">

                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add New Lead</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                        <span className="sr-only">Close</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Name *</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    name="company" // Ensure name is present for FormData
                                    value={newLeadName}
                                    onChange={(e) => setNewLeadName(e.target.value)}
                                    placeholder="e.g. Acme Construction"
                                    className="flex-1 rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    required
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={onEnrich}
                                    disabled={isEnriching || !newLeadName}
                                    className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm flex items-center gap-2 transition-colors dark:bg-indigo-900/30 dark:text-indigo-300"
                                >
                                    {isEnriching ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Enriching...
                                        </>
                                    ) : (
                                        <>✨ Magic Enrich</>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Branch</label>
                            <select
                                name="branch" // Ensure name is present
                                value={newLeadBranch}
                                onChange={(e) => setNewLeadBranch(e.target.value)}
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            >
                                {BRANCHES.map((b) => (
                                    <option key={b.id} value={b.id}>{b.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Person</label>
                            <input
                                type="text"
                                name="contactPerson"
                                value={formData.contactPerson}
                                onChange={handleChange}
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Industry</label>
                            <input
                                type="text"
                                name="industry"
                                list="industry-options"
                                value={formData.industry}
                                onChange={handleChange}
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                            <datalist id="industry-options">
                                {Array.from(new Set(leads.map((l: any) => l.industry).filter(Boolean))).map((ind: any) => (
                                    <option key={ind} value={ind} />
                                ))}
                            </datalist>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Lead Type</label>
                            <select
                                name="leadType"
                                value={formData.leadType}
                                onChange={handleChange}
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            >
                                <option value="Commercial">Commercial</option>
                                <option value="Residential">Residential</option>
                            </select>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Staffing Details (Optional)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                name="hiringNeeds"
                                value={formData.hiringNeeds}
                                onChange={handleChange}
                                placeholder="Hiring Needs (e.g. 5 Welders)"
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                            <input
                                type="text"
                                name="currentVendor"
                                value={formData.currentVendor}
                                onChange={handleChange}
                                placeholder="Current Vendor"
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Creating...' : 'Create Lead'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
