'use client';

export default function PendingHandoffs() {
    return (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 h-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Pending Hand-offs</h3>
                <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-indigo-900 dark:text-indigo-300">
                    2 Pending
                </span>
            </div>

            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                <li className="py-3 flex justify-between items-center">
                    <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Logistics Solutions Inc</p>
                        <p className="text-xs text-gray-500">Won by Manuel Cardenas • 2 hours ago</p>
                    </div>
                    <button className="text-sm text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 font-medium">
                        Review
                    </button>
                </li>
                <li className="py-3 flex justify-between items-center">
                    <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Healthcare Plus</p>
                        <p className="text-xs text-gray-500">Won by Manuel Cardenas • 5 hours ago</p>
                    </div>
                    <button className="text-sm text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 font-medium">
                        Review
                    </button>
                </li>
            </ul>

            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <p className="text-xs text-gray-500 text-center">
                    These clients are ready for recruitment onboarding.
                </p>
            </div>
        </div>
    );
}
