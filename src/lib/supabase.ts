import { createClient } from '@supabase/supabase-js';

// Use the project URL and anon key from your connected Supabase project
const supabaseUrl = "https://zfnduuukuhfcgrlgcysr.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmbmR1dXVrdWhmY2dybGdjeXNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcyOTU0MzUsImV4cCI6MjA1Mjg3MTQzNX0.Hipf-EgKjuqcYR1sdhKfsxAWdJDm4H7TZxlGqwmTZK0";

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Anon Key must be provided. Please connect to Supabase using the integration menu.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);