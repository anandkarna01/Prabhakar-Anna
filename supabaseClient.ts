import { createClient, SupabaseClient } from '@supabase/supabase-js';

// =================================================================================
// ### IMPORTANT: PASTE YOUR SUPABASE CREDENTIALS HERE ###
// =================================================================================
// To make your app work online, you need to connect it to a free Supabase database.
//
// 1. In your Supabase project, go to Project Settings (the gear icon).
// 2. Find your Project URL in the "Data API" tab and copy it.
// 3. Find your "anon" key in the "API Keys" tab and copy it.
// 4. Paste them into the variables below.
// =================================================================================

const supabaseUrl = 'https://ilmzyznvivxqakwiragn.supabase.co'; // <-- PASTE YOUR PROJECT URL HERE
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsbXp5em52aXZ4cWFrd2lyYWduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzNzAzODEsImV4cCI6MjA3ODk0NjM4MX0.Jdui2ycMbD2PcHiilByB698egRvKX8XFsDpsKsZraj4'; // <-- PASTE YOUR ANON KEY HERE

// --- This code checks if you have replaced the placeholders ---
export const isSupabaseConfigured =
  supabaseUrl &&
  supabaseUrl !== 'https://ilmzyznvivxqakwiragn.supabase.co' &&
  supabaseAnonKey &&
  supabaseAnonKey !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsbXp5em52aXZ4cWFrd2lyYWduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzNzAzODEsImV4cCI6MjA3ODk0NjM4MX0.Jdui2ycMbD2PcHiilByB698egRvKX8XFsDpsKsZraj4';

// This creates the connection to your database, or returns null if not configured
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (!isSupabaseConfigured) {
    console.warn("Supabase is not configured. Please edit supabaseClient.ts and add your project URL and anon key for the app to function.");
}