'use client';

import { useState } from 'react';
import LeadList from '@/components/LeadList';
import { useRouter } from 'next/navigation';
import RateCalculator from '@/components/RateCalculator';
import { BRANCHES } from '@/lib/constants';
import { toast } from 'sonner';

export default function CRMPage() {
    const router = useRouter();
    const [selectedLead, setSelectedLead] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<any>({});

    // Fetch lead details when a lead is clicked
    const handleLeadClick = async (id: string) => {
        try {
            const res = await fetch(`/api/leads/${id}`);
            if (res.ok) {
                const lead = await res.json();
                setSelectedLead(lead);
                setEditForm(lead);
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Failed to fetch lead details:', error);
        }
    };



    const handleUpdateLead = async () => {
        try {
            const res = await fetch(`/api/leads/${selectedLead.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm),
            });

            if (res.ok) {
                const updatedLead = await res.json();
                setSelectedLead(updatedLead);
                setIsEditing(false);
                toast.success('Lead updated successfully');
                // Ideally refresh the list here too, but for now just update local state
            } else {
                console.error('Failed to update lead');
                toast.error('Failed to update lead');
            }
        } catch (error) {
            console.error('Error updating lead:', error);
            toast.error('Error updating lead');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditForm((prev: any) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">CRM & Lead Management</h1>

                <LeadList
                    onLeadClick={handleLeadClick}
                    onQuoteClick={(id) => console.log('Quote clicked', id)}
                    onEmailClick={(id) => window.location.href = `mailto:?body=Lead Ref: ${id}`}
                    onCallClick={(id) => console.log('Call clicked', id)}
                    onDeleteClick={(id) => console.log('Delete clicked', id)}
                    onStatusChange={(id, status) => console.log('Status change', id, status)}
                />
            </div>

            {/* Lead Details Modal */}
            {selectedLead && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setSelectedLead(null)}></div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="relative inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 z-50">
                            <div className="absolute top-0 right-0 pt-4 pr-4 flex gap-2">
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="text-indigo-600 hover:text-indigo-900 font-medium text-sm"
                                    >
                                        Edit
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={handleUpdateLead}
                                            className="text-green-600 hover:text-green-900 font-medium text-sm"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="text-gray-600 hover:text-gray-900 font-medium text-sm"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                )}
                                <button
                                    type="button"
                                    className="bg-white dark:bg-gray-800 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    onClick={() => setSelectedLead(null)}
                                >
                                    <span className="sr-only">Close</span>
                                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div>
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <h3 className="text-lg leading-6 font-bold text-gray-900 dark:text-white pr-20" id="modal-title">
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="name"
                                                value={editForm.name || ''}
                                                onChange={handleInputChange}
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                                            />
                                        ) : (
                                            selectedLead.name || 'Lead Details'
                                        )}
                                    </h3>
                                    <div className="mt-4 space-y-3 text-sm text-gray-900 dark:text-gray-100">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <span className="block font-bold text-gray-700 dark:text-gray-300">Company</span>
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        name="company"
                                                        value={editForm.company || ''}
                                                        onChange={handleInputChange}
                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-xs text-gray-900"
                                                    />
                                                ) : (
                                                    selectedLead.company || '-'
                                                )}
                                            </div>
                                            <div>
                                                <span className="block font-bold text-gray-700 dark:text-gray-300">Contact Person</span>
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        name="contactPerson"
                                                        value={editForm.contactPerson || ''}
                                                        onChange={handleInputChange}
                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-xs text-gray-900"
                                                    />
                                                ) : (
                                                    selectedLead.contactPerson || '-'
                                                )}
                                            </div>
                                            <div>
                                                <span className="block font-bold text-gray-700 dark:text-gray-300">Industry</span>
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        name="industry"
                                                        value={editForm.industry || ''}
                                                        onChange={handleInputChange}
                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-xs text-gray-900"
                                                    />
                                                ) : (
                                                    selectedLead.industry || '-'
                                                )}
                                            </div>
                                            <div>
                                                <span className="block font-bold text-gray-700 dark:text-gray-300">Lead Type</span>
                                                {isEditing ? (
                                                    <select
                                                        name="leadType"
                                                        value={editForm.leadType || 'Commercial'}
                                                        onChange={handleInputChange}
                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-xs text-gray-900"
                                                    >
                                                        <option value="Commercial">Commercial</option>
                                                        <option value="Residential">Residential</option>
                                                        <option value="Industrial">Industrial</option>
                                                    </select>
                                                ) : (
                                                    selectedLead.leadType || '-'
                                                )}
                                            </div>
                                            <div>
                                                <span className="block font-bold text-gray-700 dark:text-gray-300">Status</span>
                                                {isEditing ? (
                                                    <select
                                                        name="stage"
                                                        value={editForm.stage || 'COLD'}
                                                        onChange={handleInputChange}
                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-xs text-gray-900"
                                                    >
                                                        <option value="COLD">Cold</option>
                                                        <option value="WARM">Warm</option>
                                                        <option value="HOT">Hot</option>
                                                        <option value="QUOTE">Quote</option>
                                                        <option value="WON">Won</option>
                                                        <option value="LOST">Lost</option>
                                                    </select>
                                                ) : (
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    ${(selectedLead.status || selectedLead.stage) === 'WON' ? 'bg-green-100 text-green-800' :
                                                            (selectedLead.status || selectedLead.stage) === 'LOST' ? 'bg-red-100 text-red-800' :
                                                                'bg-gray-100 text-gray-800'}`}>
                                                        {selectedLead.status || selectedLead.stage || 'NEW'}
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <span className="block font-bold text-gray-700 dark:text-gray-300">Branch</span>
                                                {isEditing ? (
                                                    <select
                                                        name="branch"
                                                        value={editForm.branch || 'el-monte'}
                                                        onChange={handleInputChange}
                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-xs text-gray-900"
                                                    >
                                                        {BRANCHES.map(b => (
                                                            <option key={b.id} value={b.id}>{b.name}</option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                                        {BRANCHES.find(b => b.id === selectedLead.branch)?.name || 'Unknown'}
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <span className="block font-bold text-gray-700 dark:text-gray-300">Initial Contact</span>
                                                {selectedLead.dateCollected || new Date(selectedLead.createdAt).toLocaleDateString()}
                                                <span className="text-xs text-gray-500 block">({selectedLead.initialContactMethod || selectedLead.source || 'Unknown'})</span>
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                                            <div className="mb-2">
                                                <span className="block font-bold text-gray-700 dark:text-gray-300">Contact Info</span>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center">
                                                    <span className="font-medium mr-2 w-16">Phone:</span>
                                                    {isEditing ? (
                                                        <div className="flex flex-col gap-1 w-full">
                                                            <input
                                                                type="text"
                                                                name="phone"
                                                                placeholder="Primary"
                                                                value={editForm.phone || ''}
                                                                onChange={handleInputChange}
                                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-xs text-gray-900"
                                                            />
                                                            <input
                                                                type="text"
                                                                name="secondaryPhone"
                                                                placeholder="Secondary"
                                                                value={editForm.secondaryPhone || ''}
                                                                onChange={handleInputChange}
                                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-xs text-gray-900"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col">
                                                            <a href={`tel:${selectedLead.phone}`} className="text-indigo-600 hover:text-indigo-500">{selectedLead.phone || '-'}</a>
                                                            {selectedLead.secondaryPhone && (
                                                                <a href={`tel:${selectedLead.secondaryPhone}`} className="text-xs text-gray-500 hover:text-gray-700">{selectedLead.secondaryPhone} (Alt)</a>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="font-medium mr-2 w-16">Email:</span>
                                                    {isEditing ? (
                                                        <input
                                                            type="text"
                                                            name="email"
                                                            value={editForm.email || ''}
                                                            onChange={handleInputChange}
                                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-xs text-gray-900"
                                                        />
                                                    ) : (
                                                        <a href={`mailto:${selectedLead.email}`} className="text-indigo-600 hover:text-indigo-500">{selectedLead.email || '-'}</a>
                                                    )}
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="font-medium mr-2 w-16">Address:</span>
                                                    {isEditing ? (
                                                        <input
                                                            type="text"
                                                            name="address"
                                                            value={editForm.address || ''}
                                                            onChange={handleInputChange}
                                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-xs text-gray-900"
                                                        />
                                                    ) : (
                                                        <span>{selectedLead.address || '-'}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Staffing Specific Sections */}
                                        <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                                            <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-2">Staffing Intelligence</h4>
                                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded">
                                                    <span className="block text-xs font-medium text-gray-500 uppercase">Hiring Needs</span>
                                                    {isEditing ? (
                                                        <textarea
                                                            name="hiringNeeds"
                                                            value={editForm.hiringNeeds || ''}
                                                            onChange={handleInputChange}
                                                            rows={2}
                                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-xs text-gray-900 mt-1"
                                                        />
                                                    ) : (
                                                        <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">{selectedLead.hiringNeeds || 'Unknown'}</p>
                                                    )}
                                                </div>
                                                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded">
                                                    <span className="block text-xs font-medium text-gray-500 uppercase">Competitor</span>
                                                    {isEditing ? (
                                                        <div className="flex flex-col gap-1 mt-1">
                                                            <input
                                                                type="text"
                                                                name="currentVendor"
                                                                placeholder="Vendor Name"
                                                                value={editForm.currentVendor || ''}
                                                                onChange={handleInputChange}
                                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-xs text-gray-900"
                                                            />
                                                            <input
                                                                type="date"
                                                                name="contractExpiry"
                                                                value={editForm.contractExpiry || ''}
                                                                onChange={handleInputChange}
                                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-xs text-gray-900"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <p className="text-sm text-gray-900 dark:text-white">{selectedLead.currentVendor || 'None'}</p>
                                                            {selectedLead.contractExpiry && (
                                                                <p className="text-xs text-red-500 mt-1">Expires: {new Date(selectedLead.contractExpiry).toLocaleDateString()}</p>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded">
                                                    <span className="block text-xs font-medium text-gray-500 uppercase">Safety Audit</span>
                                                    {isEditing ? (
                                                        <select
                                                            name="safetyStatus"
                                                            value={editForm.safetyStatus || 'PENDING'}
                                                            onChange={handleInputChange}
                                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-xs text-gray-900 mt-1"
                                                        >
                                                            <option value="PENDING">Pending</option>
                                                            <option value="PASS">Pass</option>
                                                            <option value="FAIL">Fail</option>
                                                        </select>
                                                    ) : (
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1
                                                        ${selectedLead.safetyStatus === 'PASS' ? 'bg-green-100 text-green-800' :
                                                                selectedLead.safetyStatus === 'FAIL' ? 'bg-red-100 text-red-800' :
                                                                    'bg-yellow-100 text-yellow-800'}`}>
                                                            {selectedLead.safetyStatus || 'PENDING'}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Rate Calculator Tool */}
                                        <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                                            <RateCalculator />
                                        </div>

                                        {/* Quote Info */}
                                        <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <span className="block font-bold text-gray-700 dark:text-gray-300">Quote Given?</span>
                                                    <span className={selectedLead.quotes?.length > 0 ? "text-green-600 font-semibold" : "text-gray-500"}>
                                                        {selectedLead.quotes?.length > 0 ? "Yes" : "No"}
                                                    </span>
                                                </div>
                                                {selectedLead.quotes?.length > 0 && (
                                                    <div>
                                                        <span className="block font-bold text-gray-700 dark:text-gray-300">Margin</span>
                                                        <span className="text-gray-900 dark:text-white">~20% (Est.)</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {selectedLead.notes && (
                                            <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                                                <span className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Notes</span>
                                                <p className="whitespace-pre-wrap">{selectedLead.notes}</p>
                                            </div>
                                        )}

                                        {selectedLead.activities && selectedLead.activities.length > 0 && (
                                            <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                                                <span className="block font-bold text-gray-700 dark:text-gray-300 mb-2">History & Follow Ups ({selectedLead.activities.length})</span>
                                                <ul className="space-y-2">
                                                    {selectedLead.activities.map((activity: any, idx: number) => (
                                                        <li key={idx} className="text-sm border-l-2 border-indigo-200 pl-3">
                                                            <span className="font-semibold text-gray-500 dark:text-gray-400 block text-xs">
                                                                {new Date(activity.createdAt).toLocaleDateString()} - {activity.type}
                                                            </span>
                                                            <span className="text-gray-800 dark:text-gray-200">{activity.content}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                                    onClick={() => setSelectedLead(null)}
                                >
                                    Close
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                                    onClick={() => {
                                        // Handle Quote creation
                                        setSelectedLead(null);
                                    }}
                                >
                                    Create Quote
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
