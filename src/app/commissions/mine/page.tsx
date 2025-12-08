import { getCommissions } from '@/lib/commission-actions';
import { DollarSign, TrendingUp, CheckCircle, Clock } from 'lucide-react';

export default async function MyCommissionsPage() {
    const { commissions, stats } = await getCommissions('MINE');

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Commissions</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Track your earnings and payout status.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-green-100 font-medium">Total Paid</p>
                            <h3 className="text-3xl font-bold mt-1">
                                {stats.totalPaid.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                            </h3>
                        </div>
                        <div className="p-2 bg-white/20 rounded-lg">
                            <CheckCircle size={24} className="text-white" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-yellow-100 font-medium">Pending Payout</p>
                            <h3 className="text-3xl font-bold mt-1">
                                {stats.totalPending.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                            </h3>
                        </div>
                        <div className="p-2 bg-white/20 rounded-lg">
                            <Clock size={24} className="text-white" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 font-medium">Projected (Pipeline)</p>
                            <h3 className="text-3xl font-bold mt-1 text-gray-900 dark:text-white">
                                {stats.potentialCommission.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                            </h3>
                        </div>
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                            <TrendingUp size={24} className="text-indigo-600 dark:text-indigo-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Commission History</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400">
                            <tr>
                                <th className="px-6 py-3 font-medium">Date</th>
                                <th className="px-6 py-3 font-medium">Lead / Deal</th>
                                <th className="px-6 py-3 font-medium">Amount</th>
                                <th className="px-6 py-3 font-medium">Rate</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {commissions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                        No commissions found yet. Close some leads! 🚀
                                    </td>
                                </tr>
                            ) : (
                                commissions.map((comm) => (
                                    <tr key={comm.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                            {new Date(comm.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">{comm.lead?.name || 'Unknown Lead'}</p>
                                                <p className="text-xs text-gray-500">{comm.lead?.stage} • Quote: {comm.quote?.status}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                                            {comm.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                            {(comm.rateApplied * 100).toFixed(1)}%
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${comm.status === 'PAID'
                                                    ? 'bg-green-50 text-green-700 border-green-100 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800'
                                                    : comm.status === 'PENDING'
                                                        ? 'bg-yellow-50 text-yellow-700 border-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800'
                                                        : 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800'
                                                }`}>
                                                {comm.status}
                                            </span>
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
