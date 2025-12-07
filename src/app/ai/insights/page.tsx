'use client';

import { Lightbulb, ThumbsUp, X, ArrowRight } from 'lucide-react';

export default function Page() {
    return (
        <div className="p-6 space-y-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Smart Insights</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Automated business recommendations</p>
            </div>
            
         <div className="space-y-4">
            {[
               { title: 'Follow up with precision', body: 'Leads contacted on Tuesday mornings have a 20% higher conversion rate. Schedule your calls for tomorrow 9 AM.', type: 'Optimization' },
               { title: 'Re-engage cold lead', body: 'InterTech Systems viewed the pricing page yesterday but has not replied to emails. Send a check-in now.', type: 'Alert' },
               { title: 'Upsell Opportunity', body: 'Client "Global Corp" is nearing their usage limit. Good time to propose the Enterprise plan.', type: 'Growth' },
            ].map((card, i) => (
               <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-indigo-500">
                  <div className="flex justify-between items-start">
                     <div className="flex items-start space-x-4">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded text-indigo-600">
                           <Lightbulb size={24} />
                        </div>
                        <div>
                           <h3 className="font-bold text-lg text-gray-900 dark:text-white">{card.title}</h3>
                           <span className="text-xs uppercase tracking-wide text-gray-500 font-semibold">{card.type}</span>
                           <p className="mt-2 text-gray-600 dark:text-gray-300">{card.body}</p>
                        </div>
                     </div>
                     <div className="flex space-x-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full border border-gray-200"><X size={16} /></button>
                        <button className="p-2 text-green-600 hover:bg-green-50 rounded-full border border-green-200"><ThumbsUp size={16} /></button>
                     </div>
                  </div>
                  <div className="mt-4 pl-14">
                      <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center">
                         Take Action <ArrowRight size={16} className="ml-1" />
                      </button>
                  </div>
               </div>
            ))}
         </div>
      
        </div>
    );
}
