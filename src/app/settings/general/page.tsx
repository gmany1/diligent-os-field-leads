'use client';

import { Globe, Clock, DollarSign, Image } from 'lucide-react';

export default function Page() {
    return (
        <div className="p-6 space-y-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">General Settings</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Configure application-wide defaults</p>
            </div>
            
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow divide-y divide-gray-200 dark:divide-gray-700">
         <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center"><Globe size={20} className="mr-2" /> Localization</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Language</label>
                  <select className="w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600">
                     <option>English (US)</option>
                     <option>Spanish</option>
                  </select>
               </div>
               <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Timezone</label>
                   <select className="w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600">
                      <option>UTC-6 (Central Time)</option>
                      <option>UTC-5 (Eastern Time)</option>
                      <option>UTC-8 (Pacific Time)</option>
                   </select>
               </div>
            </div>
         </div>
         <div className="p-6">
             <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center"><Image size={20} className="mr-2" /> Branding</h3>
             <div className="flex items-center space-x-4">
                 <div className="h-16 w-16 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">Logo</div>
                 <button className="text-sm text-indigo-600 font-medium hover:text-indigo-500">Upload new logo</button>
             </div>
         </div>
         <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-b-lg flex justify-end">
             <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Save Changes</button>
         </div>
      </div>
    
        </div>
    );
}
