import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Notification Settings | DiligentOS',
    description: 'Manage your notification preferences',
};

export default function NotificationsPage() {
    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notification Settings</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Manage how and when you receive notifications
                </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="space-y-6">
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Email Notifications</h2>
                        <div className="space-y-3">
                            <label className="flex items-center">
                                <input type="checkbox" className="mr-3" defaultChecked />
                                <span>New lead assignments</span>
                            </label>
                            <label className="flex items-center">
                                <input type="checkbox" className="mr-3" defaultChecked />
                                <span>Quote approvals</span>
                            </label>
                            <label className="flex items-center">
                                <input type="checkbox" className="mr-3" />
                                <span>Daily summary</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold mb-4">Push Notifications</h2>
                        <div className="space-y-3">
                            <label className="flex items-center">
                                <input type="checkbox" className="mr-3" defaultChecked />
                                <span>Activity reminders</span>
                            </label>
                            <label className="flex items-center">
                                <input type="checkbox" className="mr-3" defaultChecked />
                                <span>Commission updates</span>
                            </label>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                            Save Preferences
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
