'use client';

interface Commission {
    id: string;
    leadId: string;
    amount: number;
    rateApplied: number | string;
    createdAt: string;
}

interface PayrollExportProps {
    commissions: Commission[];
}

export default function PayrollExport({ commissions }: PayrollExportProps) {
    const handleExport = () => {
        // 1. Define Headers
        const headers = ['Commission ID', 'Lead ID', 'Amount ($)', 'Rate Applied', 'Date'];

        // 2. Format Rows
        const rows = commissions.map(c => [
            c.id,
            c.leadId,
            c.amount.toFixed(2),
            c.rateApplied,
            new Date(c.createdAt).toLocaleDateString()
        ]);

        // 3. Convert to CSV
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        // 4. Download File
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `payroll_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <button
            onClick={handleExport}
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:ring-gray-600 dark:hover:bg-gray-600"
        >
            <svg className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M4.5 2A2.5 2.5 0 002 4.5v11a2.5 2.5 0 002.5 2.5h11a2.5 2.5 0 002.5-2.5v-11A2.5 2.5 0 0015.5 2h-11zm1 2.5a1 1 0 00-1 1v11a1 1 0 001 1h11a1 1 0 001-1v-11a1 1 0 00-1-1h-11zM9 5.75a.75.75 0 01.75-.75h.5a.75.75 0 010 1.5h-.5A.75.75 0 019 5.75zm0 3a.75.75 0 01.75-.75h.5a.75.75 0 010 1.5h-.5A.75.75 0 019 8.75zm0 3a.75.75 0 01.75-.75h.5a.75.75 0 010 1.5h-.5a.75.75 0 01-.75-.75z" clipRule="evenodd" />
            </svg>
            Export Payroll CSV
        </button>
    );
}
