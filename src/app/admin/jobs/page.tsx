import Link from "next/link";
import { format } from "date-fns";
import { Briefcase } from "lucide-react";
import { getJobsForAdmin } from "@/lib/data/admin-content";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/EmptyState";
import { VerifyJobEmployerButton } from "@/components/admin/VerifyJobEmployerButton";
import { ToggleJobPublishedButton } from "@/components/admin/ToggleJobPublishedButton";

export default async function AdminJobsPage() {
  const jobs = await getJobsForAdmin();

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">Job listings</h1>
          <p className="mt-1 text-muted-foreground">Review posted jobs and verify employer accounts.</p>
        </div>
        <Link
          href="/jobs/post"
          className="inline-flex h-10 items-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:brightness-110"
        >
          Post a job
        </Link>
      </div>
      <div className="mt-8 space-y-4">
        {jobs.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No jobs yet"
            description="Job listings appear here when employers post through the site."
            action={{ href: "/jobs/post", label: "Post a job" }}
          />
        ) : (
          jobs.map((job) => (
            <Card key={job.id} className="card-elevated">
              <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold">{job.title}</h2>
                    {job.employer_verified ? (
                      <Badge className="bg-green-500/15 text-green-700 dark:text-green-400">Verified employer</Badge>
                    ) : (
                      <Badge className="bg-primary/15 text-primary">Unverified</Badge>
                    )}
                    {!job.published && <Badge className="bg-muted text-muted-foreground">Unpublished</Badge>}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {job.companies?.name ?? job.company_slug} · {job.location} · {job.discipline}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Posted {format(new Date(job.posted_at), "MMM d, yyyy")} · <span className="capitalize">{job.type.replace("-", " ")}</span>
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-3">
                  <Link href={`/jobs/${job.slug}`} className="text-sm font-medium text-primary hover:underline">
                    View →
                  </Link>
                  <ToggleJobPublishedButton jobId={job.id} published={job.published} />
                  <VerifyJobEmployerButton jobId={job.id} verified={job.employer_verified} />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
