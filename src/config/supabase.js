// Supabase configuration
// Get your credentials from: https://supabase.com/dashboard → Your Project → Settings → API
// Set them as environment variables: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
// For local dev: Create .env file with these variables
// For GitHub Pages: Add as repository secrets in GitHub Settings → Secrets → Actions

import { createClient } from '@supabase/supabase-js';

// Get credentials from environment variables (secure - not committed to git)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabaseClient = null;

export const getSupabaseClient = () => {
  // If not configured, return null to use localStorage fallback
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return null;
  }
  
  // Create client singleton
  if (!supabaseClient) {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  
  return supabaseClient;
};

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
  return !!(SUPABASE_URL && SUPABASE_ANON_KEY);
};

