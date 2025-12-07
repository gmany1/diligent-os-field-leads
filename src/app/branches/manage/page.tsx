import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Manage Branches | DiligentOS',
    description: 'Create and manage branches',
};

export default function ManageBranchesPage() {
    return (
        <div className="p-6">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Branches</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Create, edit, and manage company branches
                    </p>
                </div>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                    + Add Branch
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="text-center text-gray-500 dark:text-gray-400 py-12">
                    Branch management interface coming soon...
                </div>
            </div>
        </div>
    );
}
