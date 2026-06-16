import { getPublicSupabase } from "@/lib/data/helpers";
import type { DbVideo } from "@/types/database";
import type { Video } from "@/types";

function toVideo(v: DbVideo): Video {
  return {
    slug: v.slug,
    title: v.title,
    description: v.description,
    authorSlug: v.author_mentor_slug ?? "",
    discipline: v.discipline,
    duration: v.duration,
    views: v.views,
    publishedAt: v.published_at?.split("T")[0] ?? "",
    tags: v.tags,
    videoUrl: v.video_url,
  };
}

export async function getVideos(): Promise<Video[]> {
  const supabase = getPublicSupabase();
  if (!supabase) return [];

  const { data } = await supabase
    .from("videos")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });

  return (data ?? []).map((v) => toVideo(v as DbVideo));
}

export async function getVideoBySlug(slug: string): Promise<Video | null> {
  const supabase = getPublicSupabase();
  if (!supabase) return null;

  const { data } = await supabase
    .from("videos")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  return data ? toVideo(data as DbVideo) : null;
}
