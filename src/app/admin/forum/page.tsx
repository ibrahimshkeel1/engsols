import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { getForumPosts } from "@/lib/data/forum";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/EmptyState";

export default async function AdminForumPage() {
  const posts = await getForumPosts();

  return (
    <div>
      <h1 className="text-2xl font-bold">Forum moderation</h1>
      <p className="mt-1 text-muted-foreground">Review community discussions.</p>
      <div className="mt-8 space-y-3">
        {posts.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="No forum posts yet"
            description="Community discussions will appear here once users start posting."
            action={{ href: "/forum/new", label: "Start a discussion" }}
          />
        ) : (
          posts.map((post) => (
          <Card key={post.slug} className="card-elevated">
            <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex flex-wrap gap-2">
                  <Badge>{post.discipline}</Badge>
                  {post.isSolved && <Badge className="bg-green-500/15 text-green-700 dark:text-green-400">Solved</Badge>}
                </div>
                <h2 className="mt-2 font-semibold">{post.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {post.author} · {post.replyCount} replies · {post.viewCount} views
                </p>
              </div>
              <Link href={`/forum/${post.slug}`} className="text-sm font-medium text-primary hover:underline">
                View thread →
              </Link>
            </CardContent>
          </Card>
          ))
        )}
      </div>
    </div>
  );
}
