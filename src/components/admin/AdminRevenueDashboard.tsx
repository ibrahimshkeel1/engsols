import { format } from "date-fns";
import { BookOpen, CreditCard, TrendingUp, Users } from "lucide-react";
import type { PlatformRevenueData, PlatformTransaction } from "@/lib/data/analytics";
import { formatPriceCents } from "@/lib/stripe";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyStateClient } from "@/components/shared/EmptyStateClient";

type Props = {
  revenue: PlatformRevenueData;
};

function StatCard({
  label,
  value,
  icon: Icon,
  hint,
}: {
  label: string;
  value: string;
  icon: typeof CreditCard;
  hint: string;
}) {
  return (
    <Card className="card-elevated overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-2 font-display text-3xl tracking-tight">{value}</p>
            <p className="mt-2 text-xs text-muted-foreground">{hint}</p>
          </div>
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Icon className="h-5 w-5" aria-hidden />
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function transactionBadge(type: PlatformTransaction["type"]) {
  if (type === "exam") {
    return (
      <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-300">
        Exam sale
      </Badge>
    );
  }

  return (
    <Badge className="bg-violet-500/15 text-violet-700 dark:text-violet-300">
      Mentorship
    </Badge>
  );
}

export function AdminRevenueDashboard({ revenue }: Props) {
  const stats = [
    {
      label: "Total exam revenue",
      value: formatPriceCents(revenue.totalExamRevenueCents),
      icon: BookOpen,
      hint: `${revenue.totalExamSales} exam unlock${revenue.totalExamSales === 1 ? "" : "s"} sold`,
    },
    {
      label: "Mentorship volume (MRR)",
      value: formatPriceCents(revenue.totalMentorshipVolumeCents),
      icon: TrendingUp,
      hint: "Gross monthly value of active paid subscriptions",
    },
    {
      label: "Active mentorships",
      value: String(revenue.activeMentorshipSubscriptions),
      icon: Users,
      hint: "Paid monthly bookings currently active",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <Card className="card-elevated">
        <CardContent className="p-0">
          <div className="border-b border-border px-6 py-4">
            <h2 className="text-lg font-semibold">Recent transactions</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Latest exam unlocks and paid mentorship subscriptions across the platform.
            </p>
          </div>

          {revenue.recentTransactions.length === 0 ? (
            <div className="p-6">
              <EmptyStateClient
                icon={CreditCard}
                title="No revenue recorded yet"
                description="Exam purchases and paid mentorship bookings will appear here as soon as Stripe payments complete."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-6 py-3 font-medium">Transaction</th>
                    <th className="px-6 py-3 font-medium">Type</th>
                    <th className="px-6 py-3 font-medium">Amount</th>
                    <th className="px-6 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {revenue.recentTransactions.map((transaction) => (
                    <tr key={`${transaction.type}-${transaction.id}`} className="border-t border-border">
                      <td className="px-6 py-4 font-medium">{transaction.description}</td>
                      <td className="px-6 py-4">{transactionBadge(transaction.type)}</td>
                      <td className="px-6 py-4">{formatPriceCents(transaction.amountCents)}</td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {format(new Date(transaction.occurredAt), "MMM d, yyyy h:mm a")}
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
