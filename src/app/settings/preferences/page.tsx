'use client';

import { Bell, Moon, Sidebar, Layout } from 'lucide-react';

export default function Page() {
    return (
        <div className="p-6 space-y-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Preferences</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Customize your personal workspace</p>
            </div>
            
        <div className="space-y-6">
           <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center"><Bell size={20} className="mr-2" /> Notifications</h3>
              <div className="space-y-4">
                 {['Email notifications for new leads', 'Push notifications for mentions', 'Daily summary email', 'Weekly report digest'].map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                       <span className="text-gray-700 dark:text-gray-300">{item}</span>
                       <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked={i < 2} />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                       </label>
                    </div>
                 ))}
              </div>
           </div>
           
           <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
               <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center"><Layout size={20} className="mr-2" /> Interface</h3>
               <div className="space-y-4">
                   <div className="flex items-center justify-between">
                       <span className="text-gray-700 dark:text-gray-300">Compact Mode (High Density)</span>
                       <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                       </label>
                   </div>
               </div>
           </div>
        </div>
     
        </div>
    );
}
