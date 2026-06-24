import { notFound } from "next/navigation";
import { getForumPost } from "@/lib/data/forum";
import { getLiveSessionForForumPost } from "@/lib/data/live";
import { getCurrentUser } from "@/lib/auth";
import { DisciplineBadge } from "@/components/ui/DisciplineBadge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ForumThreadReplies } from "@/components/forum/ForumThreadReplies";
import { ForumGoLiveButton } from "@/components/forum/ForumGoLiveButton";
import { MarkSolvedButton } from "@/components/forum/MarkSolvedButton";
import { ForumViewTracker } from "@/components/forum/ForumViewTracker";
import { ForumRealtimeWatcher } from "@/components/forum/ForumRealtimeWatcher";
import { ForumPostActions } from "@/components/forum/ForumPostActions";
import { ForumGamificationBadges, isActiveThisWeek } from "@/components/forum/ForumGamificationBadges";
import { ContentCrossLinks } from "@/components/shared/ContentCrossLinks";
import { Avatar } from "@/components/ui/Avatar";
import { buildDetailMetadata } from "@/lib/page-metadata";
import { ShareButton } from "@/components/shared/ShareButton";
import { AttachedImages } from "@/components/shared/AttachedImages";
import { ReportContentButton } from "@/components/shared/ReportContentButton";
import { JsonLd } from "@/components/seo/JsonLd";
import { forumDiscussionJsonLd } from "@/lib/seo/json-ld";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 60;

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const data = await getForumPost(slug);
  if (!data) return { title: "Discussion not found" };
  return buildDetailMetadata({
    title: `${data.post.title} | EngSols Forum`,
    description: data.post.body.slice(0, 160),
    path: `/forum/${slug}`,
  });
}

export default async function ForumThreadPage({ params }: Props) {
  const { slug } = await params;
  const data = await getForumPost(slug);
  if (!data) notFound();

  const { post, replies, dbPost } = data;
  const [user, activeLive] = await Promise.all([
    getCurrentUser(),
    dbPost?.id ? getLiveSessionForForumPost(dbPost.id) : Promise.resolve(null),
  ]);
  const isAuthor = user?.id === dbPost?.author_id;
  const isAdmin = user?.role === "admin";

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <JsonLd
        data={forumDiscussionJsonLd({
          title: post.title,
          slug,
          body: post.body,
          author: post.author,
          createdAt: post.createdAt,
          replyCount: post.replyCount,
        })}
      />
      {dbPost?.id && <ForumViewTracker postId={dbPost.id} />}
      {dbPost?.id && <ForumRealtimeWatcher postId={dbPost.id} />}
      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex flex-wrap items-center gap-2">
            <DisciplineBadge discipline={post.discipline} />
            {post.isSolved && <Badge className="bg-zone-mentorship/15 text-zone-mentorship-on">Solved</Badge>}
            {(isAuthor || isAdmin) && dbPost?.id && (
              <MarkSolvedButton postId={dbPost.id} isSolved={post.isSolved} />
            )}
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>
            <ShareButton title={post.title} text={post.body.slice(0, 120)} className="shrink-0" />
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Avatar name={post.author} discipline={post.discipline} size="sm" src={post.authorAvatarUrl} />
            <span>{post.author} · {post.createdAt} · {post.viewCount} views</span>
            <ForumGamificationBadges
              reputation={post.authorReputation}
              activeThisWeek={isActiveThisWeek(post.lastReplyAt ?? post.createdAt)}
            />
          </div>
          <p className="mt-6 leading-relaxed text-foreground/90">{post.body}</p>
          <AttachedImages urls={post.imageUrls ?? []} />
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {post.tags.map((t) => <Badge key={t}>{t}</Badge>)}
            {dbPost?.id && <ReportContentButton contentType="forum_post" contentId={dbPost.id} />}
          </div>
          {(isAuthor || isAdmin) && dbPost?.id && (
            <ForumPostActions postId={dbPost.id} title={post.title} body={post.body} canDelete />
          )}
          <ForumThreadReplies
            postId={dbPost?.id}
            initialReplies={replies}
            currentUserId={user?.id}
            isAdmin={isAdmin}
          />
        </div>
        <div className="space-y-6">
          <Card className="card-elevated">
            <CardContent className="p-6">
              <h3 className="font-semibold">Live discussion</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Start a video call on this topic without leaving EngSols.
              </p>
              <div className="mt-4">
                <ForumGoLiveButton
                  postId={dbPost?.id ?? ""}
                  postSlug={slug}
                  title={post.title}
                  description={post.body}
                  discipline={post.discipline}
                  isLoggedIn={!!user}
                  activeLiveSlug={activeLive?.slug}
                />
              </div>
            </CardContent>
          </Card>
          <ContentCrossLinks discipline={post.discipline} excludeForumSlug={slug} />
        </div>
      </div>
    </div>
  );
}
