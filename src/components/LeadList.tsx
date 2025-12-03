'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { BRANCHES } from '@/lib/constants';

interface Lead {
    id: string;
    name: string;
    company?: string;
    phone?: string;
    email?: string;
    status: string;
    stage: string;
    createdAt: string;
    lastContactedAt?: string;
    industry?: string;
    source?: string;
    address?: string;
    dateCollected?: string;
    branch?: string; // Added branch
}

interface LeadListProps {
    onLeadClick: (id: string) => void;
    onQuoteClick: (id: string) => void;
    onEmailClick: (id: string) => void;
    onCallClick: (id: string) => void; // Added
    onDeleteClick: (id: string) => void;
    onStatusChange: (id: string, status: string) => void;
    initialStageFilter?: string | null;
    branchFilter?: string;
}

export default function LeadList({ onLeadClick, onQuoteClick, onEmailClick, onCallClick, onDeleteClick, onStatusChange, initialStageFilter, branchFilter = 'ALL' }: LeadListProps) {
    // ... existing state ...
    const [search, setSearch] = useState(initialStageFilter || '');
    const [page, setPage] = useState(1);
    const [limit] = useState(20);

    // Filter State
    const [showFilters, setShowFilters] = useState(false);
    const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
    const [selectedQuarter, setSelectedQuarter] = useState<string>('ALL');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    // Debounce search (simplified for this example, could use a hook)
    const [debouncedSearch, setDebouncedSearch] = useState(initialStageFilter || '');

    // Effect to update debounced search when prop changes
    if (initialStageFilter && debouncedSearch !== initialStageFilter) {
        setDebouncedSearch(initialStageFilter);
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        // Simple debounce
        setTimeout(() => setDebouncedSearch(e.target.value), 500);
    };

    // Handle Year/Quarter Logic
    const updateDateRange = (year: string, quarter: string) => {
        if (quarter === 'ALL') {
            setStartDate(`${year}-01-01`);
            setEndDate(`${year}-12-31`);
        } else {
            const qMap: Record<string, [string, string]> = {
                'Q1': ['01-01', '03-31'],
                'Q2': ['04-01', '06-30'],
                'Q3': ['07-01', '09-30'],
                'Q4': ['10-01', '12-31'],
            };
            const [start, end] = qMap[quarter];
            setStartDate(`${year}-${start}`);
            setEndDate(`${year}-${end}`);
        }
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const year = e.target.value;
        setSelectedYear(year);
        updateDateRange(year, selectedQuarter);
    };

    const handleQuarterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const quarter = e.target.value;
        setSelectedQuarter(quarter);
        updateDateRange(selectedYear, quarter);
    };

    const clearFilters = () => {
        setSelectedYear(new Date().getFullYear().toString());
        setSelectedQuarter('ALL');
        setStartDate('');
        setEndDate('');
        setSearch('');
        setDebouncedSearch('');
    };

    const { data, isLoading, isError } = useQuery({
        queryKey: ['leads', page, debouncedSearch, startDate, endDate, branchFilter], // Added branchFilter to key
        queryFn: async () => {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                search: debouncedSearch,
                ...(startDate && { startDate }),
                ...(endDate && { endDate }),
                branch: branchFilter, // Added param
            });
            const res = await fetch(`/api/leads?${params}`);
            if (!res.ok) throw new Error('Failed to fetch leads');
            return res.json();
        },
    });

    const leads: Lead[] = data?.data || [];
    const meta = data?.meta || { total: 0, totalPages: 1 };

    // Helper to get branch name
    const getBranchName = (id?: string) => BRANCHES.find(b => b.id === id)?.name || 'Unknown';


    if (isLoading) return <div className="p-8 text-center text-gray-500">Loading leads...</div>;
    if (isError) return <div className="p-8 text-center text-red-500">Error loading leads.</div>;

    return (
        <div className="space-y-4">
            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        className="block w-full rounded-md border-0 py-2.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-800 dark:text-white dark:ring-gray-700"
                        placeholder="Search leads..."
                        value={search}
                        onChange={handleSearchChange}
                    />
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm 
                    ${showFilters ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'} 
                    dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600`}
                >
                    <svg className="-ml-1 mr-2 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.591L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z" clipRule="evenodd" />
                    </svg>
                    Filters
                </button>
            </div>

            {/* Filter Panel */}
            {showFilters && (
                <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg border border-gray-200 dark:border-gray-700 grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Year</label>
                        <select
                            value={selectedYear}
                            onChange={handleYearChange}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-800 dark:text-white dark:ring-gray-600"
                        >
                            {[2023, 2024, 2025, 2026].map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Quarter</label>
                        <select
                            value={selectedQuarter}
                            onChange={handleQuarterChange}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-800 dark:text-white dark:ring-gray-600"
                        >
                            <option value="ALL">All Quarters</option>
                            <option value="Q1">Q1 (Jan-Mar)</option>
                            <option value="Q2">Q2 (Apr-Jun)</option>
                            <option value="Q3">Q3 (Jul-Sep)</option>
                            <option value="Q4">Q4 (Oct-Dec)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Custom Start</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-800 dark:text-white dark:ring-gray-600"
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={clearFilters}
                            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 underline"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>
            )}

            {/* Mobile-First List */}
            <div className="bg-white dark:bg-gray-800 shadow sm:rounded-md overflow-hidden">
                <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                    {leads.length === 0 ? (
                        <li className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                            No leads found matching "{debouncedSearch}".
                        </li>
                    ) : (
                        leads.map((lead) => (
                            <li key={lead.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <div className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onLeadClick(lead.id)}>
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 truncate">
                                                    {lead.name}
                                                </p>
                                                <div className="ml-2 flex-shrink-0 flex">
                                                    <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${lead.stage === 'WON' ? 'bg-green-100 text-green-800' :
                                                            lead.stage === 'LOST' ? 'bg-red-100 text-red-800' :
                                                                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                                                        {lead.stage}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="mt-1 flex items-center gap-2">
                                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                                    {lead.company || lead.industry || 'No Company'}
                                                </p>
                                                {lead.branch && (
                                                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                                        {getBranchName(lead.branch)}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                                                {lead.phone && (
                                                    <span className="mr-4 flex items-center">
                                                        <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z" clipRule="evenodd" />
                                                        </svg>
                                                        {lead.phone}
                                                    </span>
                                                )}
                                                <span className="flex items-center">
                                                    <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" />
                                                    </svg>
                                                    {lead.dateCollected || new Date(lead.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Quick Actions */}
                                        <div className="ml-4 flex-shrink-0 flex flex-col gap-2">
                                            <button
                                                onClick={() => onQuoteClick(lead.id)}
                                                className="text-xs font-medium text-indigo-600 hover:text-indigo-500 bg-indigo-50 px-2 py-1 rounded border border-indigo-100"
                                            >
                                                Quote
                                            </button>
                                            <button
                                                onClick={() => onEmailClick(lead.id)}
                                                className="text-xs font-medium text-purple-600 hover:text-purple-500 bg-purple-50 px-2 py-1 rounded border border-purple-100"
                                            >
                                                Email
                                            </button>
                                            {lead.phone && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onCallClick(lead.id);
                                                    }}
                                                    className="text-xs font-medium text-green-600 hover:text-green-500 bg-green-50 px-2 py-1 rounded border border-green-100 text-center"
                                                >
                                                    Call
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </div>

            {/* Pagination Controls */}
            {meta.totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 sm:px-6 rounded-lg shadow">
                    <div className="flex flex-1 justify-between sm:hidden">
                        <button
                            onClick={() => setPage(Math.max(1, page - 1))}
                            disabled={page === 1}
                            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-700 dark:text-gray-300 self-center">
                            Page {page} of {meta.totalPages}
                        </span>
                        <button
                            onClick={() => setPage(Math.min(meta.totalPages, page + 1))}
                            disabled={page === meta.totalPages}
                            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to <span className="font-medium">{Math.min(page * limit, meta.total)}</span> of{' '}
                                <span className="font-medium">{meta.total}</span> results
                            </p>
                        </div>
                        <div>
                            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                <button
                                    onClick={() => setPage(Math.max(1, page - 1))}
                                    disabled={page === 1}
                                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                                >
                                    <span className="sr-only">Previous</span>
                                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 focus:outline-offset-0 dark:text-white dark:ring-gray-600">
                                    {page}
                                </span>
                                <button
                                    onClick={() => setPage(Math.min(meta.totalPages, page + 1))}
                                    disabled={page === meta.totalPages}
                                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                                >
                                    <span className="sr-only">Next</span>
                                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
