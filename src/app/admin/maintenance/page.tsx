'use client';

import { Settings, Database, Server, HardDrive, Cpu, Activity } from 'lucide-react';

export default function MaintenancePage() {
    const systemStatus = {
        database: { status: 'HEALTHY', uptime: '99.9%', lastCheck: new Date() },
        api: { status: 'HEALTHY', uptime: '99.8%', lastCheck: new Date() },
        storage: { status: 'HEALTHY', usage: '45%', total: '100 GB' },
        memory: { status: 'HEALTHY', usage: '62%', total: '16 GB' },
        cpu: { status: 'HEALTHY', usage: '23%', cores: 8 }
    };

    const maintenanceTasks = [
        { id: 1, name: 'Database Optimization', status: 'SCHEDULED', nextRun: '2025-12-08 02:00 AM' },
        { id: 2, name: 'Log Rotation', status: 'COMPLETED', lastRun: '2025-12-07 00:00 AM' },
        { id: 3, name: 'Backup Verification', status: 'COMPLETED', lastRun: '2025-12-07 01:00 AM' },
        { id: 4, name: 'Cache Clear', status: 'SCHEDULED', nextRun: '2025-12-07 12:00 PM' }
    ];

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">System Maintenance</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Monitor system health and manage maintenance tasks
                </p>
            </div>

            {/* System Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Database</h3>
                        <Database className="text-green-600" size={24} />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Status:</span>
                            <span className="text-green-600 font-semibold">{systemStatus.database.status}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Uptime:</span>
                            <span className="text-gray-900 dark:text-white">{systemStatus.database.uptime}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">API Server</h3>
                        <Server className="text-green-600" size={24} />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Status:</span>
                            <span className="text-green-600 font-semibold">{systemStatus.api.status}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Uptime:</span>
                            <span className="text-gray-900 dark:text-white">{systemStatus.api.uptime}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Storage</h3>
                        <HardDrive className="text-blue-600" size={24} />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Usage:</span>
                            <span className="text-gray-900 dark:text-white">{systemStatus.storage.usage}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Total:</span>
                            <span className="text-gray-900 dark:text-white">{systemStatus.storage.total}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Resource Usage */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Memory Usage</h3>
                        <Activity className="text-indigo-600" size={24} />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600 dark:text-gray-400">Current Usage</span>
                            <span className="text-gray-900 dark:text-white">{systemStatus.memory.usage}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div className="bg-indigo-600 h-2 rounded-full" style={{ width: systemStatus.memory.usage }}></div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Total: {systemStatus.memory.total}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">CPU Usage</h3>
                        <Cpu className="text-purple-600" size={24} />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600 dark:text-gray-400">Current Usage</span>
                            <span className="text-gray-900 dark:text-white">{systemStatus.cpu.usage}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div className="bg-purple-600 h-2 rounded-full" style={{ width: systemStatus.cpu.usage }}></div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Cores: {systemStatus.cpu.cores}</p>
                    </div>
                </div>
            </div>

            {/* Maintenance Tasks */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Maintenance Tasks</h2>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {maintenanceTasks.map(task => (
                        <div key={task.id} className="p-6 flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-gray-900 dark:text-white">{task.name}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {task.status === 'SCHEDULED' ? `Next run: ${task.nextRun}` : `Last run: ${task.lastRun}`}
                                </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${task.status === 'COMPLETED'
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                }`}>
                                {task.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-4">
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center">
                    <Settings size={18} className="mr-2" />
                    Run Maintenance
                </button>
                <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                    View Logs
                </button>
            </div>
        </div>
    );
}
