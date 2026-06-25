import Link from "next/link";
import { notFound } from "next/navigation";
import { getApprovedMentors } from "@/lib/data/mentors";
import { getForumPostsByDiscipline } from "@/lib/data/forum";
import { getLiveSessions } from "@/lib/data/live";
import { getCertifications } from "@/lib/data/certifications";
import { getJobs } from "@/lib/data/jobs";
import { getDisciplineSlugs, slugToDiscipline } from "@/lib/discipline-slug";
import { getDisciplineColors } from "@/lib/discipline-colors";
import { getDisciplineHubContent } from "@/data/discipline-hub";
import { buildDetailMetadata } from "@/lib/page-metadata";
import { MentorCard } from "@/components/mentors/MentorCard";
import { ProfileBentoGrid } from "@/components/ui/ProfileBentoGrid";
import { ContentCrossLinks } from "@/components/shared/ContentCrossLinks";
import { RelativeTime } from "@/components/shared/RelativeTime";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { EmptyState } from "@/components/shared/EmptyState";
import { ButtonLink } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/JsonLd";
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
  const hub = getDisciplineHubContent(discipline);
  return buildDetailMetadata({
    title: `${hub.headline} | EngSols`,
    description: hub.subhead,
    path: `/disciplines/${slug}`,
    type: "website",
  });
}

export default async function DisciplinePage({ params }: Props) {
  const { slug } = await params;
  const discipline = slugToDiscipline(slug);
  if (!discipline) notFound();

  const hub = getDisciplineHubContent(discipline);

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
  const colors = getDisciplineColors(discipline);

  return (
    <div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: hub.headline,
          description: hub.subhead,
          url: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/disciplines/${slug}`,
        }}
      />

      <section className="hero-dark relative overflow-hidden">
        <div className={cn("absolute inset-x-0 top-0 h-1", colors.stripe)} />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <SectionReveal>
            <p className="section-label text-oil-gas-orange">Discipline hub</p>
            <h1 className="hero-dot-text mt-2 text-balance text-oil-gas-navy">{hub.headline}</h1>
            <p className="mt-3 max-w-2xl text-oil-gas-navy-muted">{hub.subhead}</p>

            <ul className="mt-6 grid gap-2 sm:grid-cols-3">
              {hub.outcomes.map((outcome) => (
                <li
                  key={outcome}
                  className="rounded-xl border border-oil-gas-navy/10 bg-white px-4 py-3 text-sm text-oil-gas-navy-muted"
                >
                  {outcome}
                </li>
              ))}
            </ul>

            <form action="/mentors" method="get" className="mt-8 flex max-w-lg gap-2">
              <input type="hidden" name="discipline" value={discipline} />
              <input
                name="search"
                type="search"
                placeholder={hub.searchPlaceholder}
                className="h-11 min-w-0 flex-1 rounded-xl border border-oil-gas-navy bg-oil-gas-navy px-4 text-sm text-oil-gas-white placeholder:text-oil-gas-white/70 focus:border-oil-gas-orange focus:outline-none focus:ring-2 focus:ring-oil-gas-orange/30"
              />
              <button
                type="submit"
                className="shrink-0 rounded-xl bg-oil-gas-orange px-4 text-sm font-semibold text-oil-gas-white hover:bg-oil-gas-orange-hover"
              >
                Search
              </button>
            </form>

            <div className="mt-6 flex flex-wrap gap-4 text-sm">
              <span className="rounded-full bg-oil-gas-navy/5 px-4 py-2 text-oil-gas-navy">
                <strong className="text-oil-gas-navy">{mentorCount}</strong> mentors
              </span>
              <span className="rounded-full bg-oil-gas-navy/5 px-4 py-2 text-oil-gas-navy">
                <strong className="text-oil-gas-navy">{posts.length}</strong> discussions
              </span>
              <span className="rounded-full bg-oil-gas-navy/5 px-4 py-2 text-oil-gas-navy">
                <strong className="text-oil-gas-navy">{liveSessions.length}</strong> live upcoming
              </span>
            </div>

            <ButtonLink
              href={`/mentors?discipline=${encodeURIComponent(discipline)}`}
              className="mt-8 bg-oil-gas-orange hover:bg-oil-gas-orange-hover"
            >
              Browse {discipline} mentors
            </ButtonLink>
          </SectionReveal>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-3 lg:items-start">
          <div className="space-y-12 lg:col-span-2">
            <SectionReveal>
              <section>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-oil-gas-navy">Mentors</h2>
                  <Link
                    href={`/mentors?discipline=${encodeURIComponent(discipline)}`}
                    className="text-sm text-oil-gas-orange hover:underline"
                  >
                    View all
                  </Link>
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
                      title={`No ${discipline.toLowerCase()} mentors yet`}
                      description="Browse all mentors or request a specialist — we're growing the directory."
                      action={{ href: "/mentors", label: "Browse mentors" }}
                      promptChips={mentorPromptChips.slice(0, 3)}
                    />
                  </div>
                )}
              </section>
            </SectionReveal>

            <SectionReveal delay={0.08}>
              <section>
                <h2 className="text-xl font-bold text-oil-gas-navy">Forum</h2>
                {posts.length > 0 ? (
                  <ul className="mt-4 space-y-3">
                    {posts.map((p) => (
                      <li key={p.slug}>
                        <Link
                          href={`/forum/${p.slug}`}
                          className="block rounded-xl border border-border bg-card p-4 hover:border-oil-gas-orange/30"
                        >
                          <p className="font-medium text-oil-gas-navy">{p.title}</p>
                          <p className="mt-1 text-xs text-oil-gas-navy-muted">
                            {p.replyCount} replies · <RelativeTime date={p.lastReplyAt ?? p.createdAt} />
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm text-oil-gas-navy-muted">
                    No discussions yet.{" "}
                    <Link href="/forum/new" className="text-oil-gas-orange hover:underline">
                      Start one
                    </Link>
                  </p>
                )}
                <Link
                  href={`/forum?discipline=${encodeURIComponent(discipline)}`}
                  className="mt-3 inline-block text-sm text-oil-gas-orange hover:underline"
                >
                  Browse forum →
                </Link>
              </section>
            </SectionReveal>

            {disciplineCerts.length > 0 && (
              <SectionReveal delay={0.1}>
                <section>
                  <h2 className="text-xl font-bold text-oil-gas-navy">Certifications</h2>
                  <ul className="mt-4 space-y-2">
                    {disciplineCerts.map((c) => (
                      <li key={c.slug}>
                        <Link href={`/certifications/${c.slug}`} className="text-oil-gas-orange hover:underline">
                          {c.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              </SectionReveal>
            )}

            {disciplineJobs.length > 0 && (
              <SectionReveal delay={0.12}>
                <section>
                  <h2 className="text-xl font-bold text-oil-gas-navy">Jobs</h2>
                  <ul className="mt-4 space-y-2">
                    {disciplineJobs.map((j) => (
                      <li key={j.slug}>
                        <Link href={`/jobs/${j.slug}`} className="text-oil-gas-orange hover:underline">
                          {j.title} at {j.company}
                        </Link>
                      </li>
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
