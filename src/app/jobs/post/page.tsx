import Link from "next/link";
import { createJobListing } from "@/actions/content";
import { disciplines } from "@/data/disciplines";
import { requireUser } from "@/lib/require-auth";
import { getCompanies } from "@/lib/data/companies";
import { FormField } from "@/components/ui/FormField";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Input, Textarea, Select } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { safeDecodeURIComponent } from "@/lib/utils/safe-decode";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function PostJobPage({ searchParams }: Props) {
  await requireUser("/jobs/post");
  const params = await searchParams;
  const companies = await getCompanies();

  if (companies.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
        <h1 className="text-3xl font-bold">Post a job</h1>
        <p className="mt-4 text-muted-foreground">
          No companies in the directory yet. An admin must add your company first via{" "}
          <Link href="/admin/companies/new" className="text-primary hover:underline">Admin → Companies</Link>.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl tracking-tight">Post a job</h1>
      <p className="mt-2 text-muted-foreground">Reach engineering students and professionals on EngSols.</p>
      {params.error && (
        <p className="mt-4 rounded-xl bg-zone-news/10 px-4 py-3 text-sm text-zone-news-on">{safeDecodeURIComponent(params.error)}</p>
      )}
      <Card className="card-elevated mt-8">
        <CardContent className="p-6">
          <form action={createJobListing} className="space-y-5">
            <FormField label="Company" id="job-company">
              <Select name="companySlug" required className="w-full">
                <option value="">Select company</option>
                {companies.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </Select>
            </FormField>
            <FormField label="Job title" id="job-title">
              <Input name="title" required />
            </FormField>
            <FormField label="Type" id="job-type">
              <Select name="type" required className="w-full" defaultValue="full-time">
                <option value="full-time">Full-time</option>
                <option value="internship">Internship</option>
                <option value="contract">Contract</option>
                <option value="graduate-program">Graduate program</option>
              </Select>
            </FormField>
            <FormField label="Discipline" id="job-discipline">
              <Select name="discipline" required className="w-full">
                {disciplines.map((d) => <option key={d} value={d}>{d}</option>)}
              </Select>
            </FormField>
            <FormField label="Location" id="job-location">
              <Input name="location" required />
            </FormField>
            <FormField label="Remote policy" id="job-remote">
              <Select name="remote" required className="w-full" defaultValue="onsite">
                <option value="onsite">On-site</option>
                <option value="hybrid">Hybrid</option>
                <option value="remote">Remote</option>
              </Select>
            </FormField>
            <FormField label="Salary range (optional)" id="job-salary">
              <Input name="salaryRange" placeholder="e.g. $80k–$100k" />
            </FormField>
            <FormField label="Description" id="job-description">
              <Textarea name="description" required rows={6} />
            </FormField>
            <FormField label="Requirements (one per line)" id="job-req">
              <Textarea name="requirements" rows={4} placeholder="BSc in Petroleum Engineering&#10;2+ years experience" />
            </FormField>
            <FormField label="Benefits (one per line)" id="job-benefits">
              <Textarea name="benefits" rows={3} placeholder="Health insurance&#10;Rotation program" />
            </FormField>
            <SubmitButton variant="accent" className="w-full" pendingLabel="Posting...">Post job</SubmitButton>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
