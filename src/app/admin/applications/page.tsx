import Link from "next/link";
import { format } from "date-fns";
import { FileText } from "lucide-react";
import { getJobApplicationsForAdmin } from "@/lib/data/admin-content";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/EmptyState";
import { JobApplicationStatusButton } from "@/components/jobs/JobApplicationStatusButton";

export default async function AdminApplicationsPage() {
  const applications = await getJobApplicationsForAdmin();

  return (
    <div>
      <h1 className="text-2xl font-bold">Job applications</h1>
      <p className="mt-1 text-muted-foreground">All applications submitted through job listings.</p>
      <div className="mt-8 space-y-4">
        {applications.length === 0 ? (
          <EmptyState icon={FileText} title="No applications yet" description="Applications appear when candidates apply to jobs." />
        ) : (
          applications.map((app) => (
            <Card key={app.id} className="card-elevated">
              <CardContent className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-semibold">{app.applicant_name}</h2>
                    <p className="text-sm text-muted-foreground">{app.applicant_email}</p>
                    <Link href={`/jobs/${app.job_slug}`} className="mt-2 inline-block text-sm text-primary hover:underline">
                      {app.jobs?.title ?? app.job_slug} →
                    </Link>
                  </div>
                  <Badge className={app.status === "pending" ? "bg-primary/15 text-primary" : ""}>{app.status}</Badge>
                </div>
                <p className="mt-3 text-sm text-foreground/90">{app.message}</p>
                <p className="mt-2 text-xs text-muted-foreground">{format(new Date(app.created_at), "MMM d, yyyy h:mm a")}</p>
                <JobApplicationStatusButton applicationId={app.id} status={app.status} />
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
