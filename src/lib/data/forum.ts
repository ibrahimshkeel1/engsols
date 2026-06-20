import { unstable_noStore as noStore } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { DbForumPost, DbForumReply } from "@/types/database";
import type { AdminForumPost, ForumPost, ForumReply } from "@/types";

type ReplyProfile = {
  full_name?: string;
  role?: string;
  forum_reputation?: number;
  avatar_url?: string | null;
};

type ReplyRow = Pick<
  DbForumReply,
  "id" | "post_id" | "author_id" | "body" | "likes" | "image_urls" | "created_at"
> & {
  profiles?: ReplyProfile | null;
};

type PostExtras = {
  replyCount: number;
  lastReplyAt: string | null;
  topReplyPreview: ForumPost["topReplyPreview"];
};

const REPLY_COLUMNS = "id, post_id, author_id, body, likes, image_urls, created_at" as const;

export function mapForumReplyRow(row: ReplyRow, profile?: ReplyProfile | null): ForumReply {
  const resolved = profile ?? row.profiles;
  return {
    id: row.id,
    author: resolved?.full_name || "Anonymous",
    body: row.body,
    createdAt: row.created_at.split("T")[0],
    isMentor: resolved?.role === "mentor",
    likes: row.likes,
    forumReputation: resolved?.forum_reputation ?? 0,
    imageUrls: row.image_urls ?? [],
    authorAvatarUrl: resolved?.avatar_url ?? null,
    authorId: row.author_id,
  };
}

async function loadProfilesForAuthors(
  supabase: SupabaseClient,
  authorIds: string[],
): Promise<Map<string, ReplyProfile>> {
  if (!authorIds.length) return new Map();

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, full_name, role, forum_reputation, avatar_url")
    .in("id", authorIds);

  if (error) {
    console.error("forum reply profiles fetch failed:", error.message);
    return new Map();
  }

  return new Map((profiles ?? []).map((profile) => [profile.id, profile]));
}

export async function fetchForumRepliesForPost(
  supabase: SupabaseClient,
  postId: string,
): Promise<ForumReply[]> {
  const { data: replies, error } = await supabase
    .from("forum_replies")
    .select(REPLY_COLUMNS)
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("forum replies fetch failed:", error.message);
    return [];
  }

  if (!replies?.length) return [];

  const profileMap = await loadProfilesForAuthors(
    supabase,
    [...new Set(replies.map((reply) => reply.author_id))],
  );

  return replies.map((reply) => mapForumReplyRow(reply, profileMap.get(reply.author_id)));
}

function pickTopReply(replies: ReplyRow[]): ReplyRow | null {
  if (!replies.length) return null;
  return [...replies].sort((a, b) => {
    if (b.likes !== a.likes) return b.likes - a.likes;
    return b.created_at.localeCompare(a.created_at);
  })[0];
}

function buildPostExtras(
  postId: string,
  repliesByPost: Map<string, ReplyRow[]>,
  profileMap: Map<string, ReplyProfile>,
): PostExtras {
  const replies = repliesByPost.get(postId) ?? [];
  const top = pickTopReply(replies);
  const latest = replies[0] ?? null;
  const topProfile = top ? profileMap.get(top.author_id) : null;

  return {
    replyCount: replies.length,
    lastReplyAt: latest?.created_at ?? null,
    topReplyPreview: top
      ? {
          author: topProfile?.full_name || "Anonymous",
          body: top.body,
          isMentor: topProfile?.role === "mentor",
          reputation: topProfile?.forum_reputation ?? 0,
          avatarUrl: topProfile?.avatar_url ?? null,
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

async function loadReplyMap(supabase: SupabaseClient) {
  const { data: replies, error } = await supabase
    .from("forum_replies")
    .select(REPLY_COLUMNS)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("forum reply map fetch failed:", error.message);
    return { repliesByPost: new Map<string, ReplyRow[]>(), profileMap: new Map<string, ReplyProfile>() };
  }

  const repliesByPost = new Map<string, ReplyRow[]>();
  for (const row of replies ?? []) {
    const list = repliesByPost.get(row.post_id) ?? [];
    list.push(row);
    repliesByPost.set(row.post_id, list);
  }

  const profileMap = await loadProfilesForAuthors(
    supabase,
    [...new Set((replies ?? []).map((reply) => reply.author_id))],
  );

  return { repliesByPost, profileMap };
}

export async function getForumPosts(): Promise<ForumPost[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = createPublicClient();
  if (!supabase) return [];

  const [{ data: posts }, { repliesByPost, profileMap }] = await Promise.all([
    supabase.from("forum_posts").select("*, profiles(*)").order("created_at", { ascending: false }),
    loadReplyMap(supabase),
  ]);

  if (!posts?.length) return [];

  return posts.map((post) => {
    const extras = buildPostExtras(post.id, repliesByPost, profileMap);
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
  const { repliesByPost, profileMap } = publicClient
    ? await loadReplyMap(publicClient)
    : { repliesByPost: new Map<string, ReplyRow[]>(), profileMap: new Map<string, ReplyProfile>() };

  return posts.map((post) => {
    const extras = buildPostExtras(post.id, repliesByPost, profileMap);
    return { ...toForumPost({ ...post, reply_count: extras.replyCount } as DbForumPost, extras), id: post.id };
  });
}

export async function getForumPostsByDiscipline(discipline: string, limit = 4): Promise<ForumPost[]> {
  const posts = await getForumPosts();
  return posts.filter((p) => p.discipline === discipline).slice(0, limit);
}

export async function getForumPost(slug: string) {
  noStore();

  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();

  const { data: post, error: postError } = await supabase
    .from("forum_posts")
    .select("*, profiles(*)")
    .eq("slug", slug)
    .single();

  if (postError || !post) return null;

  const { data: replyRows, error: repliesError } = await supabase
    .from("forum_replies")
    .select(REPLY_COLUMNS)
    .eq("post_id", post.id)
    .order("created_at", { ascending: true });

  if (repliesError) {
    console.error("forum replies fetch failed:", repliesError.message);
  }

  const rows = replyRows ?? [];
  const profileMap = await loadProfilesForAuthors(
    supabase,
    [...new Set(rows.map((reply) => reply.author_id))],
  );
  const mappedReplies = rows.map((reply) => mapForumReplyRow(reply, profileMap.get(reply.author_id)));
  const extras = buildPostExtras(
    post.id,
    new Map([[post.id, [...rows].reverse()]]),
    profileMap,
  );

  return {
    post: toForumPost({ ...post, reply_count: mappedReplies.length } as DbForumPost, extras),
    replies: mappedReplies,
    dbPost: post,
  };
}
