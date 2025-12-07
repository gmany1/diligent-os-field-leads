'use client';

import { CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';

export default function Page() {
    return (
        <div className="p-6 space-y-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Pipeline Intelligence</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">AI analysis of pipeline health</p>
            </div>
            
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
               <h3 className="text-lg font-bold mb-4 text-green-600 flex items-center"><CheckCircle className="mr-2" /> Healthy Deals</h3>
               <p className="text-sm text-gray-500 mb-4">These deals are progressing faster than average.</p>
               <ul className="space-y-3">
                  {['Metro Systems', 'Alpha Logistics', 'Beta Corp'].map((d, i) => (
                      <li key={i} className="flex items-center text-gray-700 dark:text-gray-300">
                         <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span> {d}
                      </li>
                  ))}
               </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
               <h3 className="text-lg font-bold mb-4 text-red-600 flex items-center"><AlertTriangle className="mr-2" /> At Risk Deals</h3>
               <p className="text-sm text-gray-500 mb-4">Lack of recent communication detected.</p>
               <ul className="space-y-3">
                  {['Gamma Inc', 'Delta Force', 'Epsilon Group'].map((d, i) => (
                      <li key={i} className="flex items-center text-gray-700 dark:text-gray-300">
                         <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span> {d}
                      </li>
                  ))}
               </ul>
            </div>
         </div>
      
        </div>
    );
}
