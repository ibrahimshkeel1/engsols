import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCompanies, getCompanyBySlug } from "@/lib/data/companies";
import { getJobsByCompanySlug } from "@/lib/data/jobs";
import { getListingsByCompanySlug } from "@/lib/data/marketplace";
import { getApprovedMentors } from "@/lib/data/mentors";
import { companyLogo } from "@/lib/placeholders";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const companies = await getCompanies();
  return companies.map((c) => ({ slug: c.slug }));
}

export default async function CompanyPage({ params }: Props) {
  const { slug } = await params;
  const company = await getCompanyBySlug(slug);
  if (!company) notFound();

  const [companyJobs, companyListings, mentors] = await Promise.all([
    getJobsByCompanySlug(company.slug),
    getListingsByCompanySlug(company.slug),
    getApprovedMentors(),
  ]);

  const employees = mentors
    .filter((m) => m.company.toLowerCase().includes(company.name.split(" ")[0].toLowerCase()))
    .slice(0, 4);

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-start gap-6">
          <Image src={companyLogo(company.name)} alt="" width={80} height={80} className="rounded-xl" unoptimized />
          <div>
            {company.verified && <Badge className="bg-green-50 text-green-700">Verified employer</Badge>}
            <h1 className="mt-2 text-3xl font-bold text-foreground">{company.name}</h1>
            <p className="capitalize text-muted-foreground">{company.type.replace("-", " ")} · {company.headquarters}</p>
            <p className="text-sm text-muted-foreground">Founded {company.founded} · {company.employeeCount} employees</p>
          </div>
        </div>
        <p className="mt-6 max-w-3xl text-foreground/90">{company.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {company.disciplines.map((d) => <Badge key={d}>{d}</Badge>)}
        </div>
        <h2 className="mt-10 text-xl font-bold">Open jobs ({companyJobs.length})</h2>
        <div className="mt-4 space-y-3">
          {companyJobs.length === 0 && <p className="text-muted-foreground">No open positions right now.</p>}
          {companyJobs.map((job) => (
            <Card key={job.slug}>
              <CardContent className="py-3">
                <Link href={`/jobs/${job.slug}`} className="font-semibold text-foreground hover:text-primary">{job.title}</Link>
                <p className="text-sm text-muted-foreground">{job.location} · {job.type.replace("-", " ")}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        {companyListings.length > 0 && (
          <>
            <h2 className="mt-10 text-xl font-bold">Marketplace listings</h2>
            <ul className="mt-4 space-y-2">
              {companyListings.map((l) => (
                <li key={l.slug}>
                  <Link href={`/marketplace/${l.slug}`} className="text-primary">{l.title}</Link>
                </li>
              ))}
            </ul>
          </>
        )}
        {employees.length > 0 && (
          <>
            <h2 className="mt-10 text-xl font-bold">Mentors at {company.name}</h2>
            <ul className="mt-4 space-y-2">
              {employees.map((m) => (
                <li key={m.slug}>
                  <Link href={`/mentors/${m.slug}`} className="text-primary">{m.name} — {m.headline}</Link>
                </li>
              ))}
            </ul>
          </>
        )}
        <Link href="/jobs/post" className="mt-8 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-foreground">
          Post a job at this company
        </Link>
      </div>
    </div>
  );
}
