import Link from "next/link";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { getCurrentUser } from "@/lib/auth";
import { getLiveSessionsForHost } from "@/lib/data/live";
import { DisciplineBadge } from "@/components/ui/DisciplineBadge";
import { ListPageLayout } from "@/components/shared/ListPageLayout";

export default async function CallsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/calls");

  const sessions = await getLiveSessionsForHost(user.id);

  return (
    <ListPageLayout
      label="Video"
      title="My calls & sessions"
      description="Sessions you host on EngSols — schedule new ones or rejoin live rooms."
      action={
        <Link
          href="/live/new"
          className="inline-flex h-11 items-center rounded-xl bg-accent px-5 text-sm font-semibold text-accent-foreground shadow-sm hover:brightness-110"
        >
          New session
        </Link>
      }
    >
      {sessions.length === 0 ? (
        <p className="text-muted-foreground">You haven&apos;t hosted any sessions yet.</p>
      ) : (
        <div className="space-y-3">
          {sessions.map((s) => (
            <div key={s.slug} className="card-interactive flex flex-wrap items-center justify-between gap-4 rounded-2xl p-5">
              <div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-md bg-muted px-2 py-0.5 text-xs capitalize">{s.status}</span>
                  <DisciplineBadge discipline={s.discipline} />
                  {s.callType === "forum_instant" && (
                    <span className="rounded-md bg-muted px-2 py-0.5 text-xs">Forum</span>
                  )}
                </div>
                <h3 className="mt-2 font-semibold">{s.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(s.scheduledAt), "MMM d, yyyy h:mm a")}
                </p>
              </div>
              <div className="flex gap-2">
                <Link href={`/live/${s.slug}`} className="text-sm text-primary hover:underline">
                  Details
                </Link>
                {s.status === "live" && (
                  <Link
                    href={`/live/${s.slug}/room`}
                    className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
                  >
                    Join room
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </ListPageLayout>
  );
}
