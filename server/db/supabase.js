import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://wpguzmkmxpwlliksyauv.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwZ3V6bWtteHB3bGxpa3N5YXV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwMTc5MDEsImV4cCI6MjA3OTU5MzkwMX0.fZWEDSbM5_pzjlCb7PlCCUhqWhq3VBzHhg2qa_11Kz4';

export const supabase = createClient(supabaseUrl, supabaseKey);
