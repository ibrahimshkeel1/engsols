import Link from "next/link";
import { notFound } from "next/navigation";
import { getJobBySlug, getJobs } from "@/lib/data/jobs";
import { getCompanyBySlug } from "@/lib/data/companies";
import { getPublishedPortfolios } from "@/lib/data/portfolios";
import { buildDetailMetadata } from "@/lib/page-metadata";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { DisciplineBadge } from "@/components/ui/DisciplineBadge";
import { Card, CardContent } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { JobApplicationForm } from "@/components/jobs/JobApplicationForm";
import { ContentCrossLinks } from "@/components/shared/ContentCrossLinks";
import { ShareButton } from "@/components/shared/ShareButton";
import { JsonLd } from "@/components/seo/JsonLd";
import { jobPostingJsonLd } from "@/lib/seo/json-ld";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const jobs = await getJobs();
  return jobs.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) return { title: "Job not found" };
  return buildDetailMetadata({
    title: `${job.title} at ${job.company} | EngSols Jobs`,
    description: job.description.slice(0, 160),
    path: `/jobs/${slug}`,
  });
}

export default async function JobPage({ params }: Props) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) notFound();

  const [company, allJobs, portfolios, user] = await Promise.all([
    getCompanyBySlug(job.companySlug),
    getJobs(),
    getPublishedPortfolios(),
    getCurrentUser(),
  ]);

  const similar = allJobs.filter((j) => j.slug !== slug && j.discipline === job.discipline).slice(0, 3);
  const graduates = portfolios.filter((p) => p.discipline === job.discipline && p.openToWork).slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 pb-24 sm:px-6 lg:pb-12">
      <JsonLd
        data={jobPostingJsonLd({
          title: job.title,
          slug: job.slug,
          company: job.company,
          description: job.description,
          location: job.location,
          discipline: job.discipline,
          postedAt: job.postedAt,
        })}
      />
      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-md bg-muted px-2 py-0.5 text-xs capitalize">{job.type.replace("-", " ")}</span>
            <DisciplineBadge discipline={job.discipline} />
            <span className="rounded-md bg-muted px-2 py-0.5 text-xs">{job.remote}</span>
          </div>
          <h1 className="mt-3 font-display text-3xl tracking-tight">{job.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <p className="text-muted-foreground">
              <Link href={`/companies/${job.companySlug}`} className="font-medium text-primary">{job.company}</Link>
              {" · "}{job.location}
            </p>
            <ShareButton title={job.title} text={`${job.company} — ${job.discipline}`} className="shrink-0" />
          </div>
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
          <Card className="card-elevated">
            <CardContent className="p-6">
              <h3 className="font-semibold">Apply for this role</h3>
              <p className="mt-1 text-sm text-muted-foreground">Submit your details — the employer receives your application in their inbox.</p>
              <div className="mt-4">
                <JobApplicationForm
                  jobSlug={job.slug}
                  jobTitle={job.title}
                  company={job.company}
                  defaultName={user?.full_name ?? ""}
                  defaultEmail={user?.email ?? ""}
                />
              </div>
            </CardContent>
          </Card>
          {company && (
            <Card className="card-elevated">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <CompanyLogo company={company.name} />
                  <div>
                    <h3 className="font-semibold">{company.name}</h3>
                    <p className="text-sm text-muted-foreground">{company.headquarters}</p>
                  </div>
                </div>
                {company.verified && (
                  <span className="mt-2 inline-flex rounded-md bg-zone-mentorship/12 px-2 py-0.5 text-xs font-medium text-zone-mentorship-on">Verified</span>
                )}
                <Link href={`/companies/${company.slug}`} className="mt-3 inline-block text-sm text-primary">View company →</Link>
              </CardContent>
            </Card>
          )}
          {graduates.length > 0 && (
            <Card className="card-elevated">
              <CardContent className="p-6">
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
          <ContentCrossLinks discipline={job.discipline} />
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
  );
}
