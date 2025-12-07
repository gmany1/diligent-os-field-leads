'use client';

import { TrendingUp, Calendar, AlertCircle } from 'lucide-react';

export default function Page() {
    return (
        <div className="p-6 space-y-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Commission Projection</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Estimated earnings based on open pipeline</p>
            </div>
            
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
              <h3 className="text-gray-500 text-sm font-medium uppercase mb-2">Projected (Next 30 Days)</h3>
              <p className="text-4xl font-bold text-indigo-600">$8,450</p>
              <p className="text-sm text-green-600 mt-2 flex items-center justify-center"><TrendingUp size={16} className="mr-1" /> +12% from last month</p>
           </div>
           
           <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
              <h3 className="text-gray-500 text-sm font-medium uppercase mb-2">Projected (Q4 Total)</h3>
              <p className="text-4xl font-bold text-purple-600">$24,100</p>
              <p className="text-sm text-gray-400 mt-2">Based on 35% probability weighting</p>
           </div>
           
           <div className="md:col-span-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-6 border border-indigo-100 dark:border-indigo-800">
               <div className="flex items-start">
                  <AlertCircle className="text-indigo-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                      <h4 className="font-bold text-indigo-900 dark:text-indigo-200">How is this calculated?</h4>
                      <p className="text-sm text-indigo-700 dark:text-indigo-300 mt-1">
                          Projections are based on "Proposal" and "Negotiation" stage deals weighted by their probability of closing. Deals in preliminary stages are excluded to ensure accuracy.
                      </p>
                  </div>
               </div>
           </div>
        </div>
      
        </div>
    );
}
