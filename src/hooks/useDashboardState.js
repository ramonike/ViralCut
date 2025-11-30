import { useState, useEffect } from "react";
import { uploadVideo } from "../api/upload";
import { fetchChannelDetails, fetchChannelVideos, fetchChannelAnalytics, searchVideos } from "../api/youtube";
import { uploadToOpus, checkProjectStatus, getClips, createProjectFromUrl } from "../api/opus";

const STORAGE_KEY = "viralcuts_workflow_v1";

const defaultData = {
    settings: {
        channelName: "PetCutsBR",
        timezone: "America/Manaus",
        uploadTargets: ["YouTube Shorts", "TikTok"],
        dailyGoal: 4,
        ctaText: "🚀 Domine o Método ViralCuts",
        ctaLink: "https://seu-curso-ou-metodo.com",
        opusApiKey: "", // New setting
    },
    pipeline: {
        jobs: [], // { id, status, originalName, clips: [] }
    },
    checklists: [
        {
            id: "setup",
            title: "Configuração de Contas",
            items: [
                {
                    id: "g_account",
                    text: "Criar conta Google & canal YouTube",
                    done: false,
                    actions: [
                        { type: "google", url: "https://accounts.google.com/signup" },
                        { type: "youtube", url: "https://www.youtube.com/create_channel" }
                    ]
                },
                {
                    id: "tiktok_acc",
                    text: "Criar conta TikTok com mesmo nome",
                    done: false,
                    actions: [
                        { type: "tiktok", url: "https://www.tiktok.com/signup" }
                    ]
                },
                {
                    id: "profile_img",
                    text: "Imagem de perfil 800x800 exportada",
                    done: false,
                    actions: [
                        { type: "canva", url: "https://www.canva.com/create/profile-pictures/" }
                    ]
                },
                {
                    id: "banner",
                    text: "Banner YouTube (2560x1440) com safe area",
                    done: false,
                    actions: [
                        { type: "canva", url: "https://www.canva.com/create/youtube-banners/" }
                    ]
                },
                {
                    id: "bio",
                    text: "Bios escritas com CTA e links",
                    done: false,
                    actions: [
                        { type: "chatgpt", url: "https://chat.openai.com" }
                    ]
                },
            ],
        },
        {
            id: "production",
            title: "Pipeline de Produção",
            items: [
                {
                    id: "clips_ready",
                    text: "10 cortes prontos (edição + legendas)",
                    done: false,
                    actions: [
                        { type: "opus", url: "https://www.opus.pro/" }
                    ]
                },
                {
                    id: "thumbs",
                    text: "Templates de thumbnail prontos (Canva)",
                    done: false,
                    actions: [
                        { type: "canva", url: "https://www.canva.com/youtube-thumbnails/templates/" }
                    ]
                },
                {
                    id: "uploads_sched",
                    text: "Uploads agendados (YouTube + TikTok)",
                    done: false,
                    actions: [
                        { type: "youtube_studio", url: "https://studio.youtube.com" },
                        { type: "tiktok", url: "https://www.tiktok.com/upload" }
                    ]
                },
                {
                    id: "zapier",
                    text: "Zapier/Make > Airtable > upload flow configurado",
                    done: false,
                    actions: [
                        { type: "zapier", url: "https://zapier.com" },
                        { type: "make", url: "https://www.make.com" }
                    ]
                },
            ],
        },
        {
            id: "monetize",
            title: "Monetização & Crescimento",
            items: [
                {
                    id: "ypp_check",
                    text: "Monitorar requisitos YPP (inscritos + horas/shorts views)",
                    done: false,
                    actions: [
                        { type: "youtube_monetization", url: "https://studio.youtube.com/channel/monetization" }
                    ]
                },
                {
                    id: "partner",
                    text: "Criar outreach para parcerias/TikTok Marketplace",
                    done: false,
                    actions: [
                        { type: "tiktok_marketplace", url: "https://creator.tiktok.com/creator-marketplace" }
                    ]
                },
            ],
        },
    ],
    uploadQueue: [],
    analytics: {
        views24h: [],
    },
    recentUploads: [], // Store fetched channel videos
    suggestions: [], // Store suggested videos for cuts
    auth: {
        youtubeToken: null,
        youtubeTokenExpiresAt: null,
    },
    channelStats: null, // { title, thumbnails, statistics: { subscriberCount, viewCount } }
    history: {}, // Format: { "YYYY-MM-DD": { completedItems: [], uploads: 0 } }
    cache: {
        channelStats: { data: null, timestamp: null },
        recentUploads: { data: null, timestamp: null },
        suggestions: { data: null, timestamp: null },
        analytics: { data: null, timestamp: null }
    },
    quotaExceeded: false
};

function loadState() {
    try {
        const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
        if (!raw) return defaultData;
        const loaded = JSON.parse(raw);
        // Ensure history and other new fields exist by merging with defaultData
        return {
            ...defaultData,
            ...loaded,
            history: loaded.history || {},
            channelStats: loaded.channelStats || null,
            settings: { ...defaultData.settings, ...(loaded.settings || {}) },
            pipeline: loaded.pipeline || { jobs: [] }
        };
    } catch (e) {
        console.error("Failed to load state", e);
        return defaultData;
    }
}

function saveState(state) {
    try {
        if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
        console.warn("Could not save state to localStorage", e);
    }
}

export function exportCSV(rows, filename = "viralcuts_export.csv") {
    const header = Object.keys(rows[0] || {}).join(",");
    const lines = rows.map((r) =>
        Object.values(r)
            .map((v) => `"${String(v).replace(/"/g, '""')}"`)
            .join(",")
    );
    const csv = [header, ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

export function useDashboardState() {
    const [state, setState] = useState(loadState);

    // Helper function to sync YouTube videos to calendar history
    const syncVideosToCalendar = (videos, currentHistory) => {
        const newHistory = { ...currentHistory };
        const videosByDate = {};

        // Group fetched videos by date
        videos.forEach(video => {
            const publishDate = new Date(video.publishedAt);
            const localDateStr = publishDate.toLocaleDateString('en-CA'); // YYYY-MM-DD in local timezone

            if (!videosByDate[localDateStr]) {
                videosByDate[localDateStr] = [];
            }
            videosByDate[localDateStr].push({
                id: video.id,
                title: video.title,
                type: 'youtube_video',
                url: video.url,
                thumbnail: video.thumbnail,
                views: video.viewCount || 0,
                publishedAt: video.publishedAt
            });
        });

        // Update history for each date found
        Object.keys(videosByDate).forEach(date => {
            const existingDay = newHistory[date] || { completedItems: [], uploads: 0 };

            // Keep only non-youtube items (checklist items) to avoid duplicates
            const otherItems = (existingDay.completedItems || []).filter(item => item.type !== 'youtube_video');

            // Combine
            const newCompletedItems = [...otherItems, ...videosByDate[date]];

            newHistory[date] = {
                ...existingDay,
                completedItems: newCompletedItems,
                uploads: videosByDate[date].length
            };
        });

        return newHistory;
    };

    useEffect(() => {
        saveState(state);
    }, [state]);

    // Auto-fetch channel stats when token changes
    useEffect(() => {
        console.log("[useDashboardState] Token changed:", state.auth.youtubeToken ? "EXISTS" : "NULL");
        console.log("[useDashboardState] Current channelStats:", state.channelStats);

        if (state.auth.youtubeToken) {
            console.log("[useDashboardState] Fetching channel details...");
            fetchChannelDetails(state.auth.youtubeToken)
                .then(stats => {
                    console.log("[useDashboardState] Received stats:", stats);
                    if (stats) {
                        setState(prev => ({ ...prev, channelStats: stats }));
                    }
                })
                .catch(err => {
                    console.error("[useDashboardState] Error fetching stats:", err);
                });

            // Also fetch recent videos
            fetchChannelVideos(state.auth.youtubeToken)
                .then(videos => {
                    console.log("[useDashboardState] Received videos:", videos?.length);
                    if (videos) {
                        // Sync videos to calendar
                        setState(prev => {
                            const newHistory = syncVideosToCalendar(videos, prev.history);
                            return {
                                ...prev,
                                recentUploads: videos,
                                history: newHistory
                            };
                        });
                    }
                })
                .catch(err => {
                    console.error("[useDashboardState] Error fetching videos:", err);
                });

            // Fetch Analytics
            fetchChannelAnalytics(state.auth.youtubeToken)
                .then(data => {
                    console.log("[useDashboardState] Received analytics:", data?.length);
                    if (data && data.length > 0) {
                        setState(prev => ({
                            ...prev,
                            analytics: { ...prev.analytics, views24h: data }
                        }));
                    }
                })
                .catch(err => {
                    console.error("[useDashboardState] Error fetching analytics:", err);
                });

            // Fetch Suggestions
            searchVideos(state.auth.youtubeToken, "podcast ciência curiosidades")
                .then(videos => {
                    console.log("[useDashboardState] Received suggestions:", videos?.length);
                    if (videos) {
                        setState(prev => ({ ...prev, suggestions: videos }));
                    }
                })
                .catch(err => {
                    console.error("[useDashboardState] Error fetching suggestions:", err);
                });
        } else {
            console.log("[useDashboardState] No token, clearing channelStats");
            setState(prev => ({ ...prev, channelStats: null }));
        }
    }, [state.auth.youtubeToken]);

    // Polling for scheduled uploads
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            state.uploadQueue.forEach(item => {
                if (item.status === "ready" && item.scheduledAt) {
                    const scheduledTime = new Date(item.scheduledAt);
                    if (scheduledTime <= now) {
                        console.log(`[AutoUpload] Triggering upload for ${item.title} (Scheduled: ${item.scheduledAt})`);
                        markQueueStatus(item.id, "uploading");
                    }
                }
            });
        }, 30000); // Check every 30 seconds

        return () => clearInterval(interval);
    }, [state.uploadQueue]);

    function toggleItem(checklistId, itemId) {
        const today = new Date().toLocaleDateString('en-CA');
        setState((prev) => {
            const newChecklists = prev.checklists.map((cl) =>
                cl.id === checklistId
                    ? {
                        ...cl,
                        items: cl.items.map((item) =>
                            item.id === itemId ? { ...item, done: !item.done } : item
                        ),
                    }
                    : cl
            );

            // Update history safely
            const safeHistory = prev.history || {};
            const currentHistory = safeHistory[today] || { completedItems: [], uploads: 0 };

            const checklist = newChecklists.find(c => c.id === checklistId);
            if (!checklist) return prev; // Safety check

            const item = checklist.items.find(i => i.id === itemId);
            if (!item) return prev; // Safety check

            const isNowDone = item.done;

            let newCompletedItems = currentHistory.completedItems || [];

            if (isNowDone) {
                // Check if already exists (handle both string IDs and objects)
                const exists = newCompletedItems.some(i => (typeof i === 'string' ? i === itemId : i.id === itemId));

                if (!exists) {
                    newCompletedItems = [
                        ...newCompletedItems,
                        {
                            id: itemId,
                            title: item.text,
                            type: 'checklist_item',
                            timestamp: Date.now()
                        }
                    ];
                }
            } else {
                // Remove item (handle both string IDs and objects)
                newCompletedItems = newCompletedItems.filter(i => (typeof i === 'string' ? i !== itemId : i.id !== itemId));
            }

            return {
                ...prev,
                checklists: newChecklists,
                history: {
                    ...safeHistory,
                    [today]: { ...currentHistory, completedItems: newCompletedItems }
                }
            };
        });
    }

    function addChecklistItem(selectedChecklist, text) {
        if (!text.trim()) return;
        const newLists = state.checklists.map((cl) => {
            if (cl.id !== selectedChecklist) return cl;
            return {
                ...cl,
                items: [
                    ...cl.items,
                    { id: `${selectedChecklist}_custom_${Date.now()}`, text: text.trim(), done: false },
                ],
            };
        });
        setState({ ...state, checklists: newLists });
    }

    function addToUploadQueue({ title, source = "manual", platform = "YouTube Shorts", scheduledAt = null, file = null }) {
        const item = {
            id: `q_${Date.now()}`,
            title,
            source,
            platform,
            scheduledAt,
            status: "ready",
            file,
        };
        setState({ ...state, uploadQueue: [...state.uploadQueue, item] });
    }

    function removeQueueItem(id) {
        setState((prev) => {
            // Remove from queue
            const newQueue = prev.uploadQueue.filter((q) => q.id !== id);

            // Remove from history (search in all days to be safe)
            const newHistory = { ...prev.history };
            let historyChanged = false;

            Object.keys(newHistory).forEach(date => {
                const dayData = newHistory[date];
                if (dayData.uploadedVideos && dayData.uploadedVideos.some(v => v.id === id)) {
                    const newVideos = dayData.uploadedVideos.filter(v => v.id !== id);
                    newHistory[date] = {
                        ...dayData,
                        uploadedVideos: newVideos,
                        uploads: newVideos.length
                    };
                    historyChanged = true;
                }
            });

            return {
                ...prev,
                uploadQueue: newQueue,
                history: historyChanged ? newHistory : prev.history
            };
        });
    }

    async function markQueueStatus(id, status) {
        const today = new Date().toLocaleDateString('en-CA');

        setState((prev) => ({
            ...prev,
            uploadQueue: prev.uploadQueue.map((q) =>
                q.id === id ? { ...q, status, error: undefined, url: undefined } : q
            ),
        }));

        if (status === "uploading") {
            const item = state.uploadQueue.find((q) => q.id === id);
            if (!item) return;
            try {
                const result = await uploadVideo(item, state.auth.youtubeToken, item.file);

                setState((prev) => {
                    const safeHistory = prev.history || {};
                    const currentHistory = safeHistory[today] || { completedItems: [], uploads: 0, uploadedVideos: [] };

                    let newUploadedVideos = currentHistory.uploadedVideos || [];
                    let newCompletedItems = currentHistory.completedItems || [];

                    // Only add to history if success
                    if (result.status === "success") {
                        const videoEntry = {
                            id: item.id,
                            title: item.title,
                            platform: item.platform,
                            url: result.url,
                            timestamp: Date.now(),
                            type: 'youtube_video', // Critical for SidebarRight filter
                            thumbnail: item.thumbnail || null, // Ensure thumbnail exists if possible
                            views: 0
                        };

                        newUploadedVideos = [...newUploadedVideos, videoEntry];

                        // Add to completedItems if not already there (avoid duplicates)
                        if (!newCompletedItems.some(i => i.id === item.id)) {
                            newCompletedItems = [...newCompletedItems, videoEntry];
                        }
                    }

                    return {
                        ...prev,
                        uploadQueue: prev.uploadQueue.map((q) =>
                            q.id === id
                                ? {
                                    ...q,
                                    status: result.status === "success" ? "done" : "error",
                                    url: result.url,
                                    error: result.error,
                                }
                                : q
                        ),
                        history: result.status === "success" ? {
                            ...safeHistory,
                            [today]: {
                                ...currentHistory,
                                uploadedVideos: newUploadedVideos,
                                completedItems: newCompletedItems,
                                uploads: newUploadedVideos.length // Update count
                            }
                        } : safeHistory
                    };
                });
            } catch (err) {
                setState((prev) => ({
                    ...prev,
                    uploadQueue: prev.uploadQueue.map((q) =>
                        q.id === id
                            ? { ...q, status: "error", error: "Erro inesperado no upload." }
                            : q
                    ),
                }));
            }
        } else if (status === "done") {
            // Manual mark as done (without upload process) - also add to history
            setState((prev) => {
                const item = prev.uploadQueue.find((q) => q.id === id);
                if (!item) return prev;

                const safeHistory = prev.history || {};
                const currentHistory = safeHistory[today] || { completedItems: [], uploads: 0, uploadedVideos: [] };
                let newUploadedVideos = currentHistory.uploadedVideos || [];
                let newCompletedItems = currentHistory.completedItems || [];

                const videoEntry = {
                    id: item.id,
                    title: item.title,
                    platform: item.platform,
                    url: item.url, // Might be undefined if manual
                    timestamp: Date.now(),
                    type: 'youtube_video',
                    thumbnail: item.thumbnail || null,
                    views: 0
                };

                // Avoid duplicates if already there
                if (!newUploadedVideos.find(v => v.id === id)) {
                    newUploadedVideos = [...newUploadedVideos, videoEntry];
                }

                if (!newCompletedItems.some(i => i.id === item.id)) {
                    newCompletedItems = [...newCompletedItems, videoEntry];
                }

                return {
                    ...prev,
                    history: {
                        ...safeHistory,
                        [today]: {
                            ...currentHistory,
                            uploadedVideos: newUploadedVideos,
                            completedItems: newCompletedItems,
                            uploads: newUploadedVideos.length
                        }
                    }
                };
            });
        }
    }

    function removeHistoryItem(date, videoId) {
        setState((prev) => {
            const safeHistory = prev.history || {};
            const dayData = safeHistory[date];
            if (!dayData || !dayData.uploadedVideos) return prev;

            const newVideos = dayData.uploadedVideos.filter(v => v.id !== videoId);

            return {
                ...prev,
                history: {
                    ...safeHistory,
                    [date]: {
                        ...dayData,
                        uploadedVideos: newVideos,
                        uploads: newVideos.length
                    }
                }
            };
        });
    }

    function resetChecklist(checklistId) {
        const defaultList = defaultData.checklists.find(c => c.id === checklistId);

        setState((prev) => ({
            ...prev,
            checklists: prev.checklists.map((cl) =>
                cl.id === checklistId
                    ? {
                        ...cl,
                        items: defaultList
                            ? defaultList.items.map(item => ({ ...item, done: false }))
                            : cl.items.map(item => ({ ...item, done: false }))
                    }
                    : cl
            ),
        }));
    }

    function startUploadQueue() {
        state.uploadQueue.forEach((item) => {
            if (item.status === "ready" || item.status === "error") {
                markQueueStatus(item.id, "uploading");
            }
        });
    }

    function updateSettings(newSettings) {
        setState({ ...state, settings: { ...state.settings, ...newSettings } });
    }

    async function setYouTubeToken(tokenResponse) {
        const expiresAt = Date.now() + (tokenResponse.expires_in * 1000);

        // Fetch details immediately if token is valid
        let stats = null;
        if (tokenResponse.access_token) {
            try {
                stats = await fetchChannelDetails(tokenResponse.access_token);
            } catch (e) {
                console.error("Failed to fetch initial stats", e);
            }
        }

        setState(prev => ({
            ...prev,
            auth: {
                ...prev.auth,
                youtubeToken: tokenResponse.access_token,
                youtubeTokenExpiresAt: expiresAt,
            },
            channelStats: stats || prev.channelStats
        }));
    }

    async function startOpusJob(input) {
        const apiKey = state.settings.opusApiKey;
        try {
            let project;
            if (typeof input === 'string') {
                // It's a URL
                project = await createProjectFromUrl(input, apiKey);
            } else {
                // It's a File
                project = await uploadToOpus(input, apiKey);
            }

            setState(prev => ({
                ...prev,
                pipeline: {
                    ...prev.pipeline,
                    jobs: [project, ...prev.pipeline.jobs]
                }
            }));
            return project;
        } catch (e) {
            console.error("Opus upload failed", e);
            throw e;
        }
    }

    async function checkOpusJob(jobId) {
        const apiKey = state.settings.opusApiKey;
        const job = state.pipeline.jobs.find(j => j.projectId === jobId);
        if (!job) return;

        try {
            const statusData = await checkProjectStatus(jobId, apiKey);

            let clips = [];
            if (statusData.status === "done") {
                clips = await getClips(jobId, apiKey);
            }

            setState(prev => ({
                ...prev,
                pipeline: {
                    ...prev.pipeline,
                    jobs: prev.pipeline.jobs.map(j =>
                        j.projectId === jobId
                            ? { ...j, status: statusData.status, clips: clips.length ? clips : j.clips }
                            : j
                    )
                }
            }));
        } catch (e) {
            console.error("Opus check failed", e);
        }
    }

    function removeOpusJob(projectId) {
        setState(prev => ({
            ...prev,
            pipeline: {
                ...prev.pipeline,
                jobs: prev.pipeline.jobs.filter(j => j.projectId !== projectId)
            }
        }));
    }

    async function refreshChannelStats(forceRefresh = false, customQuery = null) {
        if (!state.auth.youtubeToken) return;

        const CACHE_DURATION = 60 * 60 * 1000; // 1 hour
        const now = Date.now();

        const shouldUseCache = !forceRefresh && !customQuery && state.cache?.channelStats?.timestamp &&
            (now - state.cache.channelStats.timestamp) < CACHE_DURATION;

        if (shouldUseCache) {
            console.log("[refreshChannelStats] Using cached data");
            return true;
        }

        try {
            console.log("[refreshChannelStats] Fetching fresh data");

            // 1. Channel Details
            const stats = await fetchChannelDetails(state.auth.youtubeToken);

            // 2. Recent Videos
            const videos = await fetchChannelVideos(state.auth.youtubeToken);

            // 3. Suggestions (Search)
            let queryToUse = customQuery;
            if (!queryToUse) {
                const queries = ["curiosidades mundo", "ciência tecnologia", "fatos históricos", "animais incríveis", "mistérios universo", "dicas produtividade", "saúde bem estar"];
                queryToUse = queries[Math.floor(Math.random() * queries.length)];
            }
            console.log(`[refreshChannelStats] Searching for: ${queryToUse}`);
            const suggestions = await searchVideos(state.auth.youtubeToken, queryToUse);

            // Update State
            setState(prev => {
                const newHistory = videos ? syncVideosToCalendar(videos, prev.history) : prev.history;

                return {
                    ...prev,
                    channelStats: stats || prev.channelStats,
                    recentUploads: videos || prev.recentUploads,
                    suggestions: suggestions || prev.suggestions,
                    history: newHistory,
                    quotaExceeded: false,
                    cache: {
                        ...prev.cache,
                        channelStats: stats ? { data: stats, timestamp: now } : prev.cache.channelStats,
                        recentUploads: videos ? { data: videos, timestamp: now } : prev.cache.recentUploads,
                        suggestions: suggestions ? { data: suggestions, timestamp: now } : prev.cache.suggestions
                    }
                };
            });

            return true;
        } catch (e) {
            console.error("Failed to refresh stats", e);

            if (e.message && e.message.includes("quota")) {
                setState(prev => ({ ...prev, quotaExceeded: true }));
                console.warn("YouTube API quota exceeded.");

                // 1. Try to use cached data
                if (state.cache?.channelStats?.data) {
                    console.log("Using cached data due to quota limit.");
                    setState(prev => ({
                        ...prev,
                        channelStats: prev.cache.channelStats.data,
                        recentUploads: prev.cache.recentUploads?.data || prev.recentUploads,
                        suggestions: prev.cache.suggestions?.data || prev.suggestions,
                        analytics: prev.cache.analytics?.data ?
                            { ...prev.analytics, views24h: prev.cache.analytics.data } :
                            prev.analytics
                    }));
                }
                // 2. If no cache, use MOCK data so UI doesn't break
                else {
                    console.log("No cache available. Using MOCK data fallback.");
                    try {
                        const mockStats = await fetchChannelDetails("MOCK_TOKEN");
                        const mockVideos = await fetchChannelVideos("MOCK_TOKEN");
                        const mockAnalytics = await fetchChannelAnalytics("MOCK_TOKEN");
                        const mockSuggestions = await searchVideos("MOCK_TOKEN", "mock query");

                        if (mockStats) {
                            setState(prev => ({
                                ...prev,
                                channelStats: mockStats,
                                recentUploads: mockVideos || [],
                                suggestions: mockSuggestions || [],
                                analytics: { ...prev.analytics, views24h: mockAnalytics || [] },
                            }));
                        }
                    } catch (mockErr) {
                        console.error("Failed to load mock fallback", mockErr);
                    }
                }
            }

            return false;
        }
    }

    function resetState() {
        setState(defaultData);
    }

    return {
        state,
        setState,
        actions: {
            toggleItem,
            addChecklistItem,
            addToUploadQueue,
            removeQueueItem,
            markQueueStatus,
            startUploadQueue,
            updateSettings,
            setYouTubeToken,
            resetState,
            resetChecklist,
            removeHistoryItem,
            startOpusJob,
            checkOpusJob,
            removeOpusJob,
            refreshChannelStats,
        },
    };
}
