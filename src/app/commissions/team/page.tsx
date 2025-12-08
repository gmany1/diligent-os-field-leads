import { getCommissions } from '@/lib/commission-actions';
import MarkPaidButton from '@/components/commissions/MarkPaidButton';
import { DollarSign, Users, AlertCircle } from 'lucide-react';

export default async function TeamCommissionsPage() {
   // Error handling wrapped in try/catch or let Next.js Error Boundary handle it
   const { commissions, stats } = await getCommissions('TEAM');

   return (
      <div className="p-6 max-w-7xl mx-auto space-y-8">
         <div className="flex justify-between items-center">
            <div>
               <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Team Commissions</h1>
               <p className="text-gray-600 dark:text-gray-400 mt-2">Manage payouts and review your branch's performance.</p>
            </div>
         </div>

         {/* Aggregated Stats */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border-l-4 border-yellow-500">
               <p className="text-gray-500 text-sm font-medium">Pending Approval</p>
               <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.totalPending.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
               </h3>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border-l-4 border-green-500">
               <p className="text-gray-500 text-sm font-medium">Total Paid (YTD)</p>
               <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.totalPaid.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
               </h3>
            </div>
         </div>

         {/* Main Table */}
         <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
               <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
                  <Users size={18} className="mr-2 text-indigo-500" />
                  Team Payout Queue
               </h3>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400">
                     <tr>
                        <th className="px-6 py-3 font-medium">Rep</th>
                        <th className="px-6 py-3 font-medium">Deal Details</th>
                        <th className="px-6 py-3 font-medium">Amount</th>
                        <th className="px-6 py-3 font-medium">Date</th>
                        <th className="px-6 py-3 font-medium">Action</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                     {commissions.length === 0 ? (
                        <tr>
                           <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                              No commissions pending or recording for this branch team.
                           </td>
                        </tr>
                     ) : (
                        commissions.map((comm) => (
                           <tr key={comm.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                              <td className="px-6 py-4">
                                 <div className="flex items-center">
                                    <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 font-bold mr-3">
                                       {comm.user.name?.charAt(0) || 'U'}
                                    </div>
                                    <div>
                                       <p className="font-medium text-gray-900 dark:text-white">{comm.user.name}</p>
                                       <p className="text-xs text-gray-500">{comm.user.email}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-6 py-4">
                                 <p className="text-gray-900 dark:text-gray-300 font-medium">{comm.lead?.name}</p>
                                 <p className="text-xs text-gray-500">
                                    Stage: {comm.lead?.stage}
                                 </p>
                              </td>
                              <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                                 {comm.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                              </td>
                              <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                 {new Date(comm.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4">
                                 <MarkPaidButton id={comm.id} status={comm.status} />
                              </td>
                           </tr>
                        ))
                     )}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   );
}
