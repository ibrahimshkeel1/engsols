"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isLiveKitConfigured } from "@/lib/livekit/config";
import { slugify } from "@/lib/slugify";

export async function createLiveSession(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const nextPath = (formData.get("next") as string) || "/live/new";
  if (!user) redirect(`/login?next=${encodeURIComponent(nextPath)}`);

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const discipline = formData.get("discipline") as string;
  const scheduledAtInput = formData.get("scheduledAt") as string;
  const startNow = formData.get("startNow") === "true";
  const callType = (formData.get("callType") as string) || "scheduled";
  const forumPostId = formData.get("forumPostId") as string | null;
  const maxParticipants = parseInt(formData.get("maxParticipants") as string, 10) || 50;
  const requireJoinApproval = formData.get("requireJoinApproval") === "true";
  const slug = `${slugify(title)}-${Date.now().toString(36)}`;
  const roomName = slug;

  if (!startNow && !scheduledAtInput) {
    redirect(`${nextPath}?error=${encodeURIComponent("Please set a date and time, or use Go live now")}`);
  }

  const scheduledAt = startNow
    ? new Date().toISOString()
    : scheduledAtInput || new Date().toISOString();

  const { data: mentor } = await supabase
    .from("mentor_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (isLiveKitConfigured()) {
    const { ensureLiveKitRoom } = await import("@/lib/livekit/server");
    await ensureLiveKitRoom(roomName, maxParticipants);
  }

  const { error } = await supabase.from("live_sessions").insert({
    slug,
    host_id: user.id,
    mentor_profile_id: mentor?.id ?? null,
    title,
    description,
    discipline,
    scheduled_at: scheduledAt,
    status: startNow ? "live" : "upcoming",
    room_name: roomName,
    call_type: callType,
    forum_post_id: forumPostId || null,
    max_participants: maxParticipants,
    access_mode: callType === "mentorship_1on1" ? "invite_only" : "authenticated",
    require_join_approval: requireJoinApproval,
  });

  if (error) redirect(`${nextPath}?error=${encodeURIComponent(error.message)}`);

  revalidatePath("/live");
  revalidatePath("/calls");
  revalidatePath("/forum");

  if (startNow) redirect(`/live/${slug}/room`);
  redirect(`/live/${slug}`);
}

export async function goLiveFromForum(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const postId = formData.get("postId") as string;
  const postSlug = formData.get("postSlug") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const discipline = formData.get("discipline") as string;

  if (!user) redirect(`/login?next=/forum/${postSlug}`);

  const slug = `${slugify(title)}-${Date.now().toString(36)}`;
  const roomName = slug;

  const { data: mentor } = await supabase
    .from("mentor_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (isLiveKitConfigured()) {
    const { ensureLiveKitRoom } = await import("@/lib/livekit/server");
    await ensureLiveKitRoom(roomName, 50);
  }

  const { error } = await supabase.from("live_sessions").insert({
    slug,
    host_id: user.id,
    mentor_profile_id: mentor?.id ?? null,
    title,
    description,
    discipline,
    scheduled_at: new Date().toISOString(),
    status: "live",
    room_name: roomName,
    call_type: "forum_instant",
    forum_post_id: postId,
    max_participants: 50,
    access_mode: "authenticated",
  });

  if (error) redirect(`/forum/${postSlug}?error=${encodeURIComponent(error.message)}`);

  const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single();
  const name = profile?.full_name || "Someone";

  await supabase.from("forum_replies").insert({
    post_id: postId,
    author_id: user.id,
    body: `${name} started a live video discussion on this topic. Join at /live/${slug}/room`,
  });

  revalidatePath("/live");
  revalidatePath(`/forum/${postSlug}`);
  redirect(`/live/${slug}/room`);
}

export async function startLiveSession(slug: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/live/${slug}`);

  const { data: session } = await supabase
    .from("live_sessions")
    .select("host_id, room_name, slug, max_participants")
    .eq("slug", slug)
    .single();

  if (!session || session.host_id !== user.id) return;

  const roomName = session.room_name || session.slug;
  if (isLiveKitConfigured()) {
    const { ensureLiveKitRoom } = await import("@/lib/livekit/server");
    await ensureLiveKitRoom(roomName, session.max_participants ?? 50);
  }

  await supabase
    .from("live_sessions")
    .update({ status: "live", scheduled_at: new Date().toISOString() })
    .eq("slug", slug);

  revalidatePath("/live");
  revalidatePath(`/live/${slug}`);
  revalidatePath("/forum");
}

export async function endLiveSession(slug: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role === "admin";

  const { data: session } = await supabase
    .from("live_sessions")
    .select("host_id, room_name, slug, status")
    .eq("slug", slug)
    .single();

  if (!session) return;
  if (session.host_id !== user.id && !isAdmin) return;
  if (session.status === "ended") return;

  const roomName = session.room_name || session.slug;
  if (isLiveKitConfigured()) {
    const { deleteLiveKitRoom } = await import("@/lib/livekit/server");
    await deleteLiveKitRoom(roomName);
  }

  await supabase
    .from("live_sessions")
    .update({ status: "ended", ended_at: new Date().toISOString() })
    .eq("slug", slug);

  revalidatePath("/live");
  revalidatePath(`/live/${slug}`);
  revalidatePath("/calls");
  revalidatePath("/forum");
  revalidatePath("/admin");
  revalidatePath("/admin/live");
}
