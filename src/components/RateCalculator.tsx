'use client';

import { useState, useEffect } from 'react';

export default function RateCalculator() {
    const [payRate, setPayRate] = useState<number>(15.00);
    const [markup, setMarkup] = useState<number>(45); // 45% default
    const [burden, setBurden] = useState<number>(18); // 18% default (Taxes, Insurance)
    const [billRate, setBillRate] = useState<number>(0);
    const [grossProfit, setGrossProfit] = useState<number>(0);
    const [gpPercent, setGpPercent] = useState<number>(0);

    useEffect(() => {
        // Formula: Bill Rate = Pay Rate * (1 + Markup / 100)
        const calculatedBillRate = payRate * (1 + markup / 100);
        setBillRate(calculatedBillRate);

        // Gross Profit = Bill Rate - (Pay Rate * (1 + Burden / 100))
        const totalCost = payRate * (1 + burden / 100);
        const profit = calculatedBillRate - totalCost;
        setGrossProfit(profit);

        // GP % = (Gross Profit / Bill Rate) * 100
        const gp = (profit / calculatedBillRate) * 100;
        setGpPercent(gp);
    }, [payRate, markup, burden]);

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-indigo-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Rate Calculator
            </h3>

            <div className="grid grid-cols-3 gap-3 mb-4">
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Pay Rate ($)</label>
                    <input
                        type="number"
                        value={payRate}
                        onChange={(e) => setPayRate(parseFloat(e.target.value) || 0)}
                        className="w-full rounded border-gray-300 text-sm py-1 px-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Markup (%)</label>
                    <input
                        type="number"
                        value={markup}
                        onChange={(e) => setMarkup(parseFloat(e.target.value) || 0)}
                        className="w-full rounded border-gray-300 text-sm py-1 px-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Burden (%)</label>
                    <input
                        type="number"
                        value={burden}
                        onChange={(e) => setBurden(parseFloat(e.target.value) || 0)}
                        className="w-full rounded border-gray-300 text-sm py-1 px-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded space-y-2">
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Bill Rate:</span>
                    <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">${billRate.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">Gross Profit ($):</span>
                    <span className={grossProfit >= 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                        ${grossProfit.toFixed(2)}
                    </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">GP Margin (%):</span>
                    <span className={gpPercent >= 20 ? "text-green-600 font-medium" : "text-yellow-600 font-medium"}>
                        {gpPercent.toFixed(1)}%
                    </span>
                </div>
            </div>
        </div>
    );
}
