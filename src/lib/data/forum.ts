import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { DbForumPost, DbForumReply } from "@/types/database";
import type { ForumPost, ForumReply } from "@/types";

function toForumPost(p: DbForumPost): ForumPost {
  return {
    slug: p.slug,
    title: p.title,
    body: p.body,
    author: p.profiles?.full_name || "Anonymous",
    discipline: p.discipline,
    tags: p.tags,
    replyCount: p.reply_count ?? 0,
    viewCount: p.view_count,
    createdAt: p.created_at.split("T")[0],
    isSolved: p.is_solved,
    imageUrls: p.image_urls ?? [],
    authorAvatarUrl: p.profiles?.avatar_url ?? null,
  };
}

export async function getForumPosts(): Promise<ForumPost[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = createPublicClient();
  if (!supabase) return [];

  const { data: posts } = await supabase
    .from("forum_posts")
    .select("*, profiles(*)")
    .order("created_at", { ascending: false });

  if (!posts?.length) return [];

  const withCounts = await Promise.all(
    posts.map(async (post) => {
      const { count } = await supabase
        .from("forum_replies")
        .select("*", { count: "exact", head: true })
        .eq("post_id", post.id);
      return { ...post, reply_count: count ?? 0 };
    }),
  );

  return withCounts.map((p) => toForumPost(p as DbForumPost));
}

export async function getForumPost(slug: string) {
  if (!isSupabaseConfigured()) return null;

  const supabase = createPublicClient();
  if (!supabase) return null;

  const { data: post } = await supabase
    .from("forum_posts")
    .select("*, profiles(*)")
    .eq("slug", slug)
    .single();

  if (!post) return null;

  const { data: replies } = await supabase
    .from("forum_replies")
    .select("*, profiles(*)")
    .eq("post_id", post.id)
    .order("created_at", { ascending: true });

  const mappedReplies: ForumReply[] = (replies ?? []).map((r: DbForumReply) => ({
    author: r.profiles?.full_name || "Anonymous",
    body: r.body,
    createdAt: r.created_at.split("T")[0],
    isMentor: r.profiles?.role === "mentor",
    likes: r.likes,
    imageUrls: r.image_urls ?? [],
    authorAvatarUrl: r.profiles?.avatar_url ?? null,
  }));

  return {
    post: toForumPost({ ...post, reply_count: mappedReplies.length } as DbForumPost),
    replies: mappedReplies,
    dbPost: post,
  };
}
