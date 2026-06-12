import Link from "next/link";
import { notFound } from "next/navigation";
import { forumPosts, getForumPostBySlug } from "@/data/forumPosts";
import { forumReplies } from "@/data/forumReplies";
import { mentors } from "@/data/mentors";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ForumReplyForm } from "@/components/forum/ForumReplyForm";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return forumPosts.map((p) => ({ slug: p.slug }));
}

export default async function ForumThreadPage({ params }: Props) {
  const { slug } = await params;
  const post = getForumPostBySlug(slug);
  if (!post) notFound();

  const replies = forumReplies[slug] ?? [];
  const relatedMentors = mentors
    .filter((m) => m.discipline === post.discipline)
    .slice(0, 3);

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Badge className="bg-amber-50 text-amber-800">{post.discipline}</Badge>
            {post.isSolved && <Badge className="ml-2 bg-green-50 text-green-700">Solved</Badge>}
            <h1 className="mt-3 text-3xl font-bold text-slate-900">{post.title}</h1>
            <p className="mt-2 text-sm text-slate-500">{post.author} · {post.createdAt} · {post.viewCount} views</p>
            <p className="mt-6 leading-relaxed text-slate-700">{post.body}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((t) => <Badge key={t}>{t}</Badge>)}
            </div>
            {post.mentorSlug && (
              <p className="mt-4 text-sm">
                Suggested mentor:{" "}
                <Link href={`/mentors/${post.mentorSlug}`} className="font-medium text-amber-600">
                  View profile →
                </Link>
              </p>
            )}
            <h2 className="mt-10 text-xl font-bold">{replies.length} Replies</h2>
            <div className="mt-4 space-y-4">
              {replies.map((r, i) => (
                <Card key={i}>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900">{r.author}</span>
                      {r.isMentor && <Badge className="bg-amber-50 text-amber-800">Mentor</Badge>}
                      <span className="text-xs text-slate-500">{r.createdAt}</span>
                    </div>
                    <p className="mt-2 text-slate-700">{r.body}</p>
                    <p className="mt-2 text-xs text-slate-500">{r.likes} likes</p>
                  </CardContent>
                </Card>
              ))}
              {replies.length === 0 && <p className="text-slate-500">No replies yet. Be the first!</p>}
            </div>
            <ForumReplyForm />
          </div>
          <div>
            <Card>
              <CardContent>
                <h3 className="font-semibold text-slate-900">Related mentors</h3>
                <ul className="mt-3 space-y-2">
                  {relatedMentors.map((m) => (
                    <li key={m.slug}>
                      <Link href={`/mentors/${m.slug}`} className="text-sm text-amber-600 hover:text-amber-700">
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
    </div>
  );
}
