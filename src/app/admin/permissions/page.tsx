'use client';

import { Shield, Lock, Unlock, Check } from 'lucide-react';

export default function Page() {
    return (
        <div className="p-6 space-y-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Role Permissions</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Matrix of access rights per role</p>
            </div>
            
         <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
            <table className="w-full text-sm">
               <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                     <th className="px-6 py-4 text-left font-medium text-gray-500 uppercase tracking-wider">Permission</th>
                     <th className="px-6 py-4 text-center font-medium text-gray-500">Admin</th>
                     <th className="px-6 py-4 text-center font-medium text-gray-500">Manager</th>
                     <th className="px-6 py-4 text-center font-medium text-gray-500">Rep</th>
                     <th className="px-6 py-4 text-center font-medium text-gray-500">Viewer</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {[
                     'View Leads',
                     'Create Leads',
                     'Delete Leads',
                     'View Reports',
                     'Manage Users',
                     'System Settings'
                  ].map((perm, i) => (
                     <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{perm}</td>
                        <td className="px-6 py-4 text-center text-green-600"><Check size={18} className="mx-auto" /></td>
                        <td className="px-6 py-4 text-center">
                           {i > 4 ? <span className="text-gray-300">-</span> : <Check size={18} className="mx-auto text-green-600" />}
                        </td>
                        <td className="px-6 py-4 text-center">
                           {i > 2 ? <span className="text-gray-300">-</span> : <Check size={18} className="mx-auto text-green-600" />}
                        </td>
                        <td className="px-6 py-4 text-center">
                            {i === 0 || i === 3 ? <Check size={18} className="mx-auto text-green-600" /> : <span className="text-gray-300">-</span>}
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      
        </div>
    );
}
