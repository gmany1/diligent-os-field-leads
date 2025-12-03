'use client';

import { useState } from 'react';
import { updateUserRole } from '@/lib/admin-actions';
import { toast } from 'sonner';

export default function RoleSelector({ userId, currentRole }: { userId: string, currentRole: string }) {
    const [role, setRole] = useState(currentRole);
    const [loading, setLoading] = useState(false);

    const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newRole = e.target.value;
        setRole(newRole);
        setLoading(true);

        const res = await updateUserRole(userId, newRole);

        if (res.success) {
            toast.success('Role updated successfully');
        } else {
            toast.error('Failed to update role');
            setRole(currentRole); // Revert
        }
        setLoading(false);
    };

    return (
        <select
            value={role}
            onChange={handleChange}
            disabled={loading}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-2"
        >
            <option value="FIELD_LEAD_REP">Field Rep</option>
            <option value="MANAGER">Manager</option>
            <option value="EXECUTIVE">Executive</option>
            <option value="IT_ADMIN">IT Admin</option>
        </select>
    );
}
