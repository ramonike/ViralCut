
// Mock implementation for development/demo purposes
// In a real scenario, this would hit the Opus Clip API endpoints

export async function uploadToOpus(file, apiKey) {
    console.log("[Opus API] Uploading file:", file.name);

    if (!apiKey || apiKey === "MOCK_KEY") {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    projectId: `opus_proj_${Date.now()}`,
                    status: "processing",
                    originalName: file.name
                });
            }, 2000);
        });
    }

    // Real API implementation would go here
    // 1. Get upload URL
    // 2. Upload file
    // 3. Create project
    throw new Error("Real API integration requires valid endpoints (not public yet)");
}

export async function createProjectFromUrl(url, apiKey) {
    console.log("[Opus API] Creating project from URL:", url);

    if (!apiKey || apiKey === "MOCK_KEY") {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    projectId: `opus_proj_url_${Date.now()}`,
                    status: "processing",
                    originalName: url // Use URL as name for now
                });
            }, 1500);
        });
    }

    // Real API Implementation
    try {
        const response = await fetch("https://api.opus.pro/api/clip-projects", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                videoUrl: url,
                // Default preferences
                curationPref: {
                    clipDurations: [[0, 60]], // Example: up to 60s
                    genre: "Auto"
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Failed to create project via API");
        }

        const data = await response.json();
        return {
            projectId: data.id, // API returns 'id'
            status: "processing",
            originalName: url
        };
    } catch (error) {
        console.error("Opus API Error:", error);
        throw error;
    }
}

export async function checkProjectStatus(projectId, apiKey) {
    console.log("[Opus API] Checking status for:", projectId);

    if (!apiKey || apiKey === "MOCK_KEY") {
        return new Promise((resolve) => {
            // Simulate processing time
            const random = Math.random();
            setTimeout(() => {
                if (random > 0.7) {
                    resolve({ status: "done" });
                } else {
                    resolve({ status: "processing" });
                }
            }, 1000);
        });
    }

    // Real API Implementation
    try {
        const response = await fetch(`https://api.opus.pro/api/clip-projects/${projectId}`, {
            headers: {
                "Authorization": `Bearer ${apiKey}`
            }
        });

        if (!response.ok) throw new Error("Failed to check status");

        const data = await response.json();
        return { status: data.status }; // Ensure this matches your app's expected status strings
    } catch (error) {
        console.error("Opus API Status Error:", error);
        throw error;
    }
}

export async function getClips(projectId, apiKey) {
    console.log("[Opus API] Getting clips for:", projectId);

    if (!apiKey || apiKey === "MOCK_KEY") {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        id: `clip_${Date.now()}_1`,
                        title: "Viral Moment 1 - High Engagement",
                        score: 95,
                        url: "https://example.com/clip1.mp4",
                        thumbnail: "https://picsum.photos/seed/clip1/120/200"
                    },
                    {
                        id: `clip_${Date.now()}_2`,
                        title: "Funny Segment - Must Watch",
                        score: 88,
                        url: "https://example.com/clip2.mp4",
                        thumbnail: "https://picsum.photos/seed/clip2/120/200"
                    },
                    {
                        id: `clip_${Date.now()}_3`,
                        title: "Insightful Quote",
                        score: 82,
                        url: "https://example.com/clip3.mp4",
                        thumbnail: "https://picsum.photos/seed/clip3/120/200"
                    }
                ]);
            }, 1500);
        });
    }

    // Real API Implementation
    try {
        const response = await fetch(`https://api.opus.pro/api/clip-projects/${projectId}/clips`, {
            headers: {
                "Authorization": `Bearer ${apiKey}`
            }
        });

        if (!response.ok) throw new Error("Failed to get clips");

        const data = await response.json();
        return data.clips.map(clip => ({
            id: clip.id,
            title: clip.title || "Untitled Clip",
            score: clip.viralityScore || 0,
            url: clip.downloadUrl,
            thumbnail: clip.thumbnailUrl
        }));
    } catch (error) {
        console.error("Opus API Clips Error:", error);
        return [];
    }
}
