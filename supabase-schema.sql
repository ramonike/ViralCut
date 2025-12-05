-- ============================================
-- SUPABASE DATABASE SCHEMA FOR VIRALCUTS
-- ============================================
-- Run this SQL in Supabase SQL Editor
-- This creates tables for user-scoped dashboard data

-- ============================================
-- 1. USER SETTINGS TABLE
-- ============================================
create table if not exists user_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  channel_name text,
  timezone text default 'America/Manaus',
  upload_targets jsonb default '["YouTube Shorts", "TikTok"]'::jsonb,
  daily_goal integer default 4,
  cta_text text,
  cta_link text,
  opus_api_key text,
  default_visibility text default 'public',
  default_category text default '24',
  default_tags text default 'shorts, viral, clips',
  notify_upload boolean default true,
  notify_error boolean default true,
  notify_weekly boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id)
);

-- ============================================
-- 2. UPLOAD QUEUE TABLE
-- ============================================
create table if not exists upload_queue (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text,
  source text, -- 'upload', 'scheduled', 'opus'
  platform text, -- 'YouTube Shorts', 'TikTok'
  status text default 'ready', -- 'ready', 'uploading', 'done', 'error'
  file_url text, -- Supabase Storage URL
  file_name text,
  scheduled_at timestamptz,
  publish_at timestamptz,
  privacy_status text default 'private',
  uploaded_url text, -- YouTube/TikTok URL after upload
  error_message text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_upload_queue_user on upload_queue(user_id);
create index if not exists idx_upload_queue_status on upload_queue(user_id, status);

-- ============================================
-- 3. VIDEO HISTORY TABLE
-- ============================================
create table if not exists video_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null,
  title text not null,
  platform text,
  url text,
  views integer default 0,
  likes integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_video_history_user_date on video_history(user_id, date desc);

-- ============================================
-- 4. YOUTUBE TOKENS TABLE
-- ============================================
create table if not exists youtube_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  account_id text not null,
  account_name text,
  account_avatar text,
  access_token text not null,
  refresh_token text,
  expires_at timestamptz,
  is_active boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, account_id)
);

create index if not exists idx_youtube_tokens_user on youtube_tokens(user_id);

-- ============================================
-- 5. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================
alter table user_settings enable row level security;
alter table upload_queue enable row level security;
alter table video_history enable row level security;
alter table youtube_tokens enable row level security;

-- ============================================
-- 6. RLS POLICIES - USER DATA ISOLATION
-- ============================================

-- User Settings Policies
drop policy if exists "Users can view own settings" on user_settings;
create policy "Users can view own settings" 
  on user_settings for select 
  using (auth.uid() = user_id);

drop policy if exists "Users can update own settings" on user_settings;
create policy "Users can update own settings" 
  on user_settings for update 
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own settings" on user_settings;
create policy "Users can insert own settings" 
  on user_settings for insert 
  with check (auth.uid() = user_id);

-- Upload Queue Policies
drop policy if exists "Users can view own queue" on upload_queue;
create policy "Users can view own queue" 
  on upload_queue for select 
  using (auth.uid() = user_id);

drop policy if exists "Users can manage own queue" on upload_queue;
create policy "Users can manage own queue" 
  on upload_queue for all 
  using (auth.uid() = user_id);

-- Video History Policies
drop policy if exists "Users can view own history" on video_history;
create policy "Users can view own history" 
  on video_history for select 
  using (auth.uid() = user_id);

drop policy if exists "Users can manage own history" on video_history;
create policy "Users can manage own history" 
  on video_history for all 
  using (auth.uid() = user_id);

-- YouTube Tokens Policies
drop policy if exists "Users can view own tokens" on youtube_tokens;
create policy "Users can view own tokens" 
  on youtube_tokens for select 
  using (auth.uid() = user_id);

drop policy if exists "Users can manage own tokens" on youtube_tokens;
create policy "Users can manage own tokens" 
  on youtube_tokens for all 
  using (auth.uid() = user_id);

-- ============================================
-- 7. STORAGE BUCKET FOR VIDEO FILES
-- ============================================
insert into storage.buckets (id, name, public)
values ('video-uploads', 'video-uploads', false)
on conflict (id) do nothing;

-- Storage Policies
drop policy if exists "Users can upload own videos" on storage.objects;
create policy "Users can upload own videos"
  on storage.objects for insert
  with check (
    bucket_id = 'video-uploads' 
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "Users can view own videos" on storage.objects;
create policy "Users can view own videos"
  on storage.objects for select
  using (
    bucket_id = 'video-uploads' 
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "Users can delete own videos" on storage.objects;
create policy "Users can delete own videos"
  on storage.objects for delete
  using (
    bucket_id = 'video-uploads' 
    and auth.uid()::text = (storage.foldername(name))[1]
  );
