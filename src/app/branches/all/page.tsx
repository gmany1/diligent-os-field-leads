import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'All Branches | DiligentOS',
    description: 'View and manage all branches',
};

export default function AllBranchesPage() {
    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">All Branches</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    View and manage all company branches
                </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Branch cards will be populated here */}
                    <div className="text-center text-gray-500 dark:text-gray-400 col-span-full py-12">
                        Branch management coming soon...
                    </div>
                </div>
            </div>
        </div>
    );
}
