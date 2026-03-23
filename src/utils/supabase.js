import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isConfigured =
    supabaseUrl &&
    !supabaseUrl.includes('YOUR_') &&
    supabaseAnonKey &&
    !supabaseAnonKey.includes('YOUR_');

export const supabase = isConfigured
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export const supabaseAvailable = !!isConfigured;
