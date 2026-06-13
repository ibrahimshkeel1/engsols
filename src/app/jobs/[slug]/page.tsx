import Link from "next/link";
import { notFound } from "next/navigation";
import { jobs, getJobBySlug } from "@/data/jobs";
import { companies } from "@/data/companies";
import { portfolios } from "@/data/portfolios";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ComingSoonButton } from "@/components/shared/ComingSoonButton";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return jobs.map((j) => ({ slug: j.slug }));
}

export default async function JobPage({ params }: Props) {
  const { slug } = await params;
  const job = getJobBySlug(slug);
  if (!job) notFound();

  const company = companies.find((c) => c.slug === job.companySlug);
  const similar = jobs.filter((j) => j.slug !== slug && j.discipline === job.discipline).slice(0, 3);
  const graduates = portfolios.filter((p) => p.discipline === job.discipline && p.openToWork).slice(0, 3);

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="flex flex-wrap gap-2">
              <Badge className="capitalize">{job.type.replace("-", " ")}</Badge>
              <Badge>{job.discipline}</Badge>
              <Badge>{job.remote}</Badge>
            </div>
            <h1 className="mt-3 text-3xl font-bold text-foreground">{job.title}</h1>
            <p className="mt-2 text-muted-foreground">
              <Link href={`/companies/${job.companySlug}`} className="font-medium text-primary">{job.company}</Link>
              {" · "}{job.location}
            </p>
            {job.salaryRange && <p className="mt-2 text-lg font-semibold">{job.salaryRange}</p>}
            <p className="mt-6 leading-relaxed text-foreground/90">{job.description}</p>
            <h2 className="mt-8 font-semibold">Requirements</h2>
            <ul className="mt-2 list-inside list-disc text-muted-foreground">
              {job.requirements.map((r) => <li key={r}>{r}</li>)}
            </ul>
            {job.benefits.length > 0 && (
              <>
                <h2 className="mt-6 font-semibold">Benefits</h2>
                <ul className="mt-2 list-inside list-disc text-muted-foreground">
                  {job.benefits.map((b) => <li key={b}>{b}</li>)}
                </ul>
              </>
            )}
          </div>
          <div className="space-y-6">
            <Card>
              <CardContent>
                <ComingSoonButton variant="accent" className="w-full">Apply now</ComingSoonButton>
                <ComingSoonButton variant="outline" className="mt-2 w-full">Save job</ComingSoonButton>
              </CardContent>
            </Card>
            {company && (
              <Card>
                <CardContent>
                  <h3 className="font-semibold">{company.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{company.headquarters}</p>
                  {company.verified && <Badge className="mt-2 bg-green-50 text-green-700">Verified</Badge>}
                  <Link href={`/companies/${company.slug}`} className="mt-3 inline-block text-sm text-primary">View company →</Link>
                </CardContent>
              </Card>
            )}
            {graduates.length > 0 && (
              <Card>
                <CardContent>
                  <h3 className="font-semibold">Graduates like this</h3>
                  <ul className="mt-2 space-y-2">
                    {graduates.map((p) => (
                      <li key={p.slug}>
                        <Link href={`/portfolios/${p.slug}`} className="text-sm text-primary">{p.name}</Link>
                      </li>
                    ))}
                  </ul>
                  <Link href={`/portfolios?discipline=${encodeURIComponent(job.discipline)}`} className="mt-2 inline-block text-sm text-muted-foreground">Browse portfolios →</Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        {similar.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold">Similar jobs</h2>
            <ul className="mt-4 space-y-2">
              {similar.map((j) => (
                <li key={j.slug}><Link href={`/jobs/${j.slug}`} className="text-primary">{j.title} at {j.company}</Link></li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
