import Link from "next/link";
import { notFound } from "next/navigation";
import { getPortfolio } from "@/lib/data/portfolios";
import { Avatar } from "@/components/ui/Avatar";
import { DisciplineBadge } from "@/components/ui/DisciplineBadge";
import { Card, CardContent } from "@/components/ui/card";
import { PortfolioContactForm } from "@/components/portfolios/PortfolioContactForm";

type Props = { params: Promise<{ slug: string }> };

export default async function PortfolioPage({ params }: Props) {
  const { slug } = await params;
  const portfolio = await getPortfolio(slug);
  if (!portfolio) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 pb-24 sm:px-6 lg:pb-12">
      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex items-start gap-4">
            <Avatar name={portfolio.name} discipline={portfolio.discipline} size="lg" className="ring-4 ring-border" src={portfolio.avatarUrl} />
            <div>
              {portfolio.openToWork && (
                <span className="inline-flex rounded-md bg-green-500/12 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
                  Open to work
                </span>
              )}
              <h1 className="mt-2 font-display text-3xl tracking-tight">{portfolio.name}</h1>
              <p className="text-lg text-muted-foreground">{portfolio.headline}</p>
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
                {portfolio.projects.map((proj) => (
                  <Card key={proj.title} className="card-elevated">
                    <CardContent className="p-5">
                      <h3 className="font-semibold">{proj.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{proj.description}</p>
                      <div className="mt-2 flex gap-2">
                        {proj.tags.map((t) => (
                          <span key={t} className="rounded-md bg-muted px-2 py-0.5 text-xs">{t}</span>
                        ))}
                        <span className="text-xs text-muted-foreground">{proj.year}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
