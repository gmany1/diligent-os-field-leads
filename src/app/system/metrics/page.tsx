'use client';

import { useState, useEffect } from 'react';
import { Cpu, HardDrive, Activity, Zap, Server } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function SystemMetricsPage() {
  // Initial data generation
  const generateInitialData = () => {
    const data = [];
    const now = new Date();
    for (let i = 20; i >= 0; i--) {
      data.push({
        time: new Date(now.getTime() - i * 2000).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        cpu: Math.floor(Math.random() * (60 - 30) + 30),
        memory: Math.floor(Math.random() * (70 - 50) + 50),
        requests: Math.floor(Math.random() * (1000 - 500) + 500),
      });
    }
    return data;
  };

  const [data, setData] = useState(generateInitialData());
  const [currentStats, setCurrentStats] = useState({
    cpu: 45,
    memory: 62,
    network: '1.2 GB/s',
    requests: 840
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prevData => {
        const now = new Date();
        const newCpu = Math.floor(Math.random() * (65 - 25) + 25);
        const newMem = Math.floor(Math.random() * (75 - 45) + 45);
        const newReq = Math.floor(Math.random() * (1200 - 400) + 400);

        const newPoint = {
          time: now.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          cpu: newCpu,
          memory: newMem,
          requests: newReq
        };

        setCurrentStats({
          cpu: newCpu,
          memory: newMem,
          network: (Math.random() * (2.5 - 0.5) + 0.5).toFixed(1) + ' GB/s',
          requests: newReq
        });

        // Keep only last 20 points
        return [...prevData.slice(1), newPoint];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <Activity className="mr-3 text-indigo-600" /> System Metrics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Real-time resource usage and performance telemetry</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full animate-pulse">
          <span className="w-2 h-2 bg-green-600 rounded-full"></span>
          <span className="font-medium">Live Stream</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'CPU Usage', value: `${currentStats.cpu}%`, icon: Cpu, color: 'text-indigo-600' },
          { label: 'Memory', value: `${currentStats.memory}%`, icon: HardDrive, color: 'text-purple-600' },
          { label: 'Network I/O', value: currentStats.network, icon: Server, color: 'text-blue-600' },
          { label: 'Requests/sec', value: currentStats.requests, icon: Zap, color: 'text-yellow-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex items-center justify-between transition-all duration-300">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1 tabular-nums">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-full bg-gray-50 dark:bg-gray-700/50 ${stat.color}`}>
              <stat.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">CPU & Memory Utilization</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorMem" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9333ea" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#9333ea" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
                  itemStyle={{ color: '#E5E7EB' }}
                />
                <Area
                  type="monotone"
                  dataKey="cpu"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorCpu)"
                  name="CPU %"
                  animationDuration={500}
                />
                <Area
                  type="monotone"
                  dataKey="memory"
                  stroke="#9333ea"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorMem)"
                  name="Memory %"
                  animationDuration={500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">Request Throughput</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ca8a04" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ca8a04" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
                  itemStyle={{ color: '#E5E7EB' }}
                />
                <Area
                  type="monotone"
                  dataKey="requests"
                  stroke="#ca8a04"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorReq)"
                  name="Req/sec"
                  animationDuration={500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
