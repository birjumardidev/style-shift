import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://example.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "public-anon-key";

export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Prompt = {
  id: string;
  title: string;
  prompt_text: string;
  category: string;
  image_url: string | null;
  created_at: string;
};

export type PromptInsert = {
  title: string;
  prompt_text: string;
  category: string;
  image_url: string | null;
};
