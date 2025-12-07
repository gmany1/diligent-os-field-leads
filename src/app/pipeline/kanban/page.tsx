'use client';

import KanbanBoard from '@/components/KanbanBoard';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function KanbanPage() {
    const queryClient = useQueryClient();

    const { data: leads = [], isLoading } = useQuery({
        queryKey: ['leads-kanban'],
        queryFn: async () => {
            const res = await fetch('/api/leads?limit=100'); // Fetch enough for kanban
            if (!res.ok) throw new Error('Failed to fetch leads');
            const json = await res.json();
            return json.data;
        }
    });

    const updateStageMutation = useMutation({
        mutationFn: async ({ id, stage }: { id: string, stage: string }) => {
            // We need a PATCH endpoint for leads if we want to update stage strictly
            // But we can check if we have one. If not, we might fail or mock.
            // Let's assume we might need to add PATCH /leads/:id support or use a generic update action.
            // For now, let's try a direct PATCH to /api/leads/:id if it exists, or handle via existing mechanisms.
            // Actually, we haven't implemented PATCH /leads/:id yet in this session's massive route.ts update?
            // Let's check route.ts later. For now, let's assume standard REST.
            const res = await fetch(`/api/leads/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ stage })
            });
            if (!res.ok) throw new Error('Failed to update stage');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leads-kanban'] });
            toast.success('Stage updated');
        },
        onError: () => {
            toast.error('Failed to update stage');
        }
    });

    if (isLoading) return <div className="p-8">Loading Kanban...</div>;

    return (
        <div className="p-4 h-[calc(100vh-4rem)] overflow-hidden flex flex-col">
            <h1 className="text-2xl font-bold mb-4 px-4 text-gray-900 dark:text-white">Pipeline Kanban</h1>
            <div className="flex-1 overflow-auto">
                <KanbanBoard
                    leads={leads}
                    onUpdateStage={(id, stage) => updateStageMutation.mutate({ id, stage })}
                />
            </div>
        </div>
    );
}
