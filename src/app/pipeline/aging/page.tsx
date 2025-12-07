'use client';

import { Clock, BarChart2, AlertCircle } from 'lucide-react';

export default function Page() {
    return (
        <div className="p-6 space-y-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Aging Report</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Time-in-stage analysis</p>
            </div>
            
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-bold mb-6">Average Time in Stage</h3>
              <div className="space-y-4">
                 {[
                    { stage: 'Discovery', days: 12, avg: 10, status: 'Normal' },
                    { stage: 'Qualification', days: 18, avg: 14, status: 'Slow' },
                    { stage: 'Proposal', days: 8, avg: 10, status: 'Fast' },
                    { stage: 'Negotiation', days: 25, avg: 15, status: 'Critical' },
                 ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded bg-gray-50 dark:bg-gray-700/30">
                       <span className="font-medium text-gray-700 dark:text-gray-300 w-1/3">{s.stage}</span>
                       <div className="flex-1 px-4">
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                             <div className={"h-full " + (s.status === 'Critical' ? 'bg-red-500' : s.status === 'Slow' ? 'bg-yellow-500' : 'bg-green-500')} style={{ width: (s.days / 30) * 100 + "%" }}></div>
                          </div>
                       </div>
                       <div className="w-16 text-right font-bold text-gray-900 dark:text-white">{s.days} days</div>
                    </div>
                 ))}
              </div>
           </div>
           
           <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
               <h3 className="text-lg font-bold mb-4">Slowest Moving Deals</h3>
               <div className="divide-y divide-gray-100">
                  {[
                     { name: 'Massive Dynamic Corp', stage: 'Negotiation', days: 45 },
                     { name: 'Cyberdyne Systems', stage: 'Qualification', days: 38 },
                     { name: 'Umbrella Corp', stage: 'Discovery', days: 32 },
                  ].map((d, i) => (
                     <div key={i} className="py-3 flex justify-between items-center">
                        <div>
                           <p className="font-medium text-gray-900 dark:text-white">{d.name}</p>
                           <p className="text-xs text-gray-500">{d.stage}</p>
                        </div>
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-bold rounded">{d.days} days</span>
                     </div>
                  ))}
               </div>
           </div>
        </div>
      
        </div>
    );
}
