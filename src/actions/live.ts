"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type LiveJoinRequestRow = {
  id: string;
  userId: string;
  displayName: string;
  requestedAt: string;
  email?: string;
};

export type LiveJoinRequestsPayload = {
  sessionId: string;
  requests: LiveJoinRequestRow[];
};

async function getSessionForHostAction(slug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" as const };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const { data: session } = await supabase
    .from("live_sessions")
    .select("id, host_id, slug")
    .eq("slug", slug)
    .single();

  if (!session) return { error: "Session not found" as const };

  const isHost = session.host_id === user.id;
  const isAdmin = profile?.role === "admin";
  if (!isHost && !isAdmin) return { error: "Not allowed" as const };

  return { supabase, session, user };
}

export async function getPendingJoinRequests(slug: string): Promise<LiveJoinRequestsPayload | null> {
  const ctx = await getSessionForHostAction(slug);
  if ("error" in ctx) return null;

  const { data, error } = await ctx.supabase
    .from("live_join_requests")
    .select("id, user_id, display_name, requested_at")
    .eq("session_id", ctx.session.id)
    .eq("status", "pending")
    .order("requested_at", { ascending: true });

  if (error) {
    return { sessionId: ctx.session.id, requests: [] };
  }

  return {
    sessionId: ctx.session.id,
    requests: (data ?? []).map((row) => ({
      id: row.id,
      userId: row.user_id,
      displayName: row.display_name,
      requestedAt: row.requested_at,
    })),
  };
}

export async function getLiveJoinApproval(slug: string): Promise<boolean | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: session } = await supabase
    .from("live_sessions")
    .select("require_join_approval, host_id")
    .eq("slug", slug)
    .single();

  if (!session) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isHost = session.host_id === user.id;
  const isAdmin = profile?.role === "admin";
  if (!isHost && !isAdmin) return null;

  return session.require_join_approval ?? false;
}

export async function resolveJoinRequest(
  slug: string,
  requestId: string,
  approved: boolean,
): Promise<{ ok: boolean; error?: string }> {
  const ctx = await getSessionForHostAction(slug);
  if ("error" in ctx) return { ok: false, error: ctx.error };

  const { error } = await ctx.supabase
    .from("live_join_requests")
    .update({
      status: approved ? "approved" : "denied",
      resolved_at: new Date().toISOString(),
      resolved_by: ctx.user.id,
    })
    .eq("id", requestId)
    .eq("session_id", ctx.session.id)
    .eq("status", "pending");

  if (error) return { ok: false, error: error.message };

  revalidatePath(`/live/${slug}`);
  revalidatePath(`/live/${slug}/room`);
  return { ok: true };
}

export async function setLiveJoinApproval(
  slug: string,
  requireJoinApproval: boolean,
): Promise<{ ok: boolean; error?: string }> {
  const ctx = await getSessionForHostAction(slug);
  if ("error" in ctx) return { ok: false, error: ctx.error };

  const { error } = await ctx.supabase
    .from("live_sessions")
    .update({ require_join_approval: requireJoinApproval })
    .eq("id", ctx.session.id);

  if (error) return { ok: false, error: error.message };

  revalidatePath(`/live/${slug}`);
  revalidatePath(`/live/${slug}/room`);
  return { ok: true };
}
