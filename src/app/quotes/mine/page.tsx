import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'My Quotes | DiligentOS',
    description: 'View your quotes',
};

export default function MyQuotesPage() {
    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Quotes</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    View and manage quotes you've created
                </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="text-center text-gray-500 dark:text-gray-400 py-12">
                    Your quotes will appear here...
                </div>
            </div>
        </div>
    );
}
