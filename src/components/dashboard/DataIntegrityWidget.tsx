'use client';

export default function DataIntegrityWidget() {
    return (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 h-full">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Data Integrity</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
                    <dt className="text-xs font-medium text-green-800 dark:text-green-300 uppercase tracking-wider">Verified Leads</dt>
                    <dd className="mt-1 text-2xl font-bold text-green-900 dark:text-green-100">1,250</dd>
                </div>
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-100 dark:border-yellow-800">
                    <dt className="text-xs font-medium text-yellow-800 dark:text-yellow-300 uppercase tracking-wider">No Contact Info</dt>
                    <dd className="mt-1 text-2xl font-bold text-yellow-900 dark:text-yellow-100">45</dd>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800">
                    <dt className="text-xs font-medium text-red-800 dark:text-red-300 uppercase tracking-wider">Duplicates</dt>
                    <dd className="mt-1 text-2xl font-bold text-red-900 dark:text-red-100">3</dd>
                </div>
            </div>
        </div>
    );
}
