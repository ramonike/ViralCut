import { useState, useEffect } from "react";
import { uploadVideo } from "../api/upload";
import { fetchChannelDetails } from "../api/youtube";

const STORAGE_KEY = "viralcuts_workflow_v1";

const defaultData = {
    settings: {
        channelName: "PetCutsBR",
        timezone: "America/Manaus",
        uploadTargets: ["YouTube Shorts", "TikTok"],
        dailyGoal: 4,
        ctaText: "🚀 Domine o Método ViralCuts",
        ctaLink: "https://seu-curso-ou-metodo.com",
    },
    checklists: [
        {
            id: "setup",
            title: "Configuração de Contas",
            items: [
                { id: "g_account", text: "Criar conta Google & canal YouTube", done: false },
                { id: "tiktok_acc", text: "Criar conta TikTok com mesmo nome", done: false },
                { id: "profile_img", text: "Imagem de perfil 800x800 exportada", done: false },
                { id: "banner", text: "Banner YouTube (2560x1440) com safe area", done: false },
                { id: "bio", text: "Bios escritas com CTA e links", done: false },
            ],
        },
        {
            id: "production",
            title: "Pipeline de Produção",
            items: [
                { id: "clips_ready", text: "10 cortes prontos (edição + legendas)", done: false },
                { id: "thumbs", text: "Templates de thumbnail prontos (Canva)", done: false },
                { id: "uploads_sched", text: "Uploads agendados (YouTube + TikTok)", done: false },
                { id: "zapier", text: "Zapier/Make > Airtable > upload flow configurado", done: false },
            ],
        },
        {
            id: "monetize",
            title: "Monetização & Crescimento",
            items: [
                { id: "ypp_check", text: "Monitorar requisitos YPP (inscritos + horas/shorts views)", done: false },
                { id: "partner", text: "Criar outreach para parcerias/TikTok Marketplace", done: false },
            ],
        },
    ],
    uploadQueue: [],
    analytics: {
        views24h: [],
    },
    auth: {
        youtubeToken: null,
        youtubeTokenExpiresAt: null,
    },
    channelStats: null, // { title, thumbnails, statistics: { subscriberCount, viewCount } }
    history: {}, // Format: { "YYYY-MM-DD": { completedItems: [], uploads: 0 } }
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
            settings: { ...defaultData.settings, ...(loaded.settings || {}) }
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
        } else {
            console.log("[useDashboardState] No token, clearing channelStats");
            setState(prev => ({ ...prev, channelStats: null }));
        }
    }, [state.auth.youtubeToken]);

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
                if (!newCompletedItems.includes(itemId)) newCompletedItems = [...newCompletedItems, itemId];
            } else {
                newCompletedItems = newCompletedItems.filter(id => id !== itemId);
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

                    // Only add to history if success
                    if (result.status === "success") {
                        newUploadedVideos = [
                            ...newUploadedVideos,
                            {
                                id: item.id,
                                title: item.title,
                                platform: item.platform,
                                url: result.url,
                                timestamp: Date.now()
                            }
                        ];
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

                // Avoid duplicates if already there
                if (!newUploadedVideos.find(v => v.id === id)) {
                    newUploadedVideos = [
                        ...newUploadedVideos,
                        {
                            id: item.id,
                            title: item.title,
                            platform: item.platform,
                            url: item.url, // Might be undefined if manual
                            timestamp: Date.now()
                        }
                    ];
                }

                return {
                    ...prev,
                    history: {
                        ...safeHistory,
                        [today]: {
                            ...currentHistory,
                            uploadedVideos: newUploadedVideos,
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
        setState((prev) => ({
            ...prev,
            checklists: prev.checklists.map((cl) =>
                cl.id === checklistId
                    ? { ...cl, items: cl.items.map((item) => ({ ...item, done: false })) }
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
            removeHistoryItem, // New action
        },
    };
}
