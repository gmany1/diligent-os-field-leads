'use client';

import { Search, FileText, Download, Filter, RefreshCw } from 'lucide-react';

export default function Page() {
    return (
        <div className="p-6 space-y-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Observability</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">System logs and tracing metrics</p>
            </div>
            
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
             <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input type="text" placeholder="Search logs..." className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700" />
                </div>
                <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                  <Filter size={16} />
                </button>
             </div>
             <div className="flex space-x-2">
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded"><RefreshCw size={16} /></button>
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded"><Download size={16} /></button>
             </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-gray-700 text-xs uppercase text-gray-500 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3">Timestamp</th>
                <th className="px-6 py-3">Level</th>
                <th className="px-6 py-3">Service</th>
                <th className="px-6 py-3">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {[
                  { time: '2025-12-07 10:45:22', level: 'INFO', service: 'api-gateway', msg: 'Request received from 192.168.1.4' },
                  { time: '2025-12-07 10:45:21', level: 'DEBUG', service: 'auth-service', msg: 'Token validated successfully' },
                  { time: '2025-12-07 10:44:58', level: 'WARN', service: 'db-pool', msg: 'Connection pool usage at 85%' },
                  { time: '2025-12-07 10:44:12', level: 'INFO', service: 'notification', msg: 'Email sent to user_123' },
              ].map((log, i) => (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 font-mono text-gray-600 dark:text-gray-400">{log.time}</td>
                  <td className="px-6 py-4">
                    <span className={"px-2 py-1 round text-xs font-bold " + (log.level === 'INFO' ? 'bg-blue-100 text-blue-800' : log.level === 'WARN' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800')}>
                      {log.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">{log.service}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{log.msg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    
        </div>
    );
}
