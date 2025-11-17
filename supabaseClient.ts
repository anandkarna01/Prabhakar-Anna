import { createClient, SupabaseClient } from '@supabase/supabase-js';

// --- User's Supabase credentials have been configured ---
const supabaseUrl: string = 'https://ilmzyznvivxqakwiragn.supabase.co';
const supabaseAnonKey: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsbXp5em52aXZ4cWFrd2lyYWduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzNzAzODEsImV4cCI6MjA3ODk0NjM4MX0.Jdui2ycMbD2PcHiilByB698egRvKX8XFsDpsKsZraj4';
// ---------------------------------------------------------

/**
 * This check is crucial. It prevents the app from crashing if credentials are not set
 * and allows us to show a helpful configuration screen instead.
 */
export const isSupabaseConfigured =
  supabaseUrl !== 'PASTE_YOUR_PROJECT_URL_HERE' &&
  supabaseUrl.startsWith('http') &&
  supabaseAnonKey !== 'PASTE_YOUR_ANON_KEY_HERE' &&
  supabaseAnonKey.length > 50; // Basic check for a real key

/**
 * We initialize supabase to null. If it's not configured, our API calls will
 * see this null value and gracefully return empty data instead of crashing.
 */
let supabase: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error("Error creating Supabase client. Please check your URL and Key.", error);
  }
} else {
  // This warning will appear in your browser's developer console.
  console.warn(`
    ****************************************************************
    ** SUPABASE IS NOT CONFIGURED **
    Please open supabaseClient.ts and paste your credentials.
    The app will not be able to save or load data until you do.
    ****************************************************************
  `);
}

// Export the configured client (or null if not configured) for the API to use.
export { supabase };
