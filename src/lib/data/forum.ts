import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { DbForumPost, DbForumReply } from "@/types/database";
import type { AdminForumPost, ForumPost, ForumReply } from "@/types";

type ReplyRow = DbForumReply & {
  profiles?: {
    full_name?: string;
    role?: string;
    forum_reputation?: number;
    avatar_url?: string | null;
  } | null;
};

type PostExtras = {
  replyCount: number;
  lastReplyAt: string | null;
  topReplyPreview: ForumPost["topReplyPreview"];
};

function pickTopReply(replies: ReplyRow[]): ReplyRow | null {
  if (!replies.length) return null;
  return [...replies].sort((a, b) => {
    if (b.likes !== a.likes) return b.likes - a.likes;
    return b.created_at.localeCompare(a.created_at);
  })[0];
}

function buildPostExtras(postId: string, repliesByPost: Map<string, ReplyRow[]>): PostExtras {
  const replies = repliesByPost.get(postId) ?? [];
  const top = pickTopReply(replies);
  const latest = replies[0] ?? null;

  return {
    replyCount: replies.length,
    lastReplyAt: latest?.created_at ?? null,
    topReplyPreview: top
      ? {
          author: top.profiles?.full_name || "Anonymous",
          body: top.body,
          isMentor: top.profiles?.role === "mentor",
          reputation: top.profiles?.forum_reputation ?? 0,
          avatarUrl: top.profiles?.avatar_url ?? null,
        }
      : undefined,
  };
}

function toForumPost(p: DbForumPost, extras?: PostExtras): ForumPost {
  const profile = p.profiles as { full_name?: string; avatar_url?: string | null; forum_reputation?: number } | null;
  return {
    slug: p.slug,
    title: p.title,
    body: p.body,
    author: profile?.full_name || "Anonymous",
    discipline: p.discipline,
    tags: p.tags,
    replyCount: extras?.replyCount ?? p.reply_count ?? 0,
    viewCount: p.view_count,
    createdAt: p.created_at,
    isSolved: p.is_solved,
    imageUrls: p.image_urls ?? [],
    authorAvatarUrl: profile?.avatar_url ?? null,
    authorReputation: profile?.forum_reputation ?? 0,
    lastReplyAt: extras?.lastReplyAt ?? null,
    topReplyPreview: extras?.topReplyPreview,
  };
}

async function loadReplyMap(supabase: NonNullable<ReturnType<typeof createPublicClient>>) {
  const { data: replies } = await supabase
    .from("forum_replies")
    .select("*, profiles(full_name, role, forum_reputation, avatar_url)")
    .order("created_at", { ascending: false });

  const map = new Map<string, ReplyRow[]>();
  for (const row of (replies ?? []) as ReplyRow[]) {
    const list = map.get(row.post_id) ?? [];
    list.push(row);
    map.set(row.post_id, list);
  }
  return map;
}

export async function getForumPosts(): Promise<ForumPost[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = createPublicClient();
  if (!supabase) return [];

  const [{ data: posts }, repliesByPost] = await Promise.all([
    supabase.from("forum_posts").select("*, profiles(*)").order("created_at", { ascending: false }),
    loadReplyMap(supabase),
  ]);

  if (!posts?.length) return [];

  return posts.map((post) => {
    const extras = buildPostExtras(post.id, repliesByPost);
    return toForumPost({ ...post, reply_count: extras.replyCount } as DbForumPost, extras);
  });
}

export async function getForumPostsForAdmin(): Promise<AdminForumPost[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("forum_posts")
    .select("*, profiles(*)")
    .order("created_at", { ascending: false });

  if (!posts?.length) return [];

  const publicClient = createPublicClient();
  const repliesByPost = publicClient ? await loadReplyMap(publicClient) : new Map();

  return posts.map((post) => {
    const extras = buildPostExtras(post.id, repliesByPost);
    return { ...toForumPost({ ...post, reply_count: extras.replyCount } as DbForumPost, extras), id: post.id };
  });
}

export async function getForumPostsByDiscipline(discipline: string, limit = 4): Promise<ForumPost[]> {
  const posts = await getForumPosts();
  return posts.filter((p) => p.discipline === discipline).slice(0, limit);
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
    id: r.id,
    author: r.profiles?.full_name || "Anonymous",
    body: r.body,
    createdAt: r.created_at.split("T")[0],
    isMentor: r.profiles?.role === "mentor",
    likes: r.likes,
    forumReputation: (r.profiles as { forum_reputation?: number } | null)?.forum_reputation ?? 0,
    imageUrls: r.image_urls ?? [],
    authorAvatarUrl: r.profiles?.avatar_url ?? null,
    authorId: r.author_id,
  }));

  const replyRows = (replies ?? []) as ReplyRow[];
  const extras = buildPostExtras(
    post.id,
    new Map([[post.id, [...replyRows].sort((a, b) => b.created_at.localeCompare(a.created_at))]]),
  );

  return {
    post: toForumPost({ ...post, reply_count: mappedReplies.length } as DbForumPost, extras),
    replies: mappedReplies,
    dbPost: post,
  };
}
