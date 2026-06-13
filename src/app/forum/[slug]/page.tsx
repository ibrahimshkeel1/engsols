import Link from "next/link";
import { notFound } from "next/navigation";
import { getForumPost } from "@/lib/data/forum";
import { getApprovedMentors } from "@/lib/data/mentors";
import { cn } from "@/lib/utils";
import { DisciplineBadge } from "@/components/ui/DisciplineBadge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ForumReplyForm } from "@/components/forum/ForumReplyForm";

type Props = { params: Promise<{ slug: string }> };

export default async function ForumThreadPage({ params }: Props) {
  const { slug } = await params;
  const data = await getForumPost(slug);
  if (!data) notFound();

  const { post, replies, dbPost } = data;
  const mentors = await getApprovedMentors();
  const relatedMentors = mentors.filter((m) => m.discipline === post.discipline).slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DisciplineBadge discipline={post.discipline} />
          {post.isSolved && <Badge className="ml-2 bg-green-500/15 text-green-700 dark:text-green-400">Solved</Badge>}
          <h1 className="mt-4 text-3xl font-bold tracking-tight">{post.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{post.author} · {post.createdAt} · {post.viewCount} views</p>
          <p className="mt-6 leading-relaxed text-foreground/90">{post.body}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((t) => <Badge key={t}>{t}</Badge>)}
          </div>
          <h2 className="mt-12 text-xl font-bold">{replies.length} Replies</h2>
          <div className="mt-4 space-y-4">
            {replies.map((r, i) => (
              <div
                key={i}
                className={cn(
                  "rounded-2xl border border-border bg-card p-5",
                  r.isMentor && "border-l-4 border-l-primary",
                )}
              >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{r.author}</span>
                    {r.isMentor && <Badge className="bg-primary/10 text-primary">Mentor</Badge>}
                    <span className="text-xs text-muted-foreground">{r.createdAt}</span>
                  </div>
                  <p className="mt-2 text-foreground/90">{r.body}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{r.likes} likes</p>
              </div>
            ))}
            {replies.length === 0 && <p className="text-muted-foreground">No replies yet. Be the first!</p>}
          </div>
          <ForumReplyForm postId={dbPost?.id} />
        </div>
        <div>
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
