'use client';

export default function LeadMapWidget() {
    return (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 h-full relative overflow-hidden">
            <div className="absolute top-6 left-6 z-10">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Expansion Map</h3>
                <p className="text-sm text-gray-500">Active Clients by Region</p>
            </div>

            {/* Abstract Map Visualization */}
            <div className="w-full h-full min-h-[300px] bg-indigo-50 dark:bg-gray-900 rounded-lg flex items-center justify-center relative">
                {/* California Cluster */}
                <div className="absolute left-1/4 top-1/3">
                    <div className="w-32 h-32 bg-indigo-200/50 rounded-full blur-xl absolute animate-pulse"></div>
                    <div className="relative z-10 text-center">
                        <span className="block text-2xl font-bold text-indigo-900 dark:text-indigo-300">CA</span>
                        <span className="text-xs font-medium text-indigo-700 dark:text-indigo-400">High Activity</span>
                        <div className="mt-1 flex justify-center gap-1">
                            <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                            <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                            <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                        </div>
                    </div>
                </div>

                {/* Texas Cluster */}
                <div className="absolute right-1/3 bottom-1/3">
                    <div className="w-24 h-24 bg-yellow-200/50 rounded-full blur-xl absolute"></div>
                    <div className="relative z-10 text-center">
                        <span className="block text-2xl font-bold text-yellow-900 dark:text-yellow-300">TX</span>
                        <span className="text-xs font-medium text-yellow-700 dark:text-yellow-400">Emerging</span>
                        <div className="mt-1 flex justify-center gap-1">
                            <span className="w-2 h-2 bg-yellow-600 rounded-full"></span>
                        </div>
                    </div>
                </div>

                {/* Connection Line */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <path d="M 200 150 Q 350 100 450 250" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" fill="none" />
                </svg>
            </div>

            <div className="absolute bottom-6 right-6 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 text-xs">
                <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                    <span>Established (4 Branches)</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-600 rounded-full"></span>
                    <span>New Market (1 Branch)</span>
                </div>
            </div>
        </div>
    );
}
