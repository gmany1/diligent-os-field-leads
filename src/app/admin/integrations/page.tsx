'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CheckCircle, AlertCircle, RefreshCw, Activity, ExternalLink, Settings, Save } from 'lucide-react';

export default function IntegrationsPage() {
   return (
      <div className="p-6 max-w-7xl mx-auto space-y-8 font-sans">
         <header className="flex justify-between items-center">
            <div>
               <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Integrations</h1>
               <p className="text-gray-500 dark:text-gray-400">Manage connections with external tools like N8N.</p>
            </div>
         </header>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* N8N Module */}
            <N8NIntegrationCard />

            {/* Health Check Module (Internal) */}
            <HealthStatusCard />
         </div>
      </div>
   );
}

function N8NIntegrationCard() {
   const [webhookUrl, setWebhookUrl] = useState('https://n8n.diligentos.com/webhook/lead-updates');
   const [isActive, setIsActive] = useState(true);

   const handleSave = () => {
      // Here we would save to DB
      toast.success('N8N Configuration Saved');
   };

   return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
         <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
               {/* N8N Logo Placeholder or Icon */}
               <div className="w-10 h-10 bg-[#FF6D5A] rounded-lg flex items-center justify-center text-white font-bold text-xs">
                  n8n
               </div>
               <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">N8N Automation</h3>
                  <p className="text-sm text-gray-500">Workflow automation for leads and notifications.</p>
               </div>
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
               {isActive ? 'Active' : 'Inactive'}
            </div>
         </div>

         <div className="space-y-4">
            <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Webhook URL (Inbound)</label>
               <div className="flex gap-2">
                  <input
                     type="text"
                     value={webhookUrl}
                     onChange={(e) => setWebhookUrl(e.target.value)}
                     className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                  />
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                     <ExternalLink size={18} />
                  </button>
               </div>
               <p className="text-xs text-gray-500 mt-1">We will send a POST request here when a new lead is Created or Won.</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
               <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <Activity size={16} className="text-indigo-500" />
                  Recent Triggers
               </h4>
               <ul className="text-sm space-y-2">
                  <li className="flex justify-between text-gray-600 dark:text-gray-400">
                     <span>New Lead: Acme Corp</span>
                     <span className="text-green-600 text-xs">Success (200 OK)</span>
                  </li>
                  <li className="flex justify-between text-gray-600 dark:text-gray-400">
                     <span>Lead Won: TechStart Inc</span>
                     <span className="text-green-600 text-xs">Success (200 OK)</span>
                  </li>
               </ul>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
               <button
                  onClick={() => setIsActive(!isActive)}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
               >
                  {isActive ? 'Disable Integration' : 'Enable Integration'}
               </button>
               <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium"
               >
                  <Save size={16} />
                  Save Config
               </button>
            </div>
         </div>
      </div>
   );
}

function HealthStatusCard() {
   const { data, isLoading, refetch, isError } = useQuery({
      queryKey: ['health-check'],
      queryFn: async () => {
         const res = await fetch('/api/health');
         if (!res.ok) throw new Error('Health Check Failed');
         return res.json();
      },
      refetchInterval: 60000 // Check every minute
   });

   const isHealthy = data?.healthy;

   return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
         <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
               <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold ${isHealthy ? 'bg-green-500' : isError ? 'bg-red-500' : 'bg-gray-400'}`}>
                  <Activity size={24} />
               </div>
               <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">System Health</h3>
                  <p className="text-sm text-gray-500">Real-time internal diagnostics.</p>
               </div>
            </div>
            <button onClick={() => refetch()} className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 ${isLoading ? 'animate-spin' : ''}`}>
               <RefreshCw size={18} className="text-gray-500" />
            </button>
         </div>

         <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
               <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-700">
                  <span className="text-xs text-gray-500 uppercase font-semibold">Database</span>
                  <div className="flex items-center gap-2 mt-1">
                     {isHealthy ? <CheckCircle size={16} className="text-green-500" /> : <AlertCircle size={16} className="text-red-500" />}
                     <span className="font-medium text-gray-900 dark:text-white">{data?.database || 'Checking...'}</span>
                  </div>
               </div>
               <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-700">
                  <span className="text-xs text-gray-500 uppercase font-semibold">Uptime</span>
                  <div className="mt-1 font-mono text-sm text-gray-900 dark:text-white">
                     {data?.uptime ? `${Math.floor(data.uptime / 60)}m ${Math.floor(data.uptime % 60)}s` : '--'}
                  </div>
               </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-100 dark:border-blue-900">
               <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">Deployment Info</h4>
               <p className="text-xs text-blue-600 dark:text-blue-400">
                  Timestamp: {new Date(data?.timestamp || Date.now()).toLocaleString()}
               </p>
            </div>
         </div>
      </div>
   );
}
