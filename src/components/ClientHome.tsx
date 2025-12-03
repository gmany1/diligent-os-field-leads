'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams, useRouter } from 'next/navigation';
import WinLeadModal from '@/components/WinLeadModal';
import AddLeadModal from '@/components/AddLeadModal';
import { BRANCHES } from '@/lib/constants';
import { useSession } from 'next-auth/react';
import CommissionManager from '@/components/CommissionManager';
import CEODashboard from '@/components/dashboard/CEODashboard';
import ManagerDashboard from '@/components/dashboard/ManagerDashboard';
import RepDashboard from '@/components/dashboard/RepDashboard';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import DashboardSwitcher from '@/components/dashboard/DashboardSwitcher';
// import UrlHandler from '@/components/UrlHandler';

// Fetchers
const fetchStats = async () => {
  const res = await fetch('/api/stats');
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
};

const fetchLeads = async () => {
  const res = await fetch('/api/leads');
  if (!res.ok) throw new Error('Failed to fetch leads');
  return res.json();
};

const fetchQuotes = async (leadId: string) => {
  const res = await fetch(`/api/quotes?leadId=${leadId}`);
  if (!res.ok) throw new Error('Failed to fetch quotes');
  return res.json();
};

export default function ClientHome({ searchParams }: { searchParams: any }) {
  const { data: session } = useSession();
  // const searchParams = useSearchParams(); // Removed
  // const router = useRouter(); // Removed

  const queryClient = useQueryClient();
  const [newLeadName, setNewLeadName] = useState('');
  const [showWinModal, setShowWinModal] = useState<string | null>(null);
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [mockRole, setMockRole] = useState('FIELD_LEAD_REP'); // Default to Rep for demo
  const [isEnriching, setIsEnriching] = useState(false);
  const [enrichedData, setEnrichedData] = useState<any>(null);
  const [newLeadBranch, setNewLeadBranch] = useState<string>('el-monte');

  // useEffect for URL params moved to UrlHandler

  // useEffect for URL params moved to UrlHandler

  // Queries
  const { data: stats = { totalLeads: 0, activeQuotes: 0, pendingActions: 0 } } = useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats,
  });

  const { data: leadsData, isLoading: leadsLoading } = useQuery({
    queryKey: ['leads'],
    queryFn: fetchLeads,
  });

  const leads = leadsData?.data || [];



  // Mutations
  const createLeadMutation = useMutation({
    mutationFn: async (data: {
      name: string; industry?: string; phone?: string; secondaryPhone?: string; email?: string; address?: string; // Added secondaryPhone
      contactPerson?: string; leadType?: string; initialContactMethod?: string;
      currentVendor?: string; contractExpiry?: string; hiringNeeds?: string; safetyStatus?: string;
      branch?: string;
    }) => {
      // Check duplicates first
      const checkRes = await fetch('/api/leads/check-duplicate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (checkRes.ok) {
        const { duplicates } = await checkRes.json();
        if (duplicates.length > 0) {
          toast.warning(`Found ${duplicates.length} potential duplicate(s). Check console.`);
          console.log('Duplicates:', duplicates);
        }
      }

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create lead');
      return res.json();
    },
    onSuccess: () => {
      toast.success('Lead created successfully');
      setNewLeadName('');
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
    onError: (error) => {
      console.error('Error creating lead:', error);
      toast.error('Failed to create lead');
    },
  });

  const updateLeadMutation = useMutation({
    mutationFn: async ({ id, stage, vacancies, vacanciesNote }: { id: string; stage: string; vacancies?: number; vacanciesNote?: string }) => {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage, vacancies, vacanciesNote }),
      });
      if (!res.ok) throw new Error('Failed to update lead');
      return res.json();
    },
    onSuccess: (_, variables) => {
      toast.success(`Lead moved to ${variables.stage}`);
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
    onError: (error) => {
      console.error('Error updating lead:', error);
      toast.error('Failed to update lead');
    },
  });

  const deleteLeadMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete lead');
      return res.json();
    },
    onSuccess: () => {
      toast.success('Lead deleted');
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
    onError: (error) => {
      console.error('Error deleting lead:', error);
      toast.error('Failed to delete lead');
    },
  });

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName.trim()) return;

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    // Basic Info
    const industry = formData.get('industry') as string;
    const phone = formData.get('phone') as string;
    const secondaryPhone = formData.get('secondaryPhone') as string; // Added secondaryPhone
    const email = formData.get('email') as string;
    const address = formData.get('address') as string;
    const contactPerson = formData.get('contactPerson') as string;
    const leadType = formData.get('leadType') as string;
    const initialContactMethod = formData.get('initialContactMethod') as string;

    // Staffing Info
    const currentVendor = formData.get('currentVendor') as string;
    const contractExpiry = formData.get('contractExpiry') as string;
    const hiringNeeds = formData.get('hiringNeeds') as string;
    const safetyStatus = formData.get('safetyStatus') as string;

    createLeadMutation.mutate({
      name: newLeadName, industry, phone, secondaryPhone, email, address, contactPerson, leadType, initialContactMethod, // Added secondaryPhone
      currentVendor, contractExpiry, hiringNeeds, safetyStatus, branch: newLeadBranch
    });
    // Form reset handled by modal close or manual reset if needed, but here we just clear state
    // form.reset(); // We might not have form ref here easily if modal closes, but let's see
    setNewLeadName('');
    setNewLeadBranch('el-monte');
    setShowAddLeadModal(false);
  };

  const handleUpdateLead = (id: string, stage: string) => {
    if (stage === 'WON') {
      setShowWinModal(id);
      return;
    }
    updateLeadMutation.mutate({ id, stage });
  };

  const handleWinConfirm = (vacancies: number, note: string) => {
    if (showWinModal) {
      updateLeadMutation.mutate({
        id: showWinModal,
        stage: 'WON',
        vacancies,
        vacanciesNote: note
      });
      setShowWinModal(null);
    }
  };

  const handleDeleteLead = (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    deleteLeadMutation.mutate(id);
  };

  const handleEnrich = async () => {
    if (!newLeadName.trim()) {
      toast.error('Please enter a company name first');
      return;
    }
    setIsEnriching(true);
    try {
      const res = await fetch('/api/ai/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName: newLeadName }),
      });
      const data = await res.json();
      if (data.success) {
        setEnrichedData(data.data);
        toast.success('✨ Magic Enrich Complete!');
      } else {
        toast.error('Could not enrich data');
      }
    } catch (e) {
      console.error(e);
      toast.error('AI Enrichment failed');
    } finally {
      setIsEnriching(false);
    }
  };

  if (leadsLoading) return <div className="p-8">Loading...</div>;

  const isExecutive = session?.user?.role === 'EXECUTIVE' || session?.user?.role === 'MANAGER' || session?.user?.role === 'IT_ADMIN';
  const isRep = session?.user?.role === 'FIELD_LEAD_REP';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          {/* Mobile Header Spacer */}
          <div className="md:hidden h-16 mb-4 flex items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white ml-12">Dashboard</h1>
          </div>

          {/* Role Switcher for Demo */}
          <DashboardSwitcher currentRole={mockRole} onRoleChange={setMockRole} />

          {/* Role-Based Views */}
          {mockRole === 'EXECUTIVE' && <CEODashboard />}
          {mockRole === 'MANAGER' && <ManagerDashboard />}
          {mockRole === 'IT_ADMIN' && <AdminDashboard />}

          {/* Rep View (Original Dashboard Functionality) */}
          {mockRole === 'FIELD_LEAD_REP' && (
            <>
              <RepDashboard
                onAddLeadClick={() => setShowAddLeadModal(true)}
                onViewCalendarClick={() => toast.info('Calendar integration coming soon!')}
              />

              {/* Modals */}
              <div className="mt-4">
                {/* Win Lead Modal */}
                <WinLeadModal
                  isOpen={!!showWinModal}
                  onClose={() => setShowWinModal(null)}
                  onConfirm={handleWinConfirm}
                  leadName={leads.find((l: any) => l.id === showWinModal)?.name || 'Lead'}
                />

                {/* Add Lead Modal */}
                <AddLeadModal
                  isOpen={showAddLeadModal}
                  onClose={() => setShowAddLeadModal(false)}
                  onSubmit={handleCreateLead}
                  newLeadName={newLeadName}
                  setNewLeadName={setNewLeadName}
                  newLeadBranch={newLeadBranch}
                  setNewLeadBranch={setNewLeadBranch}
                  isEnriching={isEnriching}
                  onEnrich={handleEnrich}
                  isSubmitting={createLeadMutation.isPending}
                  leads={leads}
                  enrichedData={enrichedData}
                />
              </div>
            </>
          )}
        </div>
      </main >
    </div >
  );
}
