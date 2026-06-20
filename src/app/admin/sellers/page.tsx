import { format } from "date-fns";
import { Store } from "lucide-react";
import { getSellersForAdmin } from "@/lib/data/admin-content";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/EmptyState";
import { SellerAdminActions } from "@/components/admin/SellerAdminActions";

export default async function AdminSellersPage() {
  const sellers = await getSellersForAdmin();
  const pending = sellers.filter((s) => !s.published).length;

  return (
    <div>
      <h1 className="text-2xl font-bold">Marketplace sellers</h1>
      <p className="mt-1 text-muted-foreground">
        Approve seller profiles before they can list publicly.
        {pending > 0 && <span className="ml-1 font-medium text-primary">{pending} pending</span>}
      </p>
      <div className="mt-8 space-y-4">
        {sellers.length === 0 ? (
          <EmptyState icon={Store} title="No sellers yet" description="Seller applications appear here after onboarding." />
        ) : (
          sellers.map((s) => (
            <Card key={s.id} className="card-elevated">
              <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <h2 className="text-lg font-semibold">{s.name}</h2>
                    {!s.published && <Badge className="bg-primary/15 text-primary">Pending</Badge>}
                    {s.verified && <Badge className="bg-zone-mentorship/15 text-zone-mentorship-on">Verified</Badge>}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{s.location} · {s.country} · {s.type}</p>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{s.description}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {format(new Date(s.created_at), "MMM d, yyyy")}
                  </p>
                </div>
                <SellerAdminActions sellerId={s.id} published={s.published} verified={s.verified} />
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
