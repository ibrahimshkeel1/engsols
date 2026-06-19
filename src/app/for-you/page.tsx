import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getForYouDigest } from "@/lib/data/for-you-digest";
import { disciplineToSlug } from "@/lib/discipline-slug";
import { Avatar } from "@/components/ui/Avatar";
import { Card, CardContent } from "@/components/ui/card";
import { SessionCountdown } from "@/components/shared/SessionCountdown";
import { RelativeTime } from "@/components/shared/RelativeTime";

export default async function ForYouPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/for-you");

  const digest = await getForYouDigest(user.id);
  if (!digest) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="font-display text-3xl">Your digest</h1>
        <p className="mt-4 text-muted-foreground">Complete onboarding to personalize your weekly digest.</p>
        <Link href="/onboarding/student" className="mt-6 inline-flex text-primary hover:underline">Set up profile →</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <p className="section-label">This week for you</p>
      <h1 className="font-display mt-1 text-3xl">Your digest</h1>
      <p className="mt-2 text-muted-foreground">
        Curated for <span className="font-medium text-foreground">{digest.discipline}</span>
        {digest.goals[0] && <> · focused on {digest.goals[0]}</>}
      </p>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Mentors for you</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {digest.newMentors.map((m) => (
            <Link key={m.slug} href={`/mentors/${m.slug}`} className="card-interactive rounded-xl border border-border bg-card p-4">
              <Avatar name={m.name} discipline={m.discipline} size="md" src={m.avatarUrl} />
              <p className="mt-3 font-semibold">{m.name}</p>
              <p className="text-sm text-muted-foreground">{m.headline}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Matching discussions</h2>
        <ul className="mt-4 space-y-3">
          {digest.forumThreads.map((p) => (
            <li key={p.slug}>
              <Link href={`/forum/${p.slug}`} className="block rounded-xl border border-border bg-card p-4 hover:border-primary/30">
                <p className="font-medium">{p.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {p.replyCount} replies · active <RelativeTime date={p.lastReplyAt ?? p.createdAt} />
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {digest.liveThisWeek.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold">Live this week</h2>
          <div className="mt-4 space-y-3">
            {digest.liveThisWeek.map((s) => (
              <Link key={s.slug} href={`/live/${s.slug}`} className="flex items-center justify-between rounded-xl border border-border bg-card p-4 hover:border-primary/30">
                <div>
                  <p className="font-medium">{s.title}</p>
                  <p className="text-sm text-muted-foreground">{s.discipline}</p>
                </div>
                {s.status === "upcoming" && <SessionCountdown scheduledAt={s.scheduledAt} />}
                {s.status === "live" && <span className="text-xs font-semibold text-red-600">Live now</span>}
              </Link>
            ))}
          </div>
        </section>
      )}

      {digest.jobs.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold">Jobs in your field</h2>
          <ul className="mt-4 space-y-2">
            {digest.jobs.map((j) => (
              <li key={j.slug}>
                <Link href={`/jobs/${j.slug}`} className="text-primary hover:underline">{j.title} at {j.company}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {digest.certMilestones.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold">Cert milestones</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {digest.certMilestones.map((c) => (
              <Link key={c.slug} href={`/certifications/${c.slug}`} className="rounded-xl border border-border bg-card p-4 hover:border-primary/30">
                <p className="font-semibold">{c.shortName}</p>
                <p className="text-sm text-muted-foreground">~{c.avgPrepMonths} months prep</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Card className="card-elevated mt-12">
        <CardContent className="p-6">
          <p className="font-medium">Explore your discipline hub</p>
          <p className="mt-1 text-sm text-muted-foreground">All mentors, forum threads, and live sessions in one place.</p>
          <Link
            href={`/disciplines/${disciplineToSlug(digest.discipline)}`}
            className="mt-4 inline-flex text-sm font-medium text-primary hover:underline"
          >
            Open {digest.discipline} hub →
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
