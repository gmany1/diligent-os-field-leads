'use client';

import { useQuery } from '@tanstack/react-query';
import ImportLeads from '../ImportLeads';
import UserManagement from './UserManagement';
import AuditLogViewer from './AuditLogViewer';
import SystemHealthWidget from './SystemHealthWidget';
import DataIntegrityWidget from './DataIntegrityWidget';
import SystemActivityChart from './SystemActivityChart';
import PendingHandoffs from './PendingHandoffs';
import AIArchitectWidget from './AIArchitectWidget';
import { toast } from 'sonner';

export default function AdminDashboard() {
    const { data: statsData, isLoading } = useQuery({
        queryKey: ['dashboard-stats', 'ADMIN'],
        queryFn: async () => {
            const res = await fetch('/api/dashboard/stats?role=IT_ADMIN');
            if (!res.ok) throw new Error('Failed to fetch stats');
            return res.json();
        }
    });

    if (isLoading) return <div className="p-8 animate-pulse space-y-4">
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div className="grid grid-cols-2 gap-4">
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
    </div>;

    return (
        <div className="space-y-8">
            {/* 1. The Structure (Onboarding) - System Health & Import */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">System Administration</h2>

                {/* KPI 1: Data Integrity & System Health */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="lg:col-span-2">
                        <DataIntegrityWidget />
                    </div>
                    <div className="lg:col-span-1">
                        <SystemHealthWidget />
                    </div>
                </div>

                {/* Import Module */}
                <div className="mb-8">
                    <ImportLeads onImportSuccess={() => toast.success('Data imported successfully!')} />
                </div>
            </div>

            {/* 2. The Control (Management) & The Support (Resolution) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* KPI 2: System Activity */}
                <div className="h-[400px]">
                    <SystemActivityChart />
                </div>

                {/* KPI 3: Pending Hand-offs */}
                <div className="h-[400px]">
                    <PendingHandoffs />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="min-h-[500px]">
                    <UserManagement />
                </div>
                <div className="min-h-[500px]">
                    <AuditLogViewer />
                </div>
            </div>

            {/* 3. AI Architect (Future Proofing) */}
            <div>
                <AIArchitectWidget />
            </div>
        </div>
    );
}
