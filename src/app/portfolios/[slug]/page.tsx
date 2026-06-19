import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getPortfolio } from "@/lib/data/portfolios";
import { getMentorProfileByUserId } from "@/lib/data/mentors";
import { Avatar } from "@/components/ui/Avatar";
import { DisciplineBadge } from "@/components/ui/DisciplineBadge";
import { Card, CardContent } from "@/components/ui/card";
import { PortfolioContactForm } from "@/components/portfolios/PortfolioContactForm";
import { ShareButton } from "@/components/shared/ShareButton";
import { EndorsementBadge } from "@/components/portfolios/EndorsementBadge";
import { EndorseProjectButton } from "@/components/portfolios/EndorseProjectButton";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const portfolio = await getPortfolio(slug);
  if (!portfolio) return { title: "Portfolio not found" };
  return {
    title: `${portfolio.name} — ${portfolio.headline} | EngSols`,
    description: portfolio.bio.slice(0, 160),
    openGraph: { title: portfolio.name, description: portfolio.headline },
    twitter: { card: "summary_large_image", title: portfolio.name, description: portfolio.headline },
  };
}

export default async function PortfolioPage({ params }: Props) {
  const { slug } = await params;
  const [portfolio, user] = await Promise.all([getPortfolio(slug), getCurrentUser()]);
  if (!portfolio) notFound();

  const mentorProfile = user ? await getMentorProfileByUserId(user.id) : null;
  const canEndorse =
    mentorProfile?.status === "approved" &&
    user &&
    portfolio.userId !== user.id;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 pb-24 sm:px-6 lg:pb-12">
      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex items-start gap-6 sm:gap-8">
            <Avatar name={portfolio.name} discipline={portfolio.discipline} size="2xl" className="shrink-0 rounded-2xl ring-4 ring-border" src={portfolio.avatarUrl} />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                {portfolio.openToWork && (
                  <span className="inline-flex rounded-md bg-green-500/12 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
                    Open to work
                  </span>
                )}
                {portfolio.hasMentorEndorsement && (
                  <span className="inline-flex rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                    {portfolio.endorsementCount} mentor endorsement{portfolio.endorsementCount === 1 ? "" : "s"}
                  </span>
                )}
              </div>
              <h1 className="font-display text-3xl sm:text-4xl">{portfolio.name}</h1>
              <p className="text-lg text-muted-foreground">{portfolio.headline}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <ShareButton title={`${portfolio.name}'s portfolio`} text={portfolio.headline} />
              </div>
              <p className="text-muted-foreground">{portfolio.university} · Class of {portfolio.graduationYear} · {portfolio.location}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <DisciplineBadge discipline={portfolio.discipline} />
                <span className="rounded-md bg-muted px-2 py-0.5 text-xs capitalize">Seeking: {portfolio.seeking.replace("-", " ")}</span>
              </div>
            </div>
          </div>
          <p className="mt-6 leading-relaxed text-foreground/90">{portfolio.bio}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {portfolio.skills.map((s) => (
              <span key={s} className="rounded-md bg-muted px-2 py-0.5 text-xs">{s}</span>
            ))}
          </div>
          {portfolio.credentials.length > 0 && (
            <p className="mt-4 text-sm text-muted-foreground">Credentials: {portfolio.credentials.join(", ")}</p>
          )}
          {portfolio.projects.length > 0 && (
            <>
              <h2 className="mt-10 text-xl font-bold">Projects</h2>
              <div className="mt-4 space-y-4">
                {portfolio.projects.map((proj) => {
                  const myEndorsement = canEndorse
                    ? proj.endorsements?.find((e) => e.mentorSlug === mentorProfile?.slug)
                    : undefined;

                  return (
                    <Card key={proj.id} className="card-elevated">
                      <CardContent className="p-5">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-semibold">{proj.title}</h3>
                              {(proj.endorsements?.length ?? 0) > 0 && (
                                <EndorsementBadge endorsements={proj.endorsements ?? []} size="md" />
                              )}
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">{proj.description}</p>
                          </div>
                          {canEndorse && (
                            <EndorseProjectButton
                              projectId={proj.id}
                              portfolioId={portfolio.id}
                              projectTitle={proj.title}
                              existingEndorsement={myEndorsement}
                            />
                          )}
                        </div>
                        <div className="mt-2 flex gap-2">
                          {proj.tags.map((t) => (
                            <span key={t} className="rounded-md bg-muted px-2 py-0.5 text-xs">{t}</span>
                          ))}
                          <span className="text-xs text-muted-foreground">{proj.year}</span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </>
          )}
          {portfolio.experience.length > 0 && (
            <>
              <h2 className="mt-10 text-xl font-bold">Experience</h2>
              <div className="mt-4 space-y-4">
                {portfolio.experience.map((exp) => (
                  <div key={exp.role + exp.company}>
                    <p className="font-semibold">{exp.role} — {exp.company}</p>
                    <p className="text-sm text-muted-foreground">{exp.duration}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{exp.description}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <div>
          <Card className="card-elevated sticky top-24">
            <CardContent className="p-6">
              <h3 className="font-semibold">Reach out</h3>
              <p className="mt-1 text-sm text-muted-foreground">Recruiters and mentors can contact {portfolio.name.split(" ")[0]} directly.</p>
              <div className="mt-4">
                <PortfolioContactForm portfolioSlug={portfolio.slug} studentName={portfolio.name} />
              </div>
              <Link href={`/jobs?discipline=${encodeURIComponent(portfolio.discipline)}`} className="mt-4 block text-center text-sm text-primary hover:underline">
                Jobs in {portfolio.discipline} →
              </Link>
              <Link href="/companies/talent" className="mt-2 block text-center text-sm text-muted-foreground hover:text-primary">
                Recruiter talent hub →
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
