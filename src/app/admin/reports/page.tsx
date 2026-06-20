import Link from "next/link";
import { format } from "date-fns";
import { Flag } from "lucide-react";
import { getReportsForAdmin, getReportContentLink } from "@/lib/data/admin-content";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/EmptyState";
import { ReportActionButtons } from "@/components/admin/ReportActionButtons";

export default async function AdminReportsPage() {
  const reports = await getReportsForAdmin();
  const pendingCount = reports.filter((r) => r.status === "pending").length;

  const links = await Promise.all(
    reports.map((r) => getReportContentLink(r.content_type, r.content_id)),
  );

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold">Content reports</h1>
        <p className="mt-1 text-muted-foreground">
          Review user-submitted reports on forum posts and other content.
          {pendingCount > 0 && (
            <span className="ml-1 font-medium text-primary">{pendingCount} pending</span>
          )}
        </p>
      </div>
      <div className="mt-8 space-y-4">
        {reports.length === 0 ? (
          <EmptyState
            icon={Flag}
            title="No reports yet"
            description="Content reports from users will appear here for moderation."
          />
        ) : (
          reports.map((report, i) => (
            <Card key={report.id} className="card-elevated">
              <CardContent className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="capitalize">{report.content_type.replace(/_/g, " ")}</Badge>
                    <Badge
                      className={
                        report.status === "pending"
                          ? "bg-primary/15 text-primary"
                          : report.status === "resolved"
                            ? "bg-zone-mentorship/15 text-zone-mentorship-on"
                            : "bg-muted text-muted-foreground"
                      }
                    >
                      {report.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(report.created_at), "MMM d, yyyy h:mm a")}
                  </p>
                </div>
                <p className="mt-3 text-sm font-medium">
                  Reported by {report.profiles?.full_name ?? "Unknown user"}
                </p>
                <p className="mt-2 text-sm text-foreground/90">{report.reason}</p>
                {links[i] && (
                  <Link href={links[i]!} className="mt-3 inline-block text-sm text-primary hover:underline">
                    View reported content →
                  </Link>
                )}
                <ReportActionButtons reportId={report.id} status={report.status} contentType={report.content_type} />
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
