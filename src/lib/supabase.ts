import { createClient } from '@supabase/supabase-js';

// Ensure URL is valid before creating client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL and Anon Key must be provided. Please connect to Supabase using the integration menu.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);