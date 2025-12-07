'use client';

import { Flag, FlaskConical, AlertCircle } from 'lucide-react';

export default function Page() {
    return (
        <div className="p-6 space-y-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Feature Flags</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Manage experimental features and rollouts</p>
            </div>
            
       <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-100 dark:border-yellow-900/30 flex items-start space-x-3">
             <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
             <p className="text-sm text-yellow-800 dark:text-yellow-200">
                These features are experimental. Enabling them may affect system stability.
             </p>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
             {[
                { name: 'AI Predictive Scoring', id: 'ai_scoring_v2', desc: 'Use Gemini 1.5 Pro for lead scoring models', status: 'Beta' },
                { name: 'New Kanban Board', id: 'kanban_react_dnd', desc: 'Performance optimized drag-and-drop board', status: 'Alpha' },
                { name: 'Dark Mode V2', id: 'theme_v2', desc: 'High contrast dark mode with OLED support', status: 'RC' },
             ].map((flag, i) => (
                <div key={i} className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50">
                   <div>
                      <div className="flex items-center space-x-2">
                         <h3 className="text-lg font-medium text-gray-900 dark:text-white">{flag.name}</h3>
                         <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs rounded-full">{flag.status}</span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{flag.desc}</p>
                      <code className="text-xs text-gray-400 mt-2 block font-mono">{flag.id}</code>
                   </div>
                   <div className="flex items-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                         <input type="checkbox" className="sr-only peer" defaultChecked={false} />
                         <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                   </div>
                </div>
             ))}
          </div>
       </div>
    
        </div>
    );
}
