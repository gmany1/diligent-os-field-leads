'use client';

import { Users, DollarSign, Award, TrendingUp } from 'lucide-react';

export default function Page() {
    return (
        <div className="p-6 space-y-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Team Commissions</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Manager overview of team earnings</p>
            </div>
            
         <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
               <table className="w-full text-left">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                     <tr>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Rep Name</th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-right">Revenue Generated</th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-right">Commission Rate</th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-right">Earned</th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-center">Status</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                     {[
                        { name: 'Sarah Jenkins', rev: '$124,000', rate: '10%', earned: '$12,400', status: 'Paid' },
                        { name: 'Michael Thompson', rev: '$98,500', rate: '10%', earned: '$9,850', status: 'Processing' },
                        { name: 'Jessica Rodriguez', rev: '$145,200', rate: '12%', earned: '$17,424', status: 'Paid' },
                        { name: 'Bill Lumbergh', rev: '$45,000', rate: '8%', earned: '$3,600', status: 'Pending' },
                     ].map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                           <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{row.name}</td>
                           <td className="px-6 py-4 text-right text-gray-600 font-mono">{row.rev}</td>
                           <td className="px-6 py-4 text-right">{row.rate}</td>
                           <td className="px-6 py-4 text-right font-bold text-green-600">{row.earned}</td>
                           <td className="px-6 py-4 text-center">
                              <span className={"text-xs px-2 py-1 rounded-full font-semibold " + (row.status === 'Paid' ? 'bg-green-100 text-green-800' : row.status === 'Processing' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800')}>
                                 {row.status}
                              </span>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      
        </div>
    );
}
