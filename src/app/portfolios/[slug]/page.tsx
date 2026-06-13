import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPortfolio } from "@/lib/data/portfolios";
import { avatarUrl } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ComingSoonButton } from "@/components/shared/ComingSoonButton";

type Props = { params: Promise<{ slug: string }> };

export default async function PortfolioPage({ params }: Props) {
  const { slug } = await params;
  const portfolio = await getPortfolio(slug);
  if (!portfolio) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex items-start gap-4">
            <Image src={avatarUrl(portfolio.name)} alt="" width={80} height={80} className="rounded-full ring-4 ring-border" unoptimized />
            <div>
              {portfolio.openToWork && <Badge className="bg-green-500/15 text-green-700 dark:text-green-400">Open to work</Badge>}
              <h1 className="mt-2 text-3xl font-bold">{portfolio.name}</h1>
              <p className="text-lg text-muted-foreground">{portfolio.headline}</p>
              <p className="text-muted-foreground">{portfolio.university} · Class of {portfolio.graduationYear} · {portfolio.location}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge>{portfolio.discipline}</Badge>
                <Badge className="capitalize">Seeking: {portfolio.seeking.replace("-", " ")}</Badge>
              </div>
            </div>
          </div>
          <p className="mt-6 leading-relaxed text-foreground/90">{portfolio.bio}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {portfolio.skills.map((s) => <Badge key={s}>{s}</Badge>)}
          </div>
          {portfolio.credentials.length > 0 && (
            <p className="mt-4 text-sm text-muted-foreground">Credentials: {portfolio.credentials.join(", ")}</p>
          )}
          <h2 className="mt-10 text-xl font-bold">Projects</h2>
          <div className="mt-4 space-y-4">
            {portfolio.projects.map((proj) => (
              <Card key={proj.title} className="card-elevated">
                <CardContent className="p-5">
                  <h3 className="font-semibold">{proj.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{proj.description}</p>
                  <div className="mt-2 flex gap-2">
                    {proj.tags.map((t) => <Badge key={t}>{t}</Badge>)}
                    <span className="text-xs text-muted-foreground">{proj.year}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
              <ComingSoonButton variant="accent" className="w-full">Contact student</ComingSoonButton>
              <Link href={`/jobs?discipline=${encodeURIComponent(portfolio.discipline)}`} className="mt-3 block text-center text-sm text-primary hover:underline">
                Jobs in {portfolio.discipline} →
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
