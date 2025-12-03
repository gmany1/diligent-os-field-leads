'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface OfflineContextType {
    isOnline: boolean;
    queue: any[];
    addToQueue: (request: any) => void;
}

const OfflineContext = createContext<OfflineContextType>({
    isOnline: true,
    queue: [],
    addToQueue: () => { },
});

export const useOffline = () => useContext(OfflineContext);

export const OfflineProvider = ({ children }: { children: React.ReactNode }) => {
    const [isOnline, setIsOnline] = useState(true);
    const [queue, setQueue] = useState<any[]>([]);

    useEffect(() => {
        // Initial check
        setIsOnline(navigator.onLine);

        // Load queue from local storage
        const savedQueue = localStorage.getItem('offlineQueue');
        if (savedQueue) {
            setQueue(JSON.parse(savedQueue));
        }

        const handleOnline = () => {
            setIsOnline(true);
            processQueue();
        };

        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const addToQueue = (request: any) => {
        const newQueue = [...queue, { ...request, id: Date.now() }];
        setQueue(newQueue);
        localStorage.setItem('offlineQueue', JSON.stringify(newQueue));
    };

    const processQueue = async () => {
        const currentQueue = JSON.parse(localStorage.getItem('offlineQueue') || '[]');
        if (currentQueue.length === 0) return;

        console.log('Processing offline queue...', currentQueue);

        const remainingQueue = [];

        for (const req of currentQueue) {
            try {
                const res = await fetch(req.url, {
                    method: req.method,
                    headers: req.headers,
                    body: req.body,
                });

                if (!res.ok) {
                    console.error('Failed to sync request:', req);
                    // If 500/400, maybe don't retry? For now, keep it simple.
                    // If it's a network error, it will throw and go to catch
                }
            } catch (error) {
                console.error('Sync error (still offline?):', error);
                remainingQueue.push(req);
            }
        }

        setQueue(remainingQueue);
        localStorage.setItem('offlineQueue', JSON.stringify(remainingQueue));

        if (remainingQueue.length === 0) {
            console.log('Offline queue synced successfully!');
            // Optional: Trigger a global refresh
            window.location.reload();
        }
    };

    return (
        <OfflineContext.Provider value={{ isOnline, queue, addToQueue }}>
            {children}
            {!isOnline && (
                <div className="fixed bottom-0 left-0 right-0 bg-red-600 text-white text-center py-2 text-sm z-50">
                    You are currently offline. Changes will be saved and synced when you reconnect.
                </div>
            )}
            {isOnline && queue.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-yellow-600 text-white text-center py-2 text-sm z-50">
                    Syncing {queue.length} offline changes...
                </div>
            )}
        </OfflineContext.Provider>
    );
};
