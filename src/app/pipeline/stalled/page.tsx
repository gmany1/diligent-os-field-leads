'use client';

import { AlertTriangle, Clock, ArrowRight } from 'lucide-react';

export default function Page() {
    return (
        <div className="p-6 space-y-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Stalled Opportunities</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Deals with no activity for 14+ days</p>
            </div>
            
         <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border-b border-red-100 flex justify-between items-center">
               <div className="flex items-center text-red-800 dark:text-red-200">
                  <AlertTriangle size={20} className="mr-2" />
                  <span className="font-medium">24 Opportunities require attention</span>
               </div>
               <button className="text-sm text-red-700 font-medium hover:underline">View All</button>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
               {[
                  { name: 'Acme Corp Renewal', value: '$45,000', days: 18, stage: 'Negotiation', owner: 'Sarah J.' },
                  { name: 'Globex Enterprise Lic', value: '$120,000', days: 22, stage: 'Proposal', owner: 'Mike T.' },
                  { name: 'Soylent Corp Deal', value: '$15,000', days: 15, stage: 'Discovery', owner: 'Jessica R.' },
                  { name: 'Initech Upgrade', value: '$28,000', days: 30, stage: 'Qualification', owner: 'Bill L.' },
               ].map((deal, i) => (
                  <div key={i} className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50">
                     <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">{deal.name}</h4>
                        <p className="text-sm text-gray-500 mt-1">{deal.stage} • Owned by {deal.owner}</p>
                     </div>
                     <div className="flex items-center space-x-6">
                        <div className="text-right">
                           <p className="font-bold text-gray-900 dark:text-white">{deal.value}</p>
                           <p className="text-sm text-red-600 font-medium flex items-center justify-end">
                              <Clock size={14} className="mr-1" /> {deal.days} days inactive
                           </p>
                        </div>
                        <button className="p-2 text-gray-400 hover:text-indigo-600">
                           <ArrowRight size={20} />
                        </button>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      
        </div>
    );
}
