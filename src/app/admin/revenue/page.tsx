import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { getPlatformRevenueData } from "@/lib/data/analytics";
import { AdminRevenueDashboard } from "@/components/admin/AdminRevenueDashboard";

export default async function AdminRevenuePage() {
  const admin = await requireRole(["admin"]);
  if (!admin) redirect("/login?next=/admin/revenue");

  const revenue = await getPlatformRevenueData();

  return (
    <div>
      <h1 className="text-2xl font-bold">Revenue analytics</h1>
      <p className="mt-1 text-muted-foreground">
        Platform-wide gross revenue from premium exams and paid mentorship subscriptions.
      </p>
      <div className="mt-8">
        <AdminRevenueDashboard revenue={revenue} />
      </div>
    </div>
  );
}
