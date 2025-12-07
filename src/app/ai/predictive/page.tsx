'use client';

import { Brain, TrendingUp, Zap } from 'lucide-react';

export default function Page() {
    return (
        <div className="p-6 space-y-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Predictive Analytics</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">AI-driven business forecasts</p>
            </div>
            
        <div className="space-y-6">
           <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-8 text-white shadow-lg">
              <div className="flex items-center space-x-4 mb-6">
                 <Brain size={48} className="text-purple-200" />
                 <div>
                    <h2 className="text-3xl font-bold">Sales Forecast</h2>
                    <p className="text-purple-200">Confidence Score: 92%</p>
                 </div>
              </div>
              <div className="grid grid-cols-3 gap-8 text-center bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                 <div>
                    <p className="text-sm text-purple-200 uppercase">Next Month Revenue</p>
                    <p className="text-3xl font-bold">$185k</p>
                 </div>
                 <div>
                    <p className="text-sm text-purple-200 uppercase">Predicted Growth</p>
                    <p className="text-3xl font-bold">+18%</p>
                 </div>
                 <div>
                    <p className="text-sm text-purple-200 uppercase">Churn Risk</p>
                    <p className="text-3xl font-bold">Low</p>
                 </div>
              </div>
           </div>
           
           <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
               <h3 className="text-xl font-bold mb-4 flex items-center"><Zap className="text-yellow-500 mr-2" /> Top Opportunities to Watch</h3>
               <div className="space-y-3">
                  {[
                     { name: 'TechGlobal Expansion', score: 98, reason: 'High engagement, Budget confirmed' },
                     { name: 'City Services Contract', score: 95, reason: 'Decision maker meeting set' },
                     { name: 'Logistics Plus', score: 88, reason: 'Request for proposal received' },
                  ].map((opp, i) => (
                     <div key={i} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg border-l-4 border-green-500">
                        <div>
                           <p className="font-bold text-gray-900 dark:text-white">{opp.name}</p>
                           <p className="text-xs text-gray-500">{opp.reason}</p>
                        </div>
                        <div className="text-right">
                           <span className="text-2xl font-bold text-green-600">{opp.score}</span>
                           <span className="text-xs text-gray-400 block">AI Score</span>
                        </div>
                     </div>
                  ))}
               </div>
           </div>
        </div>
     
        </div>
    );
}
