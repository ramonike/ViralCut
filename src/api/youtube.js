
export async function fetchChannelDetails(token) {
    console.log("[YouTube API] fetchChannelDetails called with token:", token ? "EXISTS" : "NULL");

    if (!token || token === "MOCK_TOKEN") {
        console.log("[YouTube API] Using MOCK data");
        return {
            title: "Canal de Teste (Mock)",
            description: "Este é um canal simulado para fins de desenvolvimento. Aqui você veria a descrição real do seu canal do YouTube, com detalhes sobre seu conteúdo e programação.",
            customUrl: "@teste_mock",
            publishedAt: "2023-01-15T10:00:00Z",
            thumbnails: {
                default: { url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" },
                medium: { url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" },
                high: { url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" },
            },
            brandingSettings: {
                image: {
                    bannerExternalUrl: "https://picsum.photos/seed/viralcuts/2560/1440"
                }
            },
            statistics: {
                viewCount: "15430",
                subscriberCount: "1250",
                hiddenSubscriberCount: false,
                videoCount: "42",
            },
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
            throw new Error(`YouTube API Error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("[YouTube API] Response data:", data);

        if (data.items && data.items.length > 0) {
            const item = data.items[0];
            const channelData = {
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

    if (!token || token === "MOCK_TOKEN") {
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
            throw new Error(`Failed to fetch videos: ${videosResponse.statusText}`);
        }

        const videosData = await videosResponse.json();
        console.log("[YouTube API] Videos fetched:", videosData.items?.length || 0);

        // Mapear para formato simplificado
        const videos = (videosData.items || []).map(item => ({
            id: item.snippet.resourceId.videoId,
            title: item.snippet.title,
            publishedAt: item.snippet.publishedAt,
            thumbnails: item.snippet.thumbnails,
            url: `https://youtube.com/watch?v=${item.snippet.resourceId.videoId}`
        }));

        return videos;
    } catch (error) {
        console.error("[YouTube API] Failed to fetch videos:", error);
        throw error;
    }
}
