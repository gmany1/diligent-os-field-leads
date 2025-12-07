'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import QuoteGenerator from '@/components/QuoteGenerator';
import { useRouter } from 'next/navigation';

function CreateQuoteContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const leadId = searchParams.get('leadId');

    const handleQuoteCreated = () => {
        router.push('/quotes/all');
    };

    if (!leadId) {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Create Quote</h1>
                <div className="p-4 border border-yellow-200 bg-yellow-50 text-yellow-800 rounded-lg">
                    Please select a lead first to create a quote.
                    <button
                        onClick={() => router.push('/leads/all')}
                        className="ml-4 underline font-medium"
                    >
                        Go to Leads
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Create Quote</h1>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                <p className="mb-4 text-gray-600 dark:text-gray-300">
                    Drafting quote for Lead ID: <span className="font-mono text-sm bg-gray-100 px-1 py-0.5 rounded">{leadId}</span>
                </p>
                <QuoteGenerator leadId={leadId} onQuoteCreated={handleQuoteCreated} />
            </div>
        </div>
    );
}

export default function CreateQuotePage() {
    return (
        <Suspense fallback={<div className="p-8">Loading...</div>}>
            <CreateQuoteContent />
        </Suspense>
    );
}
