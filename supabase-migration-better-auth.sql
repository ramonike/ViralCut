-- ============================================
-- UPDATE SCHEMA TO USE BETTER AUTH USER IDS
-- ============================================
-- Run this SQL in Supabase SQL Editor
-- This modifies tables to accept Better Auth user IDs (text) instead of Supabase Auth UUIDs

-- STEP 1: Drop RLS policies first (they depend on the column type)
drop policy if exists "Users can view own settings" on user_settings;
drop policy if exists "Users can update own settings" on user_settings;
drop policy if exists "Users can insert own settings" on user_settings;
drop policy if exists "Users can view own queue" on upload_queue;
drop policy if exists "Users can manage own queue" on upload_queue;
drop policy if exists "Users can view own history" on video_history;
drop policy if exists "Users can manage own history" on video_history;
drop policy if exists "Users can view own tokens" on youtube_tokens;
drop policy if exists "Users can manage own tokens" on youtube_tokens;

-- STEP 2: Disable RLS
alter table user_settings disable row level security;
alter table upload_queue disable row level security;
alter table video_history disable row level security;
alter table youtube_tokens disable row level security;

-- STEP 3: Drop foreign key constraints
alter table user_settings drop constraint if exists user_settings_user_id_fkey;
alter table upload_queue drop constraint if exists upload_queue_user_id_fkey;
alter table video_history drop constraint if exists video_history_user_id_fkey;
alter table youtube_tokens drop constraint if exists youtube_tokens_user_id_fkey;

-- STEP 4: Change user_id columns from uuid to text
alter table user_settings alter column user_id type text;
alter table upload_queue alter column user_id type text;
alter table video_history alter column user_id type text;
alter table youtube_tokens alter column user_id type text;

-- STEP 5: Recreate indexes
drop index if exists idx_upload_queue_user;
drop index if exists idx_upload_queue_status;
drop index if exists idx_video_history_user_date;
drop index if exists idx_youtube_tokens_user;

create index idx_upload_queue_user on upload_queue(user_id);
create index idx_upload_queue_status on upload_queue(user_id, status);
create index idx_video_history_user_date on video_history(user_id, date desc);
create index idx_youtube_tokens_user on youtube_tokens(user_id);

-- IMPORTANT: RLS is disabled since we're using Better Auth (not Supabase Auth)
-- The application will handle authorization
-- Make sure to use the anon key (not service_role) in your application

