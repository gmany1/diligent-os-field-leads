import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Branch Performance | DiligentOS',
    description: 'Compare branch performance metrics',
};

export default function BranchPerformancePage() {
    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Branch Performance</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Compare performance metrics across all branches
                </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="text-center text-gray-500 dark:text-gray-400 py-12">
                    Performance analytics coming soon...
                </div>
            </div>
        </div>
    );
}
