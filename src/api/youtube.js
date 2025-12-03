
export async function fetchChannelDetails(token) {
    console.log("[YouTube API] fetchChannelDetails called with token:", token ? "EXISTS" : "NULL");

    if (!token || token.startsWith("MOCK_TOKEN")) {
        console.log("[YouTube API] Using MOCK data for token:", token);
        const isSecondary = token.includes("2") || token.length > 20;
        return {
            id: isSecondary ? "UC_mock_channel_id_2" : "UC_mock_channel_id",
            title: isSecondary ? "CiênciaPraBurro (Backup)" : "PetCutsBR (Mock)",
            description: isSecondary ? "Canal secundário de testes." : "Canal de cortes virais sobre pets e curiosidades animais. Videos novos todo dia!",
            customUrl: isSecondary ? "@cienciaburro_backup" : "@petcutsbr_mock",
            publishedAt: "2023-01-15T10:00:00Z",
            thumbnails: {
                default: { url: isSecondary ? "https://api.dicebear.com/7.x/avataaars/svg?seed=Science" : "https://api.dicebear.com/7.x/avataaars/svg?seed=PetCuts" },
                medium: { url: isSecondary ? "https://api.dicebear.com/7.x/avataaars/svg?seed=Science" : "https://api.dicebear.com/7.x/avataaars/svg?seed=PetCuts" },
                high: { url: isSecondary ? "https://api.dicebear.com/7.x/avataaars/svg?seed=Science" : "https://api.dicebear.com/7.x/avataaars/svg?seed=PetCuts" },
            },
            statistics: {
                viewCount: isSecondary ? "5432" : "154320",
                subscriberCount: isSecondary ? "120" : "1250",
                hiddenSubscriberCount: false,
                videoCount: isSecondary ? "5" : "45",
            },
            brandingSettings: {
                image: {
                    bannerExternalUrl: "https://picsum.photos/seed/banner/2560/1440"
                }
            }
        };
    }

    try {
        console.log("[YouTube API] Fetching real channel data...");
        const response = await fetch(
            "https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&mine=true",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            }
        );

        console.log("[YouTube API] Response status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("[YouTube API] Error response:", errorText);

            // Only treat as quota error if explicitly mentioned in response
            if (errorText.includes("quotaExceeded")) {
                throw new Error("YouTube API Error: Quota Exceeded");
            }

            throw new Error(`YouTube API Error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("[YouTube API] Response data:", data);

        if (data.items && data.items.length > 0) {
            const item = data.items[0];
            const channelData = {
                id: item.id,
                ...item.snippet,
                statistics: item.statistics,
                brandingSettings: item.brandingSettings,
            };
            console.log("[YouTube API] Channel data extracted:", channelData);
            return channelData;
        }
        console.warn("[YouTube API] No channel items found in response");
        return null;
    } catch (error) {
        console.error("[YouTube API] Failed to fetch channel details:", error);
        throw error;
    }
}

export async function fetchChannelVideos(token, maxResults = 50) {
    console.log("[YouTube API] fetchChannelVideos called, maxResults:", maxResults);

    if (!token || token.startsWith("MOCK_TOKEN")) {
        console.log("[YouTube API] Using MOCK videos");
        // Retornar vídeos mock para desenvolvimento
        return [
            {
                id: "mock_video_1",
                title: "Cachorro salva dono - Viral Short",
                publishedAt: new Date(Date.now() - 86400000).toISOString(), // 1 dia atrás
                thumbnails: {
                    default: { url: "https://picsum.photos/seed/video1/120/90" },
                    medium: { url: "https://picsum.photos/seed/video1/320/180" },
                },
                url: "https://youtube.com/shorts/mock1"
            },
            {
                id: "mock_video_2",
                title: "Gato fazendo truques incríveis",
                publishedAt: new Date(Date.now() - 172800000).toISOString(), // 2 dias atrás
                thumbnails: {
                    default: { url: "https://picsum.photos/seed/video2/120/90" },
                    medium: { url: "https://picsum.photos/seed/video2/320/180" },
                },
                url: "https://youtube.com/shorts/mock2"
            }
        ];
    }

    try {
        console.log("[YouTube API] Fetching channel videos...");

        // Primeiro, buscar o canal para pegar o upload playlist ID
        const channelResponse = await fetch(
            "https://www.googleapis.com/youtube/v3/channels?part=contentDetails&mine=true",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            }
        );

        if (!channelResponse.ok) {
            const errorText = await channelResponse.text();
            if (errorText.includes("quotaExceeded")) {
                throw new Error("YouTube API Error: Quota Exceeded");
            }
            throw new Error(`Failed to fetch channel: ${channelResponse.statusText}`);
        }

        const channelData = await channelResponse.json();

        if (!channelData.items || channelData.items.length === 0) {
            console.warn("[YouTube API] No channel found");
            return [];
        }

        const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;
        console.log("[YouTube API] Uploads playlist ID:", uploadsPlaylistId);

        // Buscar vídeos do playlist de uploads
        const videosResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=${maxResults}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            }
        );

        if (!videosResponse.ok) {
            const errorText = await videosResponse.text();
            if (errorText.includes("quotaExceeded")) {
                throw new Error("YouTube API Error: Quota Exceeded");
            }
            throw new Error(`Failed to fetch videos: ${videosResponse.statusText}`);
        }

        const videosData = await videosResponse.json();
        console.log("[YouTube API] Videos fetched:", videosData.items?.length || 0);

        if (!videosData.items || videosData.items.length === 0) {
            return [];
        }

        // Get video IDs to fetch statistics
        const videoIds = videosData.items.map(item => item.snippet.resourceId.videoId).join(',');

        // Fetch video statistics (views, likes, etc)
        const statsResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoIds}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            }
        );

        const statsData = await statsResponse.json();
        const statsMap = {};

        if (statsData.items) {
            statsData.items.forEach(item => {
                statsMap[item.id] = {
                    viewCount: parseInt(item.statistics.viewCount) || 0,
                    thumbnails: item.snippet.thumbnails
                };
            });
        }

        // Mapear para formato simplificado com estatísticas
        const videos = (videosData.items || []).map(item => {
            const videoId = item.snippet.resourceId.videoId;
            const stats = statsMap[videoId] || {};

            return {
                id: videoId,
                title: item.snippet.title,
                publishedAt: item.snippet.publishedAt,
                thumbnail: stats.thumbnails?.medium?.url || item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
                thumbnails: stats.thumbnails || item.snippet.thumbnails,
                viewCount: stats.viewCount || 0,
                url: `https://youtube.com/watch?v=${videoId}`
            };
        });

        console.log("[YouTube API] Videos with stats:", videos);
        return videos;
    } catch (error) {
        console.error("[YouTube API] Failed to fetch videos:", error);
        throw error;
    }
}

export async function fetchChannelAnalytics(token) {
    console.log("[YouTube API] fetchChannelAnalytics called");

    if (!token || token.startsWith("MOCK_TOKEN")) {
        console.log("[YouTube API] Using MOCK analytics");
        // Generate dynamic mock data for the last 7 days
        const mockData = [];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            mockData.push({
                name: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
                views: Math.floor(Math.random() * 500) + 100 // Random views between 100 and 600
            });
        }
        return mockData;
    }

    try {
        // Calculate dates: last 7 days
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 7);

        const formatDate = (date) => date.toISOString().split('T')[0];

        const url = `https://youtubeanalytics.googleapis.com/v2/reports?ids=channel==MINE&startDate=${formatDate(startDate)}&endDate=${formatDate(endDate)}&metrics=views&dimensions=day&sort=day`;

        console.log("[YouTube API] Fetching analytics from:", url);

        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("[YouTube API] Analytics error:", errorText);
            if (errorText.includes("quotaExceeded")) {
                throw new Error("Analytics API Error: Quota Exceeded");
            }
            throw new Error(`Analytics API Error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("[YouTube API] Analytics data:", data);

        // Transform rows: [day, views] -> { name: "DD/MM", views: 123 }
        if (data.rows && data.rows.length > 0) {
            return data.rows.map(row => {
                const [dateStr, views] = row;
                // Format dateStr (YYYY-MM-DD) to DD/MM
                const [year, month, day] = dateStr.split('-');
                return {
                    name: `${day}/${month}`,
                    views: views
                };
            });
        }

        return [];
    } catch (error) {
        console.error("[YouTube API] Failed to fetch analytics:", error);
        throw error;
    }
}

export async function searchVideos(token, query = "ciência curiosidades podcast") {
    console.log("[YouTube API] searchVideos called with query:", query);

    if (!token || token.startsWith("MOCK_TOKEN")) {
        console.log("[YouTube API] Using MOCK search results");
        return [
            {
                id: "mock_search_1",
                title: "O Universo Explicado - Podcast Ciência #42",
                channelTitle: "Ciência Todo Dia",
                thumbnails: { medium: { url: "https://picsum.photos/seed/science1/320/180" } },
                url: "https://youtube.com/watch?v=mock_search_1",
                viewCount: "154000",
                likeCount: "12000"
            },
            {
                id: "mock_search_2",
                title: "Mistérios do Cérebro Humano",
                channelTitle: "NeuroCiência",
                thumbnails: { medium: { url: "https://picsum.photos/seed/science2/320/180" } },
                url: "https://youtube.com/watch?v=mock_search_2",
                viewCount: "89000",
                likeCount: "5400"
            },
            {
                id: "mock_search_3",
                title: "Física Quântica para Iniciantes",
                channelTitle: "Física Fácil",
                thumbnails: { medium: { url: "https://picsum.photos/seed/science3/320/180" } },
                url: "https://youtube.com/watch?v=mock_search_3",
                viewCount: "210000",
                likeCount: "18000"
            }
        ];
    }

    try {
        // 1. Search for videos
        const searchResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=5&videoDuration=medium`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            }
        );

        if (!searchResponse.ok) {
            const errorText = await searchResponse.text();
            if (errorText.includes("quotaExceeded")) {
                throw new Error("Search API Error: Quota Exceeded");
            }
            throw new Error(`Search API Error: ${searchResponse.statusText}`);
        }

        const searchData = await searchResponse.json();

        if (!searchData.items || searchData.items.length === 0) {
            return [];
        }

        // 2. Get video IDs to fetch statistics
        const videoIds = searchData.items.map(item => item.id.videoId).join(',');

        // 3. Fetch statistics
        const statsResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            }
        );

        const statsData = await statsResponse.json();
        const statsMap = {};

        if (statsData.items) {
            statsData.items.forEach(item => {
                statsMap[item.id] = item.statistics;
            });
        }

        console.log("[YouTube API] Search results with stats:", searchData);

        return searchData.items.map(item => {
            const videoId = item.id.videoId;
            const stats = statsMap[videoId] || {};

            return {
                id: videoId,
                title: item.snippet.title,
                channelTitle: item.snippet.channelTitle,
                thumbnails: item.snippet.thumbnails,
                url: `https://youtube.com/watch?v=${videoId}`,
                viewCount: stats.viewCount,
                likeCount: stats.likeCount
            };
        });

    } catch (error) {
        console.error("[YouTube API] Failed to search videos:", error);
        throw error;
    }
}
