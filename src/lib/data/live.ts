import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { liveStreams as mockStreams } from "@/data/liveStreams";
import { mentors } from "@/data/mentors";
import type { DbLiveSession } from "@/types/database";
import type { LiveStream } from "@/types";

function toLiveStream(s: DbLiveSession): LiveStream & { hostName?: string; hostSlug?: string } {
  const mentor = s.mentor_profiles;
  return {
    slug: s.slug,
    title: s.title,
    description: s.description,
    hostSlug: mentor?.slug ?? "",
    discipline: s.discipline,
    scheduledAt: s.scheduled_at,
    status: s.status,
    viewerCount: s.viewer_count,
    hostName: s.profiles?.full_name,
  };
}

export async function getLiveSessions() {
  if (!isSupabaseConfigured()) {
    return mockStreams.map((s) => ({
      ...s,
      hostName: mentors.find((m) => m.slug === s.hostSlug)?.name,
    }));
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("live_sessions")
    .select("*, profiles(*), mentor_profiles(*)")
    .order("scheduled_at", { ascending: false });

  if (!data?.length) {
    return mockStreams.map((s) => ({
      ...s,
      hostName: mentors.find((m) => m.slug === s.hostSlug)?.name,
    }));
  }
  return data.map((s) => toLiveStream(s as DbLiveSession));
}

export async function getLiveSession(slug: string) {
  const sessions = await getLiveSessions();
  return sessions.find((s) => s.slug === slug) ?? null;
}

export async function getLiveSessionsForHost(hostId: string) {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("live_sessions")
    .select("*")
    .eq("host_id", hostId)
    .order("scheduled_at", { ascending: false });
  return data ?? [];
}
