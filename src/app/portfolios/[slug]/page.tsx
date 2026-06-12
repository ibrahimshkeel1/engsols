import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { portfolios, getPortfolioBySlug } from "@/data/portfolios";
import { mentors } from "@/data/mentors";
import { avatarUrl } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ComingSoonButton } from "@/components/shared/ComingSoonButton";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return portfolios.map((p) => ({ slug: p.slug }));
}

export default async function PortfolioPage({ params }: Props) {
  const { slug } = await params;
  const portfolio = getPortfolioBySlug(slug);
  if (!portfolio) notFound();

  const mentor = portfolio.mentorSlug ? mentors.find((m) => m.slug === portfolio.mentorSlug) : null;

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="flex items-start gap-4">
              <Image src={avatarUrl(portfolio.name)} alt="" width={80} height={80} className="rounded-full" unoptimized />
              <div>
                {portfolio.openToWork && <Badge className="bg-green-50 text-green-700">Open to work</Badge>}
                <h1 className="mt-2 text-3xl font-bold text-slate-900">{portfolio.name}</h1>
                <p className="text-lg text-slate-600">{portfolio.headline}</p>
                <p className="text-slate-500">{portfolio.university} · Class of {portfolio.graduationYear} · {portfolio.location}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge>{portfolio.discipline}</Badge>
                  <Badge className="capitalize">Seeking: {portfolio.seeking.replace("-", " ")}</Badge>
                </div>
              </div>
            </div>
            <p className="mt-6 text-slate-700">{portfolio.bio}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {portfolio.skills.map((s) => <Badge key={s}>{s}</Badge>)}
            </div>
            {portfolio.credentials.length > 0 && (
              <p className="mt-4 text-sm text-slate-600">Credentials: {portfolio.credentials.join(", ")}</p>
            )}
            <h2 className="mt-10 text-xl font-bold">Projects</h2>
            <div className="mt-4 space-y-4">
              {portfolio.projects.map((proj) => (
                <Card key={proj.title}>
                  <CardContent>
                    <h3 className="font-semibold">{proj.title}</h3>
                    <p className="mt-1 text-sm text-slate-600">{proj.description}</p>
                    <div className="mt-2 flex gap-2">
                      {proj.tags.map((t) => <Badge key={t}>{t}</Badge>)}
                      <span className="text-xs text-slate-500">{proj.year}</span>
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
                      <p className="text-sm text-slate-500">{exp.duration}</p>
                      <p className="mt-1 text-sm text-slate-600">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
          <div>
            <Card className="sticky top-24">
              <CardContent>
                <ComingSoonButton variant="accent" className="w-full">Contact student</ComingSoonButton>
                <Link href={`/jobs?discipline=${encodeURIComponent(portfolio.discipline)}`} className="mt-3 block text-center text-sm text-amber-600">
                  Jobs in {portfolio.discipline} →
                </Link>
                {mentor && (
                  <div className="mt-6 border-t border-slate-200 pt-4">
                    <p className="text-sm font-medium">Mentored by</p>
                    <Link href={`/mentors/${mentor.slug}`} className="text-sm text-amber-600">{mentor.name}</Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
