'use client';

import { Plug, CheckCircle, RefreshCw, ExternalLink } from 'lucide-react';

export default function Page() {
    return (
        <div className="p-6 space-y-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Integrations</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Manage connections to external services</p>
            </div>
            
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
               { name: 'Google Workspace', status: 'Connected', desc: 'Sync calendars and email' },
               { name: 'Slack', status: 'Connected', desc: 'Channel notifications' },
               { name: 'Stripe', status: 'Active', desc: 'Payment processing' },
               { name: 'QuickBooks', status: 'Disconnected', desc: 'Accounting sync' },
               { name: 'Twilio', status: 'Connected', desc: 'SMS and Voice' },
               { name: 'Zapier', status: 'Disconnected', desc: 'Automation workflows' },
            ].map((app, i) => (
               <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col justify-between h-48">
                  <div className="flex justify-between items-start">
                     <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <Plug size={24} className="text-gray-600 dark:text-gray-300" />
                     </div>
                     <span className={"px-2 py-1 text-xs rounded-full " + (app.status === 'Connected' || app.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600')}>
                        {app.status}
                     </span>
                  </div>
                  <div>
                     <h3 className="font-bold text-gray-900 dark:text-white">{app.name}</h3>
                     <p className="text-sm text-gray-500">{app.desc}</p>
                  </div>
                  <button className="w-full mt-4 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700">
                     {app.status === 'Disconnected' ? 'Connect' : 'Manage'}
                  </button>
               </div>
            ))}
         </div>
      
        </div>
    );
}
