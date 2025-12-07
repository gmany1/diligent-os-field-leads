'use client';

import { Shield, FileText, Trash2, Users, Database } from 'lucide-react';
import SalesVelocityChart from '../SalesVelocityChart'; // Placeholder

function KPICard({ title, value, subtext, icon: Icon }: any) {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 font-sans">
            <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</span>
                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <Icon size={20} className="text-purple-600 dark:text-purple-400" />
                </div>
            </div>
            <div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{value}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtext}</p>
            </div>
        </div>
    );
}

export default function CompliancePanel() {
    return (
        <div className="space-y-6 font-sans">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Compliance & Legal Center</h1>
                    <p className="text-sm text-gray-500">GDPR/CCPA Management and Audit Logging</p>
                </div>
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md text-sm font-medium transition-colors">
                    Download Compliance Report
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard title="CCPA Request" value="12" subtext="In last 30 days" icon={FileText} />
                <KPICard title="Soft Deletes" value="8" subtext="Anonymized records" icon={Trash2} />
                <KPICard title="Hard Deletes" value="2" subtext="Permanent removals" icon={Database} />
                <KPICard title="PII Access" value="1,402" subtext="Read operations logged" icon={Users} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 h-[400px]">
                    <h3 className="text-lg font-bold mb-4">Compliance Requests Trend</h3>
                    <SalesVelocityChart /> {/* Placeholder: Should be Compliance Trend Chart */}
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-bold mb-4">Recent Audit Actions</h3>
                    <ul className="space-y-4">
                        <li className="text-sm">
                            <p className="font-semibold text-gray-900 dark:text-white">CCPA_EXPORT</p>
                            <p className="text-xs text-gray-500">User: Admin • Entity: Lead #4092</p>
                            <span className="text-xs text-gray-400">2 mins ago</span>
                        </li>
                        <li className="text-sm">
                            <p className="font-semibold text-gray-900 dark:text-white">USER_LOGIN_FAILED</p>
                            <p className="text-xs text-gray-500">IP: 192.168.1.42 • User: Unknown</p>
                            <span className="text-xs text-gray-400">14 mins ago</span>
                        </li>
                        <li className="text-sm">
                            <p className="font-semibold text-gray-900 dark:text-white">CCPA_DELETE_SOFT</p>
                            <p className="text-xs text-gray-500">User: Admin • Entity: Lead #3321</p>
                            <span className="text-xs text-gray-400">1 hour ago</span>
                        </li>
                    </ul>
                    <button className="text-sm text-indigo-600 mt-4 font-medium hover:underline">View Full Audit Log</button>
                </div>
            </div>
        </div>
    );
}
