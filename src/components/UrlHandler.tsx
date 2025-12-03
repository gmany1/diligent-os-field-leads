'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface UrlHandlerProps {
    onStageChange: (stage: string) => void;
    onViewChange: (view: 'list' | 'kanban') => void;
    onRoleChange: (role: string) => void;
    currentRole: string;
}

export default function UrlHandler({ onStageChange, onViewChange, onRoleChange, currentRole }: UrlHandlerProps) {
    const searchParams = useSearchParams();

    useEffect(() => {
        const stage = searchParams.get('stage');
        const view = searchParams.get('view');

        if (stage) {
            onStageChange(stage);
            if (currentRole !== 'FIELD_LEAD_REP') onRoleChange('FIELD_LEAD_REP');
        }

        if (view === 'list' || view === 'kanban') {
            onViewChange(view as 'list' | 'kanban');
            if (currentRole !== 'FIELD_LEAD_REP') onRoleChange('FIELD_LEAD_REP');
        }
    }, [searchParams, currentRole, onStageChange, onViewChange, onRoleChange]);

    return null;
}
