export enum Role {
    EXECUTIVE = 'EXECUTIVE',
    MANAGER = 'MANAGER',
    FIELD_LEAD_REP = 'FIELD_LEAD_REP',
    IT_ADMIN = 'IT_ADMIN'
}

export function canViewGlobalDashboard(role: string): boolean {
    return role === Role.EXECUTIVE || role === Role.IT_ADMIN || role === Role.MANAGER;
}

export function canApproveQuote(role: string): boolean {
    return role === Role.EXECUTIVE || role === Role.MANAGER;
}

export function canViewTeamStats(role: string): boolean {
    return role === Role.EXECUTIVE || role === Role.MANAGER || role === Role.IT_ADMIN;
}

export function canManageUsers(role: string): boolean {
    return role === Role.IT_ADMIN;
}

export function canViewCommissionManager(role: string): boolean {
    return role === Role.FIELD_LEAD_REP;
}
