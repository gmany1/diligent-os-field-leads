'use client';

import { useQuery } from '@tanstack/react-query';
import { User, Mail, Phone, MapPin, Save, Server, Camera } from 'lucide-react';

async function fetchData() {
    const res = await fetch('/api/settings/profile');
    if (!res.ok) throw new Error('Failed to fetch data');
    return res.json();
}

export default function ProfilePage() {
    const { data, isLoading, error } = useQuery({ queryKey: ['profile'], queryFn: fetchData });
    if (isLoading) return <div className="p-8">Loading profile...</div>;
    if (error) return <div className="p-8 text-red-500">Error loading data</div>;

    const profile = data?.data || {};

    return (
        <div className="p-8 space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                <User className="mr-3 text-indigo-600" /> My Profile
            </h1>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="h-32 bg-indigo-600"></div>
                <div className="px-8 pb-8">
                    <div className="relative -mt-16 mb-6 flex justify-between items-end">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 bg-gray-200 flex items-center justify-center text-gray-400 text-4xl overflow-hidden shadow-lg">
                                {profile.avatar ? <img src={profile.avatar} alt="Profile" /> : <User size={48} />}
                            </div>
                            <button className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 shadow border-2 border-white dark:border-gray-800">
                                <Camera size={16} />
                            </button>
                        </div>
                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium shadow flex items-center">
                            <Save size={18} className="mr-2" /> Save Changes
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                                <input className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" defaultValue={profile.name} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                                <input className="w-full p-2 border rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-500" readOnly defaultValue={profile.role} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
                                <textarea className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" rows={3} defaultValue={profile.bio} />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                    <input className="w-full pl-10 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" defaultValue={profile.email} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                    <input className="w-full pl-10 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" defaultValue={profile.phone} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-6 right-6 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 flex items-center space-x-3 z-50">
                <div className="relative">
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <Server size={20} className="text-gray-600 dark:text-gray-300" />
                </div>
                <div className="text-xs">
                    <p className="font-bold text-gray-900 dark:text-white">API Connected</p>
                    <p className="text-gray-500 dark:text-gray-400">Source: /api/settings/profile</p>
                </div>
            </div>
        </div>
    );
}
