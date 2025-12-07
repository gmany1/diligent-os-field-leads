'use client';

import { CheckCircle, XCircle, AlertTriangle, Server, Wifi, Activity } from 'lucide-react';

export default function Page() {
    return (
        <div className="p-6 space-y-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">System Status</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Real-time operational status of all system components</p>
            </div>
            
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Component Status</h2>
          <div className="space-y-4">
            {[
              { name: 'API Gateway', status: 'Operational', icon: Server },
              { name: 'Database Primary', status: 'Operational', icon: Server },
              { name: 'Storage Service', status: 'Operational', icon: Server },
              { name: 'Notification Service', status: 'Operational', icon: Wifi },
              { name: 'Authentication', status: 'Operational', icon: CheckCircle },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <item.icon className="text-gray-500" size={20} />
                  <span className="font-medium text-gray-900 dark:text-white">{item.name}</span>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Active Incidents</h2>
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <CheckCircle className="text-green-500 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">All Systems Operational</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">There are no active incidents at this time.</p>
          </div>
        </div>
      </div>
    
        </div>
    );
}
