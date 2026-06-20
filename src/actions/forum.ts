"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limit";

async function revalidateForumThread(supabase: Awaited<ReturnType<typeof createClient>>, postId: string) {
  const { data: post } = await supabase.from("forum_posts").select("slug").eq("id", postId).single();
  revalidatePath("/forum");
  if (post?.slug) {
    revalidatePath(`/forum/${post.slug}`);
  }
}

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

  const { data: post } = await supabase.from("forum_posts").select("author_id, slug").eq("id", postId).single();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  const isAuthor = post?.author_id === user.id;
  const isAdmin = profile?.role === "admin";
  if (!isAuthor && !isAdmin) return { error: "Unauthorized" };

  const { data: deleted, error } = await supabase
    .from("forum_posts")
    .delete()
    .eq("id", postId)
    .select("id")
    .maybeSingle();

  if (error) return { error: error.message };
  if (!deleted) return { error: "Post could not be deleted. You may not have permission." };

  revalidatePath("/forum");
  revalidatePath("/admin/forum");
  if (post?.slug) {
    revalidatePath(`/forum/${post.slug}`);
  }
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

export async function updateForumReply(replyId: string, body: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in" };

  const trimmed = body.trim();
  if (!trimmed) return { error: "Reply cannot be empty" };

  const { data: reply } = await supabase.from("forum_replies").select("author_id, post_id").eq("id", replyId).single();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (reply?.author_id !== user.id && profile?.role !== "admin") return { error: "Unauthorized" };

  const { error } = await supabase.from("forum_replies").update({ body: trimmed }).eq("id", replyId);
  if (error) return { error: error.message };

  if (reply?.post_id) {
    await revalidateForumThread(supabase, reply.post_id);
  } else {
    revalidatePath("/forum");
  }
  return { success: true };
}

export async function deleteForumReply(replyId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: reply } = await supabase
    .from("forum_replies")
    .select("author_id, post_id")
    .eq("id", replyId)
    .single();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (reply?.author_id !== user.id && profile?.role !== "admin") return { error: "Unauthorized" };

  const { data: deleted, error } = await supabase
    .from("forum_replies")
    .delete()
    .eq("id", replyId)
    .select("id")
    .maybeSingle();

  if (error) return { error: error.message };
  if (!deleted) return { error: "Reply could not be deleted. You may not have permission." };

  if (reply?.post_id) {
    await revalidateForumThread(supabase, reply.post_id);
  } else {
    revalidatePath("/forum");
  }
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
    .select("host_id, title, slug, forum_post_id")
    .eq("slug", slug)
    .single();

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (session?.host_id !== user.id && profile?.role !== "admin") {
    return { error: "Unauthorized" };
  }

  const trimmed = recordingUrl.trim();
  const updates: { recording_url: string | null; status?: string } = { recording_url: trimmed || null };
  if (trimmed) updates.status = "ended";

  const { error } = await supabase
    .from("live_sessions")
    .update(updates)
    .eq("slug", slug);

  if (error) return { error: error.message };

  if (trimmed && session?.forum_post_id) {
    const { data: post } = await supabase
      .from("forum_posts")
      .select("author_id, slug, title")
      .eq("id", session.forum_post_id)
      .single();

    if (post?.author_id && post.author_id !== user.id) {
      const { liveRecordingReadyEmail, sendEmail } = await import("@/lib/email");
      const { data: prof } = await supabase.from("profiles").select("email").eq("id", post.author_id).single();
      if (prof?.email) {
        const mail = liveRecordingReadyEmail({
          sessionTitle: session.title ?? "Live session",
          recordingUrl: trimmed,
          sessionSlug: session.slug ?? slug,
        });
        await sendEmail({ to: prof.email, ...mail });
      }
      const { createNotification } = await import("@/lib/notifications");
      await createNotification({
        userId: post.author_id,
        title: "Live recording ready",
        body: `Recording for "${session.title}" is available.`,
        url: `/live/${session.slug ?? slug}`,
      });
    }
  }

  revalidatePath(`/live/${slug}`);
  return { success: true };
}
