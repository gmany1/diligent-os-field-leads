'use client';

import { Phone, Mail, Users, Calendar, BarChart } from 'lucide-react';

export default function Page() {
    return (
        <div className="p-6 space-y-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Activity Report</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Log of calls, emails, and meetings</p>
            </div>
            
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-bold mb-4">Activity Volume (Last 30 Days)</h3>
              <div className="h-64 flex items-end justify-between space-x-2 px-4">
                 {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((h, i) => (
                    <div key={i} className="w-full bg-indigo-100 dark:bg-indigo-900/30 rounded-t hover:bg-indigo-200 transition-colors relative group">
                       <div className="absolute bottom-0 w-full bg-indigo-600 rounded-t" style={{ height: h + "%" }}></div>
                       <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          {h}
                       </div>
                    </div>
                 ))}
              </div>
              <div className="flex justify-between mt-4 text-xs text-gray-400 border-t pt-2">
                 <span>Week 1</span>
                 <span>Week 2</span>
                 <span>Week 3</span>
                 <span>Week 4</span>
              </div>
           </div>
           
           <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                 <h3 className="text-lg font-bold mb-4">Activity Breakdown</h3>
                 <div className="space-y-4">
                    {[
                       { type: 'Calls', count: 450, icon: Phone, color: 'text-green-500', bg: 'bg-green-100' },
                       { type: 'Emails', count: 820, icon: Mail, color: 'text-blue-500', bg: 'bg-blue-100' },
                       { type: 'Meetings', count: 120, icon: Users, color: 'text-purple-500', bg: 'bg-purple-100' },
                    ].map((item, i) => (
                       <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                             <div className={"p-2 rounded-lg " + item.bg}>
                                <item.icon className={item.color} size={20} />
                             </div>
                             <span className="font-medium text-gray-700 dark:text-gray-300">{item.type}</span>
                          </div>
                          <span className="font-bold text-gray-900 dark:text-white">{item.count}</span>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      
        </div>
    );
}
