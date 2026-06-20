import { format } from "date-fns";
import { DollarSign, TrendingUp, Users } from "lucide-react";
import type { MentorEarningsData } from "@/lib/data/analytics";
import { formatPriceCents } from "@/lib/stripe";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyStateClient } from "@/components/shared/EmptyStateClient";
import { cn } from "@/lib/utils";

type Props = {
  earnings: MentorEarningsData;
};

function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  highlight = false,
}: {
  label: string;
  value: string;
  icon: typeof DollarSign;
  hint: string;
  highlight?: boolean;
}) {
  return (
    <Card className="card-elevated overflow-hidden border-zone-mentorship/20">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p
              className={cn(
                "mt-2 font-display text-3xl tracking-tight",
                highlight ? "text-zone-mentorship" : "text-text-main",
              )}
            >
              {value}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">{hint}</p>
          </div>
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-zone-mentorship/10 text-zone-mentorship">
            <Icon className="h-5 w-5" aria-hidden />
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export function MentorEarningsDashboard({ earnings }: Props) {
  const stats = [
    {
      label: "Total earnings",
      value: formatPriceCents(earnings.totalLifetimeEarningsCents),
      icon: DollarSign,
      hint: "Approximate lifetime paid mentorship revenue",
      highlight: true,
    },
    {
      label: "Monthly recurring revenue",
      value: formatPriceCents(earnings.monthlyRecurringRevenueCents),
      icon: TrendingUp,
      hint: "Active paid mentees × your monthly rate",
      highlight: true,
    },
    {
      label: "Active paid mentees",
      value: String(earnings.activePaidMentees),
      icon: Users,
      hint: "Students with an active paid subscription",
      highlight: false,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <Card className="card-elevated overflow-hidden border-zone-mentorship/20">
        <CardContent className="p-0">
          <div className="border-b border-zone-mentorship/15 bg-zone-mentorship/5 px-6 py-4">
            <h2 className="text-lg font-semibold text-zone-mentorship">Active student roster</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Paying mentees currently on your monthly mentorship plan.
            </p>
          </div>

          {earnings.activeRoster.length === 0 ? (
            <div className="p-6">
              <EmptyStateClient
                icon={Users}
                title="No active paid mentees yet"
                description="When students complete payment for monthly mentorship, they will appear here."
                action={{ href: "/mentor/profile", label: "Update public profile" }}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-zone-mentorship/5 text-left text-xs uppercase tracking-wide text-zone-mentorship">
                  <tr>
                    <th className="px-6 py-3 font-medium">Student</th>
                    <th className="px-6 py-3 font-medium">Email</th>
                    <th className="px-6 py-3 font-medium">Requested</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {earnings.activeRoster.map((mentee) => (
                    <tr
                      key={mentee.id}
                      className="border-t border-border transition-colors hover:bg-zone-mentorship/[0.03]"
                    >
                      <td className="border-s-2 border-s-zone-mentorship/40 px-6 py-4 font-medium">
                        {mentee.requesterName}
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={`mailto:${mentee.requesterEmail}`}
                          className="text-zone-mentorship hover:underline"
                        >
                          {mentee.requesterEmail}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {format(new Date(mentee.requestedAt), "MMM d, yyyy")}
                      </td>
                      <td className="px-6 py-4">
                        <Badge className="bg-zone-mentorship/15 text-zone-mentorship">
                          Active Subscriber
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
