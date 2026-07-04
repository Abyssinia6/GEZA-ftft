import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const rawSupabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

const isPlaceholderValue = (value?: string) => !value || value.includes("your-") || value.includes("placeholder");
const hasValidSupabaseConfig = !isPlaceholderValue(rawSupabaseUrl) && !isPlaceholderValue(rawSupabaseAnonKey);

export const supabase: SupabaseClient | null = hasValidSupabaseConfig
  ? createClient(rawSupabaseUrl as string, rawSupabaseAnonKey as string)
  : null;

if (!hasValidSupabaseConfig) {
  console.warn("⚠️ Supabase environment variables are missing or still using placeholder values.");
}