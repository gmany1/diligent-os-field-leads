'use client';

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Value', value: 22 },
    { name: 'Remaining', value: 78 },
];

const CX = 50;
const CY = 50;
const iR = 50;
const oR = 80;

const needle = (value: number, data: any[], cx: any, cy: any, iR: any, oR: any, color: any) => {
    let total = 0;
    data.forEach((v) => {
        total += v.value;
    });
    const ang = 180.0 * (1 - value / total);
    const length = (iR + 2 * oR) / 3;
    const sin = Math.sin(-Math.PI / 180 * ang);
    const cos = Math.cos(-Math.PI / 180 * ang);
    const r = 5;
    const x0 = cx + 5;
    const y0 = cy + 5;
    const xba = x0 + r * sin;
    const yba = y0 - r * cos;
    const xbb = x0 - r * sin;
    const ybb = y0 + r * cos;
    const xp = x0 + length * cos;
    const yp = y0 + length * sin;

    return [
        <circle cx={x0} cy={y0} r={r} fill={color} stroke="none" key="circle" />,
        <path d={`M${xba} ${yba}L${xbb} ${ybb} L${xp} ${yp} L${xba} ${yba}`} stroke="none" fill={color} key="path" />,
    ];
};

export default function ConversionGauge() {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center h-full">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Conversion Rate</h3>

            {/* Simplified Gauge Visual for "Glanceability" */}
            <div className="relative w-full h-32 flex items-end justify-center overflow-hidden">
                <div className="w-48 h-24 bg-gray-200 rounded-t-full relative overflow-hidden">
                    {/* Green Zone (Goal) */}
                    <div className="absolute bottom-0 right-0 w-full h-full bg-red-500 origin-bottom transition-all" style={{ transform: 'rotate(0deg)' }}></div>
                    <div className="absolute bottom-0 right-0 w-full h-full bg-yellow-400 origin-bottom transition-all" style={{ transform: 'rotate(45deg)' }}></div>
                    <div className="absolute bottom-0 right-0 w-full h-full bg-green-500 origin-bottom transition-all" style={{ transform: 'rotate(135deg)' }}></div>

                    {/* Mask for needle effect or just simple semi-circle fill */}
                    <div className="absolute top-4 left-4 right-4 bottom-0 bg-white dark:bg-gray-800 rounded-t-full flex items-end justify-center pb-2">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">22%</span>
                    </div>
                </div>
                {/* Needle */}
                <div className="absolute bottom-0 w-1 h-24 bg-gray-800 origin-bottom transform -rotate-45 z-10" style={{ left: 'calc(50% - 2px)' }}></div>
            </div>

            <div className="flex justify-between w-full text-xs text-gray-400 mt-2 px-4">
                <span>0%</span>
                <span className="text-green-600 font-bold">Goal: 25%</span>
                <span>100%</span>
            </div>
        </div>
    );
}
