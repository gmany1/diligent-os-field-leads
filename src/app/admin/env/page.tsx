'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Server, Lock, Eye, EyeOff, Copy, Edit2, Trash2, Plus, Save, X } from 'lucide-react';

type EnvVar = {
   key: string;
   value: string;
   description?: string;
};

async function fetchEnv() {
   const res = await fetch('/api/admin/env');
   if (!res.ok) throw new Error('Failed to fetch env');
   return res.json();
}

export default function EnvVarsPage() {
   const queryClient = useQueryClient();
   const [showSecrets, setShowSecrets] = useState(false);
   const [editingKey, setEditingKey] = useState<string | null>(null);
   const [editValue, setEditValue] = useState('');
   const [isCreating, setIsCreating] = useState(false);
   const [newVar, setNewVar] = useState({ key: '', value: '', description: '' });

   const { data, isLoading } = useQuery({
      queryKey: ['env-vars'],
      queryFn: fetchEnv,
   });

   const updateMutation = useMutation({
      mutationFn: async ({ key, value }: { key: string, value: string }) => {
         await fetch('/api/admin/env', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key, value }),
         });
      },
      onSuccess: () => {
         setEditingKey(null);
         queryClient.invalidateQueries({ queryKey: ['env-vars'] });
      }
   });

   const createMutation = useMutation({
      mutationFn: async (newEnv: EnvVar) => {
         await fetch('/api/admin/env', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newEnv),
         });
      },
      onSuccess: () => {
         setIsCreating(false);
         setNewVar({ key: '', value: '', description: '' });
         queryClient.invalidateQueries({ queryKey: ['env-vars'] });
      }
   });

   const deleteMutation = useMutation({
      mutationFn: async (key: string) => {
         await fetch(`/api/admin/env?key=${key}`, { method: 'DELETE' });
      },
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['env-vars'] })
   });

   if (isLoading) return <div className="p-8">Loading configuration...</div>;

   const envs = data?.data || [];

   return (
      <div className="p-8 space-y-6">
         <div className="flex justify-between items-center">
            <div>
               <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                  <Server className="mr-3 text-indigo-600" /> Environment Variables
               </h1>
               <p className="text-gray-500 mt-1">
                  System configuration (Production). <span className="text-red-500 font-bold ml-2">Handle with care.</span>
               </p>
            </div>
            <div className="flex space-x-3">
               <button
                  onClick={() => setShowSecrets(!showSecrets)}
                  className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
               >
                  {showSecrets ? <EyeOff size={18} className="mr-2" /> : <Eye size={18} className="mr-2" />}
                  {showSecrets ? 'Hide Secrets' : 'Show Secrets'}
               </button>
               <button
                  onClick={() => setIsCreating(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center shadow-sm"
               >
                  <Plus size={18} className="mr-2" /> Add Variable
               </button>
            </div>
         </div>

         <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden md:min-w-[800px]">
            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
               {isCreating && (
                  <div className="p-4 bg-indigo-50 dark:bg-indigo-900/10 space-y-3">
                     <input className="w-full p-2 border rounded text-sm font-mono" placeholder="MY_NEW_VAR" value={newVar.key} onChange={e => setNewVar({ ...newVar, key: e.target.value })} />
                     <input className="w-full p-2 border rounded text-sm font-mono" placeholder="Value..." value={newVar.value} onChange={e => setNewVar({ ...newVar, value: e.target.value })} />
                     <input className="w-full p-2 border rounded text-sm" placeholder="Description" value={newVar.description} onChange={e => setNewVar({ ...newVar, description: e.target.value })} />
                     <div className="flex justify-end space-x-2">
                        <button onClick={() => createMutation.mutate(newVar)} className="px-3 py-1 bg-green-600 text-white rounded text-sm">Save</button>
                        <button onClick={() => setIsCreating(false)} className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm">Cancel</button>
                     </div>
                  </div>
               )}
               {envs.map((env: any) => (
                  <div key={env.key} className="p-4 space-y-2">
                     <div className="flex justify-between items-start">
                        <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold text-sm break-all">{env.key}</span>
                        <div className="flex space-x-1">
                           <button onClick={() => { navigator.clipboard.writeText(env.value) }} className="p-1.5 text-gray-400 hover:text-gray-600 rounded bg-gray-50 dark:bg-gray-700"><Copy size={14} /></button>
                           <button onClick={() => { if (confirm('Delete?')) deleteMutation.mutate(env.key); }} className="p-1.5 text-red-400 hover:text-red-600 rounded bg-gray-50 dark:bg-gray-700"><Trash2 size={14} /></button>
                        </div>
                     </div>
                     <div className="font-mono text-gray-600 dark:text-gray-300 text-sm break-all bg-gray-50 dark:bg-gray-900/50 p-2 rounded">
                        {showSecrets ? env.value : '••••••••••••••••'}
                     </div>
                     <p className="text-xs text-gray-500 italic">{env.description || 'No description'}</p>
                  </div>
               ))}
            </div>

            {/* Desktop Table */}
            <table className="hidden md:table w-full text-left border-collapse">
               <thead className="bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                     <th className="px-6 py-4 font-mono text-xs text-gray-500 uppercase">Variable Key</th>
                     <th className="px-6 py-4 font-mono text-xs text-gray-500 uppercase w-1/3">Value</th>
                     <th className="px-6 py-4 font-mono text-xs text-gray-500 uppercase">Description</th>
                     <th className="px-6 py-4 font-mono text-xs text-gray-500 uppercase text-right w-32">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {isCreating && (
                     <tr className="bg-indigo-50 dark:bg-indigo-900/10 animate-fadeIn">
                        <td className="px-6 py-4">
                           <input autoFocus className="w-full p-2 border rounded text-sm font-mono" placeholder="MY_NEW_VAR" value={newVar.key} onChange={e => setNewVar({ ...newVar, key: e.target.value })} />
                        </td>
                        <td className="px-6 py-4">
                           <input className="w-full p-2 border rounded text-sm font-mono" placeholder="Value..." value={newVar.value} onChange={e => setNewVar({ ...newVar, value: e.target.value })} />
                        </td>
                        <td className="px-6 py-4">
                           <input className="w-full p-2 border rounded text-sm" placeholder="Description" value={newVar.description} onChange={e => setNewVar({ ...newVar, description: e.target.value })} />
                        </td>
                        <td className="px-6 py-4 text-right">
                           <div className="flex justify-end space-x-2">
                              <button onClick={() => createMutation.mutate(newVar)} className="p-2 bg-green-100 text-green-700 rounded hover:bg-green-200"><Save size={16} /></button>
                              <button onClick={() => setIsCreating(false)} className="p-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"><X size={16} /></button>
                           </div>
                        </td>
                     </tr>
                  )}
                  {envs.map((env: any) => (
                     <tr key={env.key} className="group hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4 font-mono text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                           {env.key}
                        </td>
                        <td className="px-6 py-4 font-mono text-gray-600 dark:text-gray-300 text-sm break-all">
                           {editingKey === env.key ? (
                              <div className="flex items-center">
                                 <input
                                    className="w-full p-1 border rounded"
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                 />
                                 <button onClick={() => updateMutation.mutate({ key: env.key, value: editValue })} className="ml-2 text-green-600"><Save size={16} /></button>
                                 <button onClick={() => setEditingKey(null)} className="ml-2 text-gray-500"><X size={16} /></button>
                              </div>
                           ) : (
                              <span className={showSecrets ? '' : 'blur-sm select-none transition-all duration-300 hover:blur-none cursor-pointer'} title="Hover to peek">
                                 {env.value}
                              </span>
                           )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 italic">
                           {env.description || '-'}
                        </td>
                        <td className="px-6 py-4 text-right">
                           <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => { navigator.clipboard.writeText(env.value) }} className="p-1.5 text-gray-400 hover:text-gray-600 rounded"><Copy size={16} /></button>
                              <button onClick={() => { setEditingKey(env.key); setEditValue(env.value); }} className="p-1.5 text-blue-400 hover:text-blue-600 rounded"><Edit2 size={16} /></button>
                              <button onClick={() => { if (confirm('Delete?')) deleteMutation.mutate(env.key); }} className="p-1.5 text-red-400 hover:text-red-600 rounded"><Trash2 size={16} /></button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>

         <div className="fixed bottom-6 right-6 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 flex items-center space-x-3 z-50">
            <div className="relative">
               <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
               </span>
               <Server size={20} className="text-gray-600 dark:text-gray-300" />
            </div>
            <div className="text-xs">
               <p className="font-bold text-gray-900 dark:text-white">API Connected</p>
               <p className="text-gray-500 dark:text-gray-400">Source: /api/admin/env</p>
            </div>
         </div>
      </div>
   );
}
