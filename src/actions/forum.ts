"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";

export async function incrementForumView(postId: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("forum_posts").select("view_count").eq("id", postId).single();
  if (!data) return;
  await supabase
    .from("forum_posts")
    .update({ view_count: (data.view_count ?? 0) + 1 })
    .eq("id", postId);
}

export async function toggleForumSolved(postId: string, solved: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in" };

  const { data: post } = await supabase
    .from("forum_posts")
    .select("author_id")
    .eq("id", postId)
    .single();

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  const isAuthor = post?.author_id === user.id;
  const isAdmin = profile?.role === "admin";

  if (!isAuthor && !isAdmin) return { error: "Only the author or admin can mark solved" };

  const { error } = await supabase.from("forum_posts").update({ is_solved: solved }).eq("id", postId);
  if (error) return { error: error.message };

  revalidatePath("/forum");
  return { success: true };
}

export async function toggleReplyLike(replyId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in" };

  const limited = await checkRateLimit(user.id, "forum_reply");
  if (!limited.ok) return { error: limited.error };

  const { data: existing } = await supabase
    .from("forum_reply_likes")
    .select("reply_id")
    .eq("reply_id", replyId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    await supabase.from("forum_reply_likes").delete().eq("reply_id", replyId).eq("user_id", user.id);
  } else {
    await supabase.from("forum_reply_likes").insert({ reply_id: replyId, user_id: user.id });
    // bump author reputation
    const { data: reply } = await supabase.from("forum_replies").select("author_id").eq("id", replyId).single();
    if (reply?.author_id) {
      const { data: author } = await supabase.from("profiles").select("forum_reputation").eq("id", reply.author_id).single();
      await supabase
        .from("profiles")
        .update({ forum_reputation: (author?.forum_reputation ?? 0) + 1 })
        .eq("id", reply.author_id);
    }
  }

  revalidatePath("/forum");
  return { success: true };
}

export async function deleteForumPost(postId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: post } = await supabase.from("forum_posts").select("author_id").eq("id", postId).single();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  const isAuthor = post?.author_id === user.id;
  const isAdmin = profile?.role === "admin";
  if (!isAuthor && !isAdmin) return { error: "Unauthorized" };

  const { error } = await supabase.from("forum_posts").delete().eq("id", postId);
  if (error) return { error: error.message };

  revalidatePath("/forum");
  revalidatePath("/admin/forum");
  return { success: true };
}

export async function updateForumPost(postId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in" };

  const { data: post } = await supabase.from("forum_posts").select("author_id, slug").eq("id", postId).single();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (post?.author_id !== user.id && profile?.role !== "admin") return { error: "Unauthorized" };

  const title = (formData.get("title") as string).trim();
  const body = (formData.get("body") as string).trim();
  if (!title || !body) return { error: "Title and body are required" };

  const { error } = await supabase.from("forum_posts").update({ title, body }).eq("id", postId);
  if (error) return { error: error.message };

  revalidatePath(`/forum/${post?.slug}`);
  revalidatePath("/forum");
  return { success: true };
}

export async function reportContent(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in" };

  const limited = await checkRateLimit(user.id, "report");
  if (!limited.ok) return { error: limited.error };

  const contentType = formData.get("contentType") as string;
  const contentId = formData.get("contentId") as string;
  const reason = (formData.get("reason") as string || "").trim();

  if (!contentType || !contentId || !reason) {
    return { error: "All fields are required" };
  }

  const { error } = await supabase.from("content_reports").insert({
    reporter_id: user.id,
    content_type: contentType,
    content_id: contentId,
    reason,
  });

  if (error) return { error: error.message };
  return { success: true };
}

export async function incrementLiveViewer(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("live_sessions").select("viewer_count").eq("slug", slug).single();
  if (!data) return;
  await supabase
    .from("live_sessions")
    .update({ viewer_count: (data.viewer_count ?? 0) + 1 })
    .eq("slug", slug);
  revalidatePath("/live");
}

export async function setLiveRecordingUrl(slug: string, recordingUrl: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: session } = await supabase
    .from("live_sessions")
    .select("host_id")
    .eq("slug", slug)
    .single();

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (session?.host_id !== user.id && profile?.role !== "admin") {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("live_sessions")
    .update({ recording_url: recordingUrl.trim() || null })
    .eq("slug", slug);

  if (error) return { error: error.message };
  revalidatePath(`/live/${slug}`);
  return { success: true };
}
