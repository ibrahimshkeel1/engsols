import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function getPublishedNews() {
  if (!isSupabaseConfigured()) return [];

  const supabase = createPublicClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("news_articles")
    .select("*, profiles(*)")
    .eq("published", true)
    .order("published_at", { ascending: false });

  return data ?? [];
}

export async function getNewsArticle(slug: string) {
  if (!isSupabaseConfigured()) return null;

  const supabase = createPublicClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from("news_articles")
    .select("*, profiles(*)")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  return data ?? null;
}

export async function getAllNewsForAdmin() {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("news_articles")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}
