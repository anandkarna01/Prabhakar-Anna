import { createClient } from '@supabase/supabase-js';

// IMPORTANT: Replace these with your actual Supabase URL and Anon Key
// You can find these in your Supabase project settings under "API"
const supabaseUrl = 'YOUR_SUPABASE_PROJECT_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

if (!supabaseUrl || supabaseUrl === 'YOUR_SUPABASE_PROJECT_URL') {
    console.error("Supabase URL is not configured. Please add it to supabaseClient.ts");
}
if (!supabaseAnonKey || supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY') {
    console.error("Supabase Anon Key is not configured. Please add it to supabaseClient.ts");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
