'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export default function AllQuotesPage() {
    const router = useRouter();
    const { data: quotes = [], isLoading } = useQuery({
        queryKey: ['all-quotes'],
        queryFn: async () => {
            const res = await fetch('/api/quotes');
            if (!res.ok) throw new Error('Failed to fetch quotes');
            return res.json();
        }
    });

    if (isLoading) return <div className="p-8">Loading Quotes...</div>;

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Quotes</h1>
                <button
                    onClick={() => router.push('/quotes/create')} // This might fail if no lead selected, but page handles it
                    className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700"
                >
                    Create Quote
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Lead ID</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {quotes.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">No quotes found.</td>
                            </tr>
                        ) : (
                            quotes.map((quote: any) => (
                                <tr key={quote.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${quote.status === 'SENT' ? 'bg-blue-100 text-blue-800' :
                                                quote.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                                                    'bg-gray-100 text-gray-800'}`}>
                                            {quote.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                        ${quote.amount.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(quote.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <button
                                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400"
                                            onClick={() => router.push(`/leads/${quote.leadId}`)}
                                        >
                                            {quote.leadId.substring(0, 8)}...
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
