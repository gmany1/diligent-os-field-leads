import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'My Branch | DiligentOS',
    description: 'Manage your branch',
};

export default function MyBranchPage() {
    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Branch</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Manage your branch operations and team
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Branch Info */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Branch Information</h2>
                    <div className="text-gray-500 dark:text-gray-400">
                        Branch details will be displayed here...
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Active Leads</p>
                            <p className="text-2xl font-bold">--</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Team Members</p>
                            <p className="text-2xl font-bold">--</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">This Month</p>
                            <p className="text-2xl font-bold">--</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
