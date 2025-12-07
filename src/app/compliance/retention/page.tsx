'use client';

import { Trash2, Shield, Calendar, Save } from 'lucide-react';

export default function Page() {
    return (
        <div className="p-6 space-y-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Data Retention Policies</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Automatic data clearing configuration</p>
            </div>
            
         <div className="max-w-3xl">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6 text-sm text-gray-600 dark:text-gray-300">
               <p className="flex items-start"><Shield className="mr-3 text-indigo-600 flex-shrink-0" size={20} /> Data retention policies ensure compliance with CCPA. Data older than the specified period will be automatically archived or deleted.</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow divide-y divide-gray-200 dark:divide-gray-700">
               {[
                  { type: 'Lead Data (Non-Converted)', current: '90 Days', legal: 'CCPA Limit: 12 months' },
                  { type: 'Call Recordings', current: '30 Days', legal: 'Storage Cost Optimization' },
                  { type: 'Email History', current: '6 Months', legal: 'Communication Audit' },
                  { type: 'Inactive User Accounts', current: '1 Year', legal: 'Internal Policy' },
               ].map((policy, i) => (
                  <div key={i} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                     <div>
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">{policy.type}</h4>
                        <p className="text-xs text-gray-500 mt-1">{policy.legal}</p>
                     </div>
                     <div className="flex items-center space-x-3">
                        <select className="border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 text-sm">
                           <option>{policy.current}</option>
                           <option>30 Days</option>
                           <option>60 Days</option>
                           <option>90 Days</option>
                           <option>6 Months</option>
                           <option>1 Year</option>
                        </select>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-md" title="Purge Now">
                           <Trash2 size={18} />
                        </button>
                     </div>
                  </div>
               ))}
            </div>
            <div className="mt-6 flex justify-end">
               <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                  <Save size={18} className="mr-2" /> Save Policies
               </button>
            </div>
         </div>
      
        </div>
    );
}
