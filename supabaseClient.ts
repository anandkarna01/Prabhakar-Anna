// supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sdvfusqulliotvlodebm.supabase.co'; // <-- Paste your URL from Supabase here
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkdmZ1c3F1bGxpb3R2bG9kZWJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3OTUxMjQsImV4cCI6MjA3ODM3MTEyNH0.Tpr0ANIhoHdPtOsU3UE4o9-oFqE6-Bs3AiGs1wzbHI8'; // <-- Paste your public anon key from Supabase here

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
