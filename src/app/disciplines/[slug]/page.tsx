import Link from "next/link";
import { notFound } from "next/navigation";
import { getApprovedMentors } from "@/lib/data/mentors";
import { getForumPostsByDiscipline } from "@/lib/data/forum";
import { getLiveSessions } from "@/lib/data/live";
import { getCertifications } from "@/lib/data/certifications";
import { getJobs } from "@/lib/data/jobs";
import { getDisciplineSlugs, slugToDiscipline } from "@/lib/discipline-slug";
import { getDisciplineColors } from "@/lib/discipline-colors";
import { buildDetailMetadata } from "@/lib/page-metadata";
import { MentorCard } from "@/components/mentors/MentorCard";
import { ProfileBentoGrid } from "@/components/ui/ProfileBentoGrid";
import { ContentCrossLinks } from "@/components/shared/ContentCrossLinks";
import { RelativeTime } from "@/components/shared/RelativeTime";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { EmptyState } from "@/components/shared/EmptyState";
import { mentorPromptChips } from "@/data/empty-state-prompts";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getDisciplineSlugs().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const discipline = slugToDiscipline(slug);
  if (!discipline) return { title: "Discipline not found" };
  return buildDetailMetadata({
    title: `${discipline} | EngSols`,
    description: `Mentors, forum, certifications, and jobs for ${discipline.toLowerCase()} engineers.`,
    path: `/disciplines/${slug}`,
    type: "website",
  });
}

export default async function DisciplinePage({ params }: Props) {
  const { slug } = await params;
  const discipline = slugToDiscipline(slug);
  if (!discipline) notFound();

  const [allMentors, posts, sessions, certs, jobs] = await Promise.all([
    getApprovedMentors(),
    getForumPostsByDiscipline(discipline, 5),
    getLiveSessions(),
    getCertifications(),
    getJobs(),
  ]);

  const mentors = allMentors.filter((m) => m.discipline === discipline).slice(0, 12);
  const mentorCount = allMentors.filter((m) => m.discipline === discipline).length;
  const liveSessions = sessions.filter((s) => s.discipline === discipline && s.status !== "ended").slice(0, 4);
  const disciplineCerts = certs.filter((c) => c.discipline === discipline).slice(0, 4);
  const disciplineJobs = jobs.filter((j) => j.discipline === discipline).slice(0, 4);
  const stripe = getDisciplineColors(discipline).stripe;

  return (
    <div>
      <section className="hero-dark relative overflow-hidden">
        <div className={cn("absolute inset-x-0 top-0 h-1", stripe)} />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <SectionReveal>
            <p className="section-label">Discipline hub</p>
            <h1 className="font-display mt-2 text-4xl">{discipline}</h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Mentors, discussions, certifications, jobs, and live sessions — everything for {discipline.toLowerCase()} engineers.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm">
              <span className="rounded-full bg-card px-4 py-2"><strong>{mentorCount}</strong> mentors</span>
              <span className="rounded-full bg-card px-4 py-2"><strong>{posts.length}</strong> discussions</span>
              <span className="rounded-full bg-card px-4 py-2"><strong>{liveSessions.length}</strong> live upcoming</span>
            </div>
          </SectionReveal>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-3 lg:items-start">
          <div className="space-y-12 lg:col-span-2">
            <SectionReveal>
              <section>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Mentors</h2>
                  <Link href={`/mentors?discipline=${encodeURIComponent(discipline)}`} className="text-sm text-primary hover:underline">View all</Link>
                </div>
                {mentors.length > 0 ? (
                  <ProfileBentoGrid
                    className="mt-6"
                    items={mentors}
                    getKey={(m) => m.slug}
                    isFeatured={(m) => m.featured}
                    animated={false}
                    renderCard={(m) => <MentorCard mentor={m} />}
                  />
                ) : (
                  <div className="mt-4">
                    <EmptyState
                      icon={Users}
                      title="No mentors in this discipline yet"
                      description="Browse all mentors or check back as the directory grows."
                      action={{ href: "/mentors", label: "Browse mentors" }}
                      promptChips={mentorPromptChips.slice(0, 3)}
                    />
                  </div>
                )}
              </section>
            </SectionReveal>

            <SectionReveal delay={0.08}>
              <section>
                <h2 className="text-xl font-bold">Forum</h2>
                {posts.length > 0 ? (
                  <ul className="mt-4 space-y-3">
                    {posts.map((p) => (
                      <li key={p.slug}>
                        <Link href={`/forum/${p.slug}`} className="block rounded-xl border border-border bg-card p-4 hover:border-primary/30">
                          <p className="font-medium">{p.title}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{p.replyCount} replies · <RelativeTime date={p.lastReplyAt ?? p.createdAt} /></p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm text-muted-foreground">
                    No discussions yet.{" "}
                    <Link href="/forum/new" className="text-primary hover:underline">Start one</Link>
                  </p>
                )}
                <Link href={`/forum?discipline=${encodeURIComponent(discipline)}`} className="mt-3 inline-block text-sm text-primary hover:underline">Browse forum →</Link>
              </section>
            </SectionReveal>

            {disciplineCerts.length > 0 && (
              <SectionReveal delay={0.1}>
                <section>
                  <h2 className="text-xl font-bold">Certifications</h2>
                  <ul className="mt-4 space-y-2">
                    {disciplineCerts.map((c) => (
                      <li key={c.slug}><Link href={`/certifications/${c.slug}`} className="text-primary hover:underline">{c.name}</Link></li>
                    ))}
                  </ul>
                </section>
              </SectionReveal>
            )}

            {disciplineJobs.length > 0 && (
              <SectionReveal delay={0.12}>
                <section>
                  <h2 className="text-xl font-bold">Jobs</h2>
                  <ul className="mt-4 space-y-2">
                    {disciplineJobs.map((j) => (
                      <li key={j.slug}><Link href={`/jobs/${j.slug}`} className="text-primary hover:underline">{j.title} at {j.company}</Link></li>
                    ))}
                  </ul>
                </section>
              </SectionReveal>
            )}
          </div>

          <ContentCrossLinks discipline={discipline} className="lg:sticky lg:top-24 lg:self-start" />
        </div>
      </div>
    </div>
  );
}
