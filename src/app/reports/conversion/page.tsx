'use client';

import { TrendingUp, Filter, Download, Funnel } from 'lucide-react';

export default function Page() {
    return (
        <div className="p-6 space-y-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Conversion Report</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Lead funnel and conversion rate analysis</p>
            </div>
            
        <div className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                 { label: 'Lead to Quote', val: '42%', change: '+5%', color: 'text-blue-600' },
                 { label: 'Quote to Deal', val: '28%', change: '+2%', color: 'text-indigo-600' },
                 { label: 'Overall Conversion', val: '12%', change: '+1.5%', color: 'text-green-600' },
              ].map((kpi, i) => (
                 <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow text-center">
                    <p className="text-gray-500 text-sm uppercase font-semibold">{kpi.label}</p>
                    <p className={"text-3xl font-bold mt-2 " + kpi.color}>{kpi.val}</p>
                    <p className="text-sm text-green-600 mt-1">{kpi.change} vs last month</p>
                 </div>
              ))}
           </div>
           
           <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-bold mb-6">Conversion Funnel</h3>
              <div className="space-y-4 max-w-3xl mx-auto">
                 {[
                    { stage: 'Total Leads', count: 1250, pct: '100%', bg: 'bg-blue-100' },
                    { stage: 'Qualified', count: 850, pct: '68%', bg: 'bg-blue-200' },
                    { stage: 'Proposal Sent', count: 520, pct: '41%', bg: 'bg-blue-400' },
                    { stage: 'Negotiation', count: 320, pct: '25%', bg: 'bg-blue-500' },
                    { stage: 'Closed Won', count: 150, pct: '12%', bg: 'bg-blue-600' },
                 ].map((step, i) => (
                    <div key={i} className="relative h-12 rounded-lg overflow-hidden flex items-center">
                       <div className={"absolute top-0 left-0 h-full " + step.bg} style={{ width: step.pct }}></div>
                       <div className="relative z-10 flex justify-between w-full px-4 font-medium text-gray-800 dark:text-gray-900">
                          <span>{step.stage}</span>
                          <span>{step.count} ({step.pct})</span>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      
        </div>
    );
}
