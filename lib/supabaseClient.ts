import { createClient } from '@supabase/supabase-js';

// These should be in environment variables
const supabaseUrl = 'https://your-supabase-url.supabase.co';
const supabaseAnonKey = 'your-supabase-anon-key';

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL and/or Anon Key are not defined.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
