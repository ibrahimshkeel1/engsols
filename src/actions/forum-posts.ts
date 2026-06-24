"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ensureUserProfile } from "@/lib/supabase/profile";
import { mapForumReplyRow } from "@/lib/data/forum";
import { logger } from "@/lib/logger";
import { slugify } from "@/lib/slugify";
import { parseImageUrls } from "@/lib/action-utils";

export async function createForumPost(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/forum/new");

  const title = formData.get("title") as string;
  const body = formData.get("body") as string;
  const discipline = formData.get("discipline") as string;
  const imageUrls = parseImageUrls(formData.get("imageUrls"));
  const slug = `${slugify(title)}-${Date.now().toString(36)}`;

  const { error } = await supabase.from("forum_posts").insert({
    slug,
    author_id: user.id,
    title,
    body,
    discipline,
    tags: [],
    image_urls: imageUrls,
  });

  if (error) redirect(`/forum/new?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/forum");
  redirect(`/forum/${slug}`);
}

export async function createForumReply(postId: string, body: string, imageUrls: string[] = []) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in" };

  const trimmed = body.trim();
  if (!trimmed) return { error: "Reply cannot be empty" };

  await ensureUserProfile(supabase, user);

  const { data: post, error: postError } = await supabase
    .from("forum_posts")
    .select("id, author_id, title, slug")
    .eq("id", postId)
    .single();

  if (postError || !post) return { error: "Discussion not found" };

  const { data: inserted, error } = await supabase
    .from("forum_replies")
    .insert({
      post_id: postId,
      author_id: user.id,
      body: trimmed,
      image_urls: imageUrls,
    })
    .select("id, post_id, author_id, body, likes, image_urls, created_at")
    .single();

  if (error || !inserted) return { error: error?.message ?? "Failed to save reply" };

  const { data: replierProfile } = await supabase
    .from("profiles")
    .select("full_name, role, forum_reputation, avatar_url")
    .eq("id", user.id)
    .single();

  try {
    if (post.author_id !== user.id) {
      const replierName = replierProfile?.full_name ?? "Someone";
      const { data: author } = await supabase.from("profiles").select("email").eq("id", post.author_id).single();

      if (author?.email) {
        const { forumReplyEmail, sendEmail } = await import("@/lib/email");
        const mail = forumReplyEmail({
          postTitle: post.title,
          replierName,
          postSlug: post.slug,
        });
        await sendEmail({ to: author.email, ...mail });
      }

      const { createNotification } = await import("@/lib/notifications");
      await createNotification({
        userId: post.author_id,
        title: "New forum reply",
        body: `${replierName} replied to "${post.title}".`,
        url: `/forum/${post.slug}`,
      });

      const { sendPushToUser } = await import("@/lib/push");
      await sendPushToUser({
        userId: post.author_id,
        title: "New forum reply",
        body: `Someone replied to your thread.`,
        url: `/forum/${post.slug}`,
      });
    }
  } catch (notifyError) {
    logger.error("forum", "reply notification failed", { message: String(notifyError) });
  }

  revalidatePath("/forum");
  revalidatePath(`/forum/${post.slug}`);

  return {
    success: true,
    reply: mapForumReplyRow(inserted, replierProfile),
  };
}
