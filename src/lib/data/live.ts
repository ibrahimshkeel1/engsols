import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { DbLiveSession } from "@/types/database";
import type { LiveStream } from "@/types";

function toLiveStream(s: DbLiveSession): LiveStream & { hostName?: string } {
  const mentor = s.mentor_profiles;
  return {
    slug: s.slug,
    title: s.title,
    description: s.description,
    hostSlug: mentor?.slug ?? "",
    hostId: s.host_id,
    discipline: s.discipline,
    scheduledAt: s.scheduled_at,
    status: s.status,
    viewerCount: s.viewer_count,
    roomName: s.room_name ?? s.slug,
    callType: s.call_type,
    forumPostId: s.forum_post_id ?? undefined,
    forumPostSlug: s.forum_posts?.slug,
    endedAt: s.ended_at ?? undefined,
    maxParticipants: s.max_participants,
    accessMode: s.access_mode,
    hostName: s.profiles?.full_name,
  };
}

export async function getLiveSessions() {
  if (!isSupabaseConfigured()) return [];

  const supabase = createPublicClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("live_sessions")
    .select("*, profiles(*), mentor_profiles(*), forum_posts(slug)")
    .order("scheduled_at", { ascending: false });

  if (!data?.length) return [];
  return data.map((s) => toLiveStream(s as DbLiveSession));
}

export async function getLiveSession(slug: string) {
  if (isSupabaseConfigured()) {
    const supabase = createPublicClient();
    if (supabase) {
      const { data } = await supabase
        .from("live_sessions")
        .select("*, profiles(*), mentor_profiles(*), forum_posts(slug)")
        .eq("slug", slug)
        .single();

      if (data) return toLiveStream(data as DbLiveSession);
    }
  }

  const sessions = await getLiveSessions();
  return sessions.find((s) => s.slug === slug) ?? null;
}

export async function getLiveSessionForForumPost(forumPostId: string) {
  if (!isSupabaseConfigured()) return null;

  const supabase = createPublicClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from("live_sessions")
    .select("*, profiles(*), mentor_profiles(*), forum_posts(slug)")
    .eq("forum_post_id", forumPostId)
    .eq("status", "live")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return data ? toLiveStream(data as DbLiveSession) : null;
}

export async function getLiveSessionsForHost(hostId: string) {
  if (!isSupabaseConfigured()) return [];
  const supabase = createPublicClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("live_sessions")
    .select("*, forum_posts(slug)")
    .eq("host_id", hostId)
    .order("scheduled_at", { ascending: false });
  return (data ?? []).map((s) => toLiveStream(s as DbLiveSession));
}
