import Link from "next/link";
import { MessageSquare, Radio, Users } from "lucide-react";
import { formatRelativeTime } from "@/lib/format-relative-time";
import { getContentCrossLinks } from "@/lib/data/content-crosslinks";
import { Avatar } from "@/components/ui/Avatar";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  discipline: string;
  excludeForumSlug?: string;
  className?: string;
};

export async function ContentCrossLinks({ discipline, excludeForumSlug, className }: Props) {
  const { mentors, forumPosts, liveSessions } = await getContentCrossLinks(discipline, {
    excludeForumSlug,
  });

  if (!mentors.length && !forumPosts.length && !liveSessions.length) return null;

  return (
    <aside className={className}>
      <div className="space-y-6">
        {mentors.length > 0 && (
          <Card className="card-elevated">
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <h3 className="font-semibold">Mentors who can help</h3>
              </div>
              <ul className="mt-4 space-y-3">
                {mentors.map((m) => (
                  <li key={m.slug}>
                    <Link href={`/mentors/${m.slug}`} className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/60">
                      <Avatar name={m.name} discipline={m.discipline} size="sm" src={m.avatarUrl} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{m.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{m.headline}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href={`/mentors?discipline=${encodeURIComponent(discipline)}`} className="mt-3 inline-block text-sm text-primary hover:underline">
                Browse all in {discipline} →
              </Link>
            </CardContent>
          </Card>
        )}

        {forumPosts.length > 0 && (
          <Card className="card-elevated">
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                <h3 className="font-semibold">Related discussions</h3>
              </div>
              <ul className="mt-4 space-y-3">
                {forumPosts.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/forum/${p.slug}`} className="block text-sm hover:text-primary">
                      <p className="font-medium leading-snug">{p.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {p.replyCount} replies · active {formatRelativeTime(p.lastReplyAt ?? p.createdAt)}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href={`/forum?discipline=${encodeURIComponent(discipline)}`} className="mt-3 inline-block text-sm text-primary hover:underline">
                View forum →
              </Link>
            </CardContent>
          </Card>
        )}

        {liveSessions.length > 0 && (
          <Card className="card-elevated">
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Radio className="h-4 w-4 text-red-500" />
                <h3 className="font-semibold">Upcoming live</h3>
              </div>
              <ul className="mt-4 space-y-3">
                {liveSessions.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/live/${s.slug}`} className="block text-sm hover:text-primary">
                      <p className="font-medium leading-snug">{s.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground capitalize">
                        {s.status === "live" ? "Live now" : new Date(s.scheduledAt).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/live" className="mt-3 inline-block text-sm text-primary hover:underline">
                All live sessions →
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </aside>
  );
}