import { useEffect, useState } from 'react';
import { useSupabaseAuth } from '../lib/useSupabaseAuth';
import {
    getUserSettings,
    upsertUserSettings,
    getUploadQueue,
    addToUploadQueue as dbAddToUploadQueue,
    updateUploadQueueItem,
    deleteUploadQueueItem,
    getVideoHistory,
    addToVideoHistory as dbAddToVideoHistory,
    getYouTubeTokens,
    upsertYouTubeToken,
} from '../lib/supabase';

/**
 * Hook that syncs dashboard state with Supabase
 * Wraps the existing useDashboardState with database persistence
 */
export function useSupabaseDashboard() {
    const { user, loading: authLoading } = useSupabaseAuth();
    const [loading, setLoading] = useState(true);
    const [uploadQueue, setUploadQueue] = useState([]);
    const [history, setHistory] = useState({});
    const [settings, setSettings] = useState(null);

    // Load data from Supabase when user logs in
    useEffect(() => {
        if (!user?.id || authLoading) return;

        const loadData = async () => {
            try {
                setLoading(true);

                // Load settings
                const userSettings = await getUserSettings(user.id);
                if (userSettings) {
                    setSettings(userSettings);
                }

                // Load upload queue
                const queue = await getUploadQueue(user.id);
                setUploadQueue(queue);

                // Load video history
                const videoHistory = await getVideoHistory(user.id);

                // Convert array to object grouped by date
                const historyByDate = {};
                videoHistory.forEach(video => {
                    const dateStr = video.date;
                    if (!historyByDate[dateStr]) {
                        historyByDate[dateStr] = {
                            completedItems: [],
                            uploads: 0
                        };
                    }
                    historyByDate[dateStr].completedItems.push({
                        id: video.id,
                        title: video.title,
                        type: 'youtube_video',
                        url: video.url,
                        views: video.views || 0,
                        likes: video.likes || 0
                    });
                    historyByDate[dateStr].uploads += 1;
                });

                setHistory(historyByDate);

            } catch (error) {
                console.error('Error loading data from Supabase:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [user?.id, authLoading]);

    // Save settings to Supabase (debounced)
    const saveSettings = async (newSettings) => {
        if (!user?.id) return;

        try {
            await upsertUserSettings(user.id, newSettings);
            setSettings(newSettings);
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    };

    // Add to upload queue
    const addToQueue = async (item) => {
        if (!user?.id) return;

        try {
            const newItem = await dbAddToUploadQueue(user.id, item);
            setUploadQueue(prev => [...prev, newItem]);
            return newItem;
        } catch (error) {
            console.error('Error adding to queue:', error);
            throw error;
        }
    };

    // Update queue item status
    const updateQueueStatus = async (itemId, status, updates = {}) => {
        try {
            const updatedItem = await updateUploadQueueItem(itemId, {
                status,
                ...updates
            });

            setUploadQueue(prev =>
                prev.map(item => item.id === itemId ? updatedItem : item)
            );

            return updatedItem;
        } catch (error) {
            console.error('Error updating queue status:', error);
            throw error;
        }
    };

    // Remove from queue
    const removeFromQueue = async (itemId) => {
        try {
            await deleteUploadQueueItem(itemId);
            setUploadQueue(prev => prev.filter(item => item.id !== itemId));
        } catch (error) {
            console.error('Error removing from queue:', error);
            throw error;
        }
    };

    // Add to video history
    const addToHistory = async (date, video) => {
        if (!user?.id) return;

        try {
            const newVideo = await dbAddToVideoHistory(user.id, {
                date,
                title: video.title,
                platform: video.platform || 'YouTube Shorts',
                url: video.url,
                views: video.views || 0,
                likes: video.likes || 0
            });

            // Update local state
            setHistory(prev => {
                const dateHistory = prev[date] || { completedItems: [], uploads: 0 };
                return {
                    ...prev,
                    [date]: {
                        ...dateHistory,
                        completedItems: [
                            ...dateHistory.completedItems,
                            {
                                id: newVideo.id,
                                title: newVideo.title,
                                type: 'youtube_video',
                                url: newVideo.url,
                                views: newVideo.views,
                                likes: newVideo.likes
                            }
                        ],
                        uploads: dateHistory.uploads + 1
                    }
                };
            });

            return newVideo;
        } catch (error) {
            console.error('Error adding to history:', error);
            throw error;
        }
    };

    return {
        user,
        loading: authLoading || loading,
        uploadQueue,
        history,
        settings,
        actions: {
            saveSettings,
            addToQueue,
            updateQueueStatus,
            removeFromQueue,
            addToHistory,
        }
    };
}
