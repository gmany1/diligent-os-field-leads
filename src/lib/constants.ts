export const BRANCHES = [
    { id: 'moreno-valley', name: 'Moreno Valley', address: '12220 Pigeon Pass Rd Suite I, Moreno Valley, CA 92557' },
    { id: 'el-monte', name: 'El Monte', address: '9814 Garvey Ave, El Monte, CA 91733' },
    { id: 'norwalk', name: 'Norwalk', address: '11902 Firestone Blvd, Norwalk, CA 90650' },
    { id: 'los-angeles', name: 'Los Angeles', address: '2820 S Vermont Ave STE 21, Los Angeles, CA 90007' },
    { id: 'san-antonio', name: 'San Antonio', address: '8546 Broadway Suite 212, San Antonio, TX 78217' },
] as const;

export type BranchId = typeof BRANCHES[number]['id'];
