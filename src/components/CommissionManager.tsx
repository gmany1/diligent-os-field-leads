'use client';

import { useQuery } from '@tanstack/react-query';

async function fetchCommissions() {
    const res = await fetch('/api/commissions');
    if (!res.ok) throw new Error('Failed to fetch commissions');
    return res.json();
}

export default function CommissionManager() {
    const { data: commissions, isLoading } = useQuery({ queryKey: ['commissions'], queryFn: fetchCommissions });

    if (isLoading) return <div>Loading Commissions...</div>;

    // Real Logic
    const pendingCommissions = commissions?.filter((c: any) => c.status === 'PENDING') || [];
    const paidCommissions = commissions?.filter((c: any) => c.status === 'PAID') || [];

    const totalPending = pendingCommissions.reduce((sum: number, c: any) => sum + c.amount, 0);
    const totalPaid = paidCommissions.reduce((sum: number, c: any) => sum + c.amount, 0);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Commission Manager</h2>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 dark:bg-gray-800">
                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">Pending Commissions</dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-yellow-600 dark:text-yellow-400">${totalPending.toFixed(2)}</dd>
                    <p className="mt-2 text-sm text-gray-500">Estimated payout: Next Friday</p>
                </div>
                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 dark:bg-gray-800">
                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">Paid (YTD)</dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-green-600 dark:text-green-400">${totalPaid.toFixed(2)}</dd>
                    <p className="mt-2 text-sm text-gray-500">Last payment: $0.00</p>
                </div>
            </div>

            <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-base font-semibold leading-6 text-gray-900 dark:text-white">Recent Commission History</h3>
                    <div className="mt-4 flow-root">
                        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                                    <thead>
                                        <tr>
                                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-0">Date</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Lead ID</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Rate</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Amount</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {commissions?.map((commission: any) => {
                                            const status = commission.status === 'PAID' ? 'Paid' : 'Pending';

                                            return (
                                                <tr key={commission.id}>
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-0">
                                                        {new Date(commission.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">{commission.leadId}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                        {typeof commission.rateApplied === 'number' ? `${(commission.rateApplied * 100).toFixed(0)}%` : commission.rateApplied}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">${commission.amount.toFixed(2)}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${status === 'Paid' ? 'bg-green-50 text-green-700 ring-green-600/20' : 'bg-yellow-50 text-yellow-800 ring-yellow-600/20'}`}>
                                                            {status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
