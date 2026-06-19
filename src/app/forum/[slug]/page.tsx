import Link from "next/link";
import { notFound } from "next/navigation";
import { getForumPost } from "@/lib/data/forum";
import { getLiveSessionForForumPost } from "@/lib/data/live";
import { getApprovedMentors } from "@/lib/data/mentors";
import { getCurrentUser } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { DisciplineBadge } from "@/components/ui/DisciplineBadge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ForumReplyForm } from "@/components/forum/ForumReplyForm";
import { ForumGoLiveButton } from "@/components/forum/ForumGoLiveButton";
import { MarkSolvedButton } from "@/components/forum/MarkSolvedButton";
import { ReplyLikeButton } from "@/components/forum/ReplyLikeButton";
import { ForumViewTracker } from "@/components/forum/ForumViewTracker";
import { ForumRealtimeWatcher } from "@/components/forum/ForumRealtimeWatcher";
import { ForumPostActions } from "@/components/forum/ForumPostActions";
import { ForumReplyActions } from "@/components/forum/ForumReplyActions";
import { ReportContentButton } from "@/components/shared/ReportContentButton";
import { AttachedImages } from "@/components/shared/AttachedImages";
import { Avatar } from "@/components/ui/Avatar";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 30;

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const data = await getForumPost(slug);
  if (!data) return { title: "Discussion not found" };
  return { title: `${data.post.title} | EngSols Forum`, description: data.post.body.slice(0, 160) };
}

export default async function ForumThreadPage({ params }: Props) {
  const { slug } = await params;
  const data = await getForumPost(slug);
  if (!data) notFound();

  const { post, replies, dbPost } = data;
  const [mentors, user, activeLive] = await Promise.all([
    getApprovedMentors(),
    getCurrentUser(),
    dbPost?.id ? getLiveSessionForForumPost(dbPost.id) : Promise.resolve(null),
  ]);
  const relatedMentors = mentors.filter((m) => m.discipline === post.discipline).slice(0, 3);
  const isAuthor = user?.id === dbPost?.author_id;
  const isAdmin = user?.role === "admin";

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      {dbPost?.id && <ForumViewTracker postId={dbPost.id} />}
      {dbPost?.id && <ForumRealtimeWatcher postId={dbPost.id} />}
      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex flex-wrap items-center gap-2">
            <DisciplineBadge discipline={post.discipline} />
            {post.isSolved && <Badge className="bg-green-500/15 text-green-700 dark:text-green-400">Solved</Badge>}
            {(isAuthor || isAdmin) && dbPost?.id && (
              <MarkSolvedButton postId={dbPost.id} isSolved={post.isSolved} />
            )}
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight">{post.title}</h1>
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Avatar name={post.author} discipline={post.discipline} size="sm" src={post.authorAvatarUrl} />
            <span>{post.author} · {post.createdAt} · {post.viewCount} views</span>
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
          <h2 className="mt-12 text-xl font-bold">{replies.length} Replies</h2>
          <div className="mt-4 space-y-4">
            {replies.map((r) => (
              <div
                key={r.id}
                className={cn(
                  "rounded-2xl border border-border bg-card p-5",
                  r.isMentor && "border-l-4 border-l-primary",
                )}
              >
                <div className="flex items-center gap-2">
                  <Avatar name={r.author} size="sm" src={r.authorAvatarUrl} />
                  <span className="font-medium">{r.author}</span>
                  {r.isMentor && <Badge className="bg-primary/10 text-primary">Mentor</Badge>}
                  {(r.forumReputation ?? 0) > 0 && (
                    <Badge className="bg-muted text-xs text-muted-foreground">
                      {r.forumReputation} rep
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground">{r.createdAt}</span>
                </div>
                <p className="mt-2 text-foreground/90">{r.body}</p>
                <AttachedImages urls={r.imageUrls ?? []} />
                <div className="mt-2 flex items-center gap-2">
                  <ReplyLikeButton replyId={r.id} likes={r.likes} />
                  <ReportContentButton contentType="forum_reply" contentId={r.id} />
                </div>
                <ForumReplyActions
                  replyId={r.id}
                  body={r.body}
                  canEdit={user?.id === r.authorId || isAdmin}
                />
              </div>
            ))}
            {replies.length === 0 && <p className="text-muted-foreground">No replies yet. Be the first!</p>}
          </div>
          <ForumReplyForm postId={dbPost?.id} />
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
          <Card className="card-elevated">
            <CardContent className="p-6">
              <h3 className="font-semibold">Related mentors</h3>
              <ul className="mt-4 space-y-3">
                {relatedMentors.map((m) => (
                  <li key={m.slug}>
                    <Link href={`/mentors/${m.slug}`} className="text-sm text-primary hover:underline">
                      {m.name} — {m.discipline}
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
