'use client';

interface DashboardSwitcherProps {
    currentRole: string;
    onRoleChange: (role: string) => void;
}

export default function DashboardSwitcher({ currentRole, onRoleChange }: DashboardSwitcherProps) {
    const roles = [
        { id: 'EXECUTIVE', label: 'Executive (CEO)' },
        { id: 'MANAGER', label: 'Manager' },
        { id: 'FIELD_LEAD_REP', label: 'Field Rep' },
        { id: 'IT_ADMIN', label: 'IT Admin' },
    ];

    return (
        <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow mb-6 inline-flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500 uppercase px-2">View As:</span>
            <div className="flex space-x-1">
                {roles.map((role) => (
                    <button
                        key={role.id}
                        onClick={() => onRoleChange(role.id)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${currentRole === role.id
                                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                            }`}
                    >
                        {role.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
