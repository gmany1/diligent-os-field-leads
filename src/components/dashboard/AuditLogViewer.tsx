'use client';

const LOGS = [
    { id: 1, action: 'LOGIN_SUCCESS', user: 'Doris (Admin)', details: 'IP: 192.168.1.1', time: '2 mins ago', status: 'SUCCESS' },
    { id: 2, action: 'LEAD_IMPORT', user: 'Doris (Admin)', details: 'Imported 100 leads from leads_feria.xlsx', time: '15 mins ago', status: 'SUCCESS' },
    { id: 3, action: 'API_ERROR', user: 'System', details: 'Timeout on /api/enrich', time: '1 hour ago', status: 'FAILURE' },
    { id: 4, action: 'USER_CREATED', user: 'Doris (Admin)', details: 'Created user: John Smith', time: '2 hours ago', status: 'SUCCESS' },
    { id: 5, action: 'LOGIN_FAILED', user: 'Unknown', details: 'Invalid password attempt', time: '3 hours ago', status: 'WARNING' },
];

export default function AuditLogViewer() {
    return (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden h-full">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Audit Logs (Support)</h3>
                <button className="text-sm text-indigo-600 hover:text-indigo-900 dark:text-indigo-400">View All Logs</button>
            </div>
            <div className="overflow-hidden">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {LOGS.map((log) => (
                        <li key={log.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex items-start gap-3">
                                    <div className={`mt-1 h-2 w-2 rounded-full ${log.status === 'SUCCESS' ? 'bg-green-500' :
                                            log.status === 'FAILURE' ? 'bg-red-500' : 'bg-yellow-500'
                                        }`} />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {log.action} <span className="text-gray-500 font-normal">by {log.user}</span>
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5">{log.details}</p>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-400 whitespace-nowrap">{log.time}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
