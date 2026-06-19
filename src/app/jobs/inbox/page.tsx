import { redirect } from "next/navigation";
import { format } from "date-fns";
import { Inbox } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getJobApplicationsForPoster } from "@/lib/data/admin-content";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { JobApplicationStatusButton } from "@/components/jobs/JobApplicationStatusButton";
import { EmptyState } from "@/components/shared/EmptyState";
import { jobPromptChips } from "@/data/empty-state-prompts";

export default async function JobInboxPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/jobs/inbox");

  const applications = await getJobApplicationsForPoster(user.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl tracking-tight">Job applications inbox</h1>
      <p className="mt-2 text-muted-foreground">Applications for jobs you posted.</p>
      <div className="mt-8 space-y-4">
        {applications.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No applications yet"
            description="Post a role to start receiving candidates from the EngSols community."
            action={{ href: "/jobs/post", label: "Post a job" }}
            promptChips={jobPromptChips.slice(0, 3)}
          />
        ) : (
          applications.map((app) => (
            <Card key={app.id} className="card-elevated">
              <CardContent className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-semibold">{app.applicant_name}</h2>
                    <a href={`mailto:${app.applicant_email}`} className="text-sm text-primary hover:underline">{app.applicant_email}</a>
                    <p className="mt-2 text-sm text-muted-foreground">{app.jobs?.title}</p>
                  </div>
                  <Badge>{app.status}</Badge>
                </div>
                <p className="mt-3 text-sm">{app.message}</p>
                <p className="mt-2 text-xs text-muted-foreground">{format(new Date(app.created_at), "MMM d, yyyy")}</p>
                <JobApplicationStatusButton applicationId={app.id} status={app.status} />
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
