'use client';

import { DollarSign, Briefcase, TrendingUp } from 'lucide-react';

export default function Page() {
    return (
        <div className="p-6 space-y-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Pipeline Summary</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Overview of all active opportunities</p>
            </div>
            
         <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
               {[
                  { label: 'Total Value', val: '$1.2M', sub: 'Active Pipeline' },
                  { label: 'Weighted Value', val: '$480K', sub: 'Probability Adjusted' },
                  { label: 'Avg Deal Size', val: '$12.5K', sub: 'Per Opportunity' },
                  { label: 'Open Deals', val: '86', sub: 'Active Opportunities' },
               ].map((c, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                      <p className="text-sm text-gray-500">{c.label}</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{c.val}</p>
                      <p className="text-xs text-indigo-600 mt-1">{c.sub}</p>
                  </div>
               ))}
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
               <h3 className="text-lg font-bold mb-4">Pipeline by Stage</h3>
               <div className="space-y-6">
                  {[
                     { stage: 'Discovery', val: '$250k', pct: 20 },
                     { stage: 'Qualification', val: '$350k', pct: 30 },
                     { stage: 'Proposal', val: '$400k', pct: 35 },
                     { stage: 'Negotiation', val: '$200k', pct: 15 },
                  ].map((s, i) => (
                     <div key={i}>
                        <div className="flex justify-between text-sm font-medium mb-1">
                           <span className="text-gray-700 dark:text-gray-300">{s.stage}</span>
                           <span className="text-gray-900 dark:text-white">{s.val}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                           <div className="h-full bg-indigo-600" style={{ width: s.pct + "%" }}></div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      
        </div>
    );
}
