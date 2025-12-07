'use client';

import { Calendar, Clock, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Page() {
    return (
        <div className="p-6 space-y-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Calendar</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Schedule of upcoming events</p>
            </div>
            
         <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center space-x-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">December 2025</h2>
                  <div className="flex space-x-1">
                     <button className="p-1 rounded hover:bg-gray-100"><ChevronLeft size={20} /></button>
                     <button className="p-1 rounded hover:bg-gray-100"><ChevronRight size={20} /></button>
                  </div>
               </div>
               <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm font-medium">Week</button>
                  <button className="px-3 py-1 bg-indigo-600 text-white rounded text-sm font-medium">Month</button>
               </div>
            </div>
            
            <div className="space-y-4">
               {[
                  { day: 'Today', date: 'Dec 7', events: [{ time: '10:00 AM', title: 'Team Sync', type: 'Internal', color: 'bg-blue-100 border-blue-500 text-blue-800' }] },
                  { day: 'Tomorrow', date: 'Dec 8', events: [
                      { time: '2:00 PM', title: 'Client Demo - Acme', type: 'Sales', color: 'bg-green-100 border-green-500 text-green-800' },
                      { time: '4:30 PM', title: 'Q4 Review', type: 'Internal', color: 'bg-blue-100 border-blue-500 text-blue-800' }
                  ]},
                  { day: 'Wednesday', date: 'Dec 9', events: [] },
                  { day: 'Thursday', date: 'Dec 10', events: [{ time: '11:00 AM', title: 'Lunch with prospect', type: 'External', color: 'bg-yellow-100 border-yellow-500 text-yellow-800' }] },
               ].map((dayEvent, i) => (
                  <div key={i} className="pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0">
                     <p className="text-sm font-semibold text-gray-500 mb-2">{dayEvent.day}, {dayEvent.date}</p>
                     {dayEvent.events.length > 0 ? (
                        <div className="space-y-2">
                           {dayEvent.events.map((evt, j) => (
                              <div key={j} className={"flex items-center p-3 rounded-lg border-l-4 bg-opacity-50 " + evt.color}>
                                 <Clock size={16} className="mr-3 opacity-70" />
                                 <span className="font-mono text-sm font-bold mr-4">{evt.time}</span>
                                 <span className="font-medium">{evt.title}</span>
                              </div>
                           ))}
                        </div>
                     ) : (
                        <p className="text-sm text-gray-400 italic pl-4">No events scheduled</p>
                     )}
                  </div>
               ))}
            </div>
         </div>
      
        </div>
    );
}
