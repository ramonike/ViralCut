import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create client only if credentials are available
let supabase = null;

if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
    console.warn('⚠️ Supabase credentials not configured. Using localStorage fallback.');
}

export { supabase };

// ============================================
// USER SETTINGS
// ============================================

export async function getUserSettings(userId) {
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user settings:', error);
        return null;
    }

    return data;
}

export async function upsertUserSettings(userId, settings) {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
        .from('user_settings')
        .upsert({
            user_id: userId,
            ...settings,
            updated_at: new Date().toISOString()
        }, {
            onConflict: 'user_id'
        })
        .select()
        .single();

    if (error) {
        console.error('Error upserting user settings:', error);
        throw error;
    }

    return data;
}

// ============================================
// UPLOAD QUEUE
// ============================================

export async function getUploadQueue(userId) {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('upload_queue')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching upload queue:', error);
        return [];
    }

    return data || [];
}

export async function addToUploadQueue(userId, item) {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
        .from('upload_queue')
        .insert({
            user_id: userId,
            ...item
        })
        .select()
        .single();

    if (error) {
        console.error('Error adding to upload queue:', error);
        throw error;
    }

    return data;
}

export async function updateUploadQueueItem(itemId, updates) {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
        .from('upload_queue')
        .update({
            ...updates,
            updated_at: new Date().toISOString()
        })
        .eq('id', itemId)
        .select()
        .single();

    if (error) {
        console.error('Error updating upload queue item:', error);
        throw error;
    }

    return data;
}

export async function deleteUploadQueueItem(itemId) {
    if (!supabase) throw new Error('Supabase not configured');

    const { error } = await supabase
        .from('upload_queue')
        .delete()
        .eq('id', itemId);

    if (error) {
        console.error('Error deleting upload queue item:', error);
        throw error;
    }
}

// ============================================
// VIDEO HISTORY
// ============================================

export async function getVideoHistory(userId) {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('video_history')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

    if (error) {
        console.error('Error fetching video history:', error);
        return [];
    }

    return data || [];
}

export async function addToVideoHistory(userId, video) {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
        .from('video_history')
        .insert({
            user_id: userId,
            ...video
        })
        .select()
        .single();

    if (error) {
        console.error('Error adding to video history:', error);
        throw error;
    }

    return data;
}

export async function updateVideoHistory(videoId, updates) {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
        .from('video_history')
        .update({
            ...updates,
            updated_at: new Date().toISOString()
        })
        .eq('id', videoId)
        .select()
        .single();

    if (error) {
        console.error('Error updating video history:', error);
        throw error;
    }

    return data;
}

export async function deleteVideoHistory(videoId) {
    if (!supabase) throw new Error('Supabase not configured');

    const { error } = await supabase
        .from('video_history')
        .delete()
        .eq('id', videoId);

    if (error) {
        console.error('Error deleting video history:', error);
        throw error;
    }
}

// ============================================
// YOUTUBE TOKENS
// ============================================

export async function getYouTubeTokens(userId) {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('youtube_tokens')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching YouTube tokens:', error);
        return [];
    }

    return data || [];
}

export async function upsertYouTubeToken(userId, token) {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
        .from('youtube_tokens')
        .upsert({
            user_id: userId,
            ...token,
            updated_at: new Date().toISOString()
        }, {
            onConflict: 'user_id,account_id'
        })
        .select()
        .single();

    if (error) {
        console.error('Error upserting YouTube token:', error);
        throw error;
    }

    return data;
}

export async function deleteYouTubeToken(tokenId) {
    if (!supabase) throw new Error('Supabase not configured');

    const { error } = await supabase
        .from('youtube_tokens')
        .delete()
        .eq('id', tokenId);

    if (error) {
        console.error('Error deleting YouTube token:', error);
        throw error;
    }
}

export async function setActiveYouTubeAccount(userId, accountId) {
    if (!supabase) throw new Error('Supabase not configured');

    // First, deactivate all accounts
    await supabase
        .from('youtube_tokens')
        .update({ is_active: false })
        .eq('user_id', userId);

    // Then activate the selected one
    const { data, error } = await supabase
        .from('youtube_tokens')
        .update({ is_active: true })
        .eq('user_id', userId)
        .eq('account_id', accountId)
        .select()
        .single();

    if (error) {
        console.error('Error setting active YouTube account:', error);
        throw error;
    }

    return data;
}

// ============================================
// FILE UPLOAD TO STORAGE
// ============================================

export async function uploadVideoFile(userId, file) {
    if (!supabase) throw new Error('Supabase not configured');

    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
        .from('video-uploads')
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
        });

    if (error) {
        console.error('Error uploading video file:', error);
        throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from('video-uploads')
        .getPublicUrl(fileName);

    return {
        path: data.path,
        url: publicUrl
    };
}

export async function deleteVideoFile(filePath) {
    if (!supabase) throw new Error('Supabase not configured');

    const { error } = await supabase.storage
        .from('video-uploads')
        .remove([filePath]);

    if (error) {
        console.error('Error deleting video file:', error);
        throw error;
    }
}
