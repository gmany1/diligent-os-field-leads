'use client';

import { toast } from 'sonner';

const RECENT_WINS = [
    { id: '1', company: 'Innovatech Corp', value: 15000, rep: 'Sarah Connor', date: '2 hrs ago', vacancies: 3 },
    { id: '2', company: 'Global Logistics', value: 8500, rep: 'Kyle Reese', date: '5 hrs ago', vacancies: 1 },
    { id: '3', company: 'BuildRight Inc', value: 22000, rep: 'Sarah Connor', date: '1 day ago', vacancies: 5 },
];

export default function RecentWins() {
    const handleTransfer = (company: string) => {
        toast.success(`✅ ${company} transferred to Recruitment Team!`, {
            description: 'Recruiters have been notified to start sourcing.'
        });
    };

    return (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden h-full">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Wins (Validation)</h3>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Live Feed</span>
            </div>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {RECENT_WINS.map((win) => (
                    <li key={win.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-sm font-bold text-gray-900 dark:text-white">{win.company}</h4>
                                <p className="text-xs text-gray-500 mt-1">
                                    Won by <span className="font-medium text-indigo-600">{win.rep}</span> • {win.date}
                                </p>
                                <div className="mt-2 flex gap-2">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                        ${win.value.toLocaleString()}
                                    </span>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                        {win.vacancies} Vacancies
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => handleTransfer(win.company)}
                                className="ml-4 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1"
                            >
                                <span>Transfer</span>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-3 text-center">
                <button className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-medium">
                    View All Wins
                </button>
            </div>
        </div>
    );
}
