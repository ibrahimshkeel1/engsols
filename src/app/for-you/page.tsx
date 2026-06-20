import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getForYouDigest } from "@/lib/data/for-you-digest";
import { getRoadmapsForStudent } from "@/lib/data/roadmaps";
import { MilestoneTracker } from "@/components/dashboard/MilestoneTracker";
import { disciplineToSlug } from "@/lib/discipline-slug";
import { Avatar } from "@/components/ui/Avatar";
import { Card, CardContent } from "@/components/ui/card";
import { SessionCountdown } from "@/components/shared/SessionCountdown";
import { RelativeTime } from "@/components/shared/RelativeTime";
import { SectionReveal } from "@/components/motion/SectionReveal";

export default async function ForYouPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/for-you");

  const digest = await getForYouDigest(user.id);
  const roadmaps = await getRoadmapsForStudent(user.id);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <SectionReveal>
        <p className="section-label">This week for you</p>
        <h1 className="font-display mt-1 text-3xl">Your digest</h1>
        <p className="mt-2 text-muted-foreground">
          Curated for <span className="font-medium text-foreground">{digest.discipline}</span>
          {digest.goals[0] && <> · focused on {digest.goals[0]}</>}
        </p>
        {!user.full_name && (
          <p className="mt-4 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
            <Link href="/onboarding/student" className="font-medium text-primary hover:underline">
              Complete onboarding
            </Link>{" "}
            to sharpen mentor matches and goal tracking.
          </p>
        )}
      </SectionReveal>

      <SectionReveal className="mt-10" delay={0.06}>
        <section>
          <h2 className="text-lg font-semibold">Mentorship milestones</h2>
          <p className="mt-1 text-sm text-muted-foreground">Progress on roadmaps your mentor assigned.</p>
          <div className="mt-4">
            <MilestoneTracker
              roadmaps={roadmaps}
              viewerRole="student"
              emptyMessage="No active roadmaps — ask your mentor to set one up after your next session."
            />
          </div>
        </section>
      </SectionReveal>

      <SectionReveal className="mt-10" delay={0.05}>
        <section>
          <h2 className="text-lg font-semibold">Mentors for you</h2>
          {digest.newMentors.length > 0 ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {digest.newMentors.map((m) => (
                <Link key={m.slug} href={`/mentors/${m.slug}`} className="card-interactive rounded-xl border border-border bg-card p-4">
                  <Avatar name={m.name} discipline={m.discipline} size="md" src={m.avatarUrl} />
                  <p className="mt-3 font-semibold">{m.name}</p>
                  <p className="text-sm text-muted-foreground">{m.headline}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              No mentors in your discipline yet.{" "}
              <Link href="/mentors" className="text-primary hover:underline">Browse all mentors</Link>
            </p>
          )}
        </section>
      </SectionReveal>

      <SectionReveal className="mt-10" delay={0.08}>
        <section>
          <h2 className="text-lg font-semibold">Matching discussions</h2>
          {digest.forumThreads.length > 0 ? (
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
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              No active threads yet.{" "}
              <Link href="/forum/new" className="text-primary hover:underline">Start a discussion</Link>
            </p>
          )}
        </section>
      </SectionReveal>

      <SectionReveal className="mt-10" delay={0.1}>
        <section>
          <h2 className="text-lg font-semibold">Live this week</h2>
          {digest.liveThisWeek.length > 0 ? (
            <div className="mt-4 space-y-3">
              {digest.liveThisWeek.map((s) => (
                <Link key={s.slug} href={`/live/${s.slug}`} className="flex items-center justify-between rounded-xl border border-border bg-card p-4 hover:border-primary/30">
                  <div>
                    <p className="font-medium">{s.title}</p>
                    <p className="text-sm text-muted-foreground">{s.discipline}</p>
                  </div>
                  {s.status === "upcoming" && <SessionCountdown scheduledAt={s.scheduledAt} />}
                  {s.status === "live" && <span className="text-xs font-semibold text-zone-live">Live now</span>}
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              No live sessions scheduled.{" "}
              <Link href="/live" className="text-primary hover:underline">Browse upcoming sessions</Link>
            </p>
          )}
        </section>
      </SectionReveal>

      <SectionReveal className="mt-10" delay={0.12}>
        <section>
          <h2 className="text-lg font-semibold">Jobs in your field</h2>
          {digest.jobs.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {digest.jobs.map((j) => (
                <li key={j.slug}>
                  <Link href={`/jobs/${j.slug}`} className="text-primary hover:underline">{j.title} at {j.company}</Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              No jobs posted yet.{" "}
              <Link href="/jobs" className="text-primary hover:underline">Check the jobs board</Link>
            </p>
          )}
        </section>
      </SectionReveal>

      <SectionReveal className="mt-10" delay={0.14}>
        <section>
          <h2 className="text-lg font-semibold">Cert milestones</h2>
          {digest.certMilestones.length > 0 ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {digest.certMilestones.map((c) => (
                <Link key={c.slug} href={`/certifications/${c.slug}`} className="rounded-xl border border-border bg-card p-4 hover:border-primary/30">
                  <p className="font-semibold">{c.shortName}</p>
                  <p className="text-sm text-muted-foreground">~{c.avgPrepMonths} months prep</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              <Link href="/certifications" className="text-primary hover:underline">Browse certifications</Link>
            </p>
          )}
        </section>
      </SectionReveal>

      <SectionReveal className="mt-12" delay={0.16}>
        <Card className="card-elevated">
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
      </SectionReveal>
    </div>
  );
}
