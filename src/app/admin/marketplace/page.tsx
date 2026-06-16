import Link from "next/link";
import { format } from "date-fns";
import { ShoppingBag } from "lucide-react";
import { getListingsForAdmin } from "@/lib/data/admin-content";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/EmptyState";
import { ListingPublishButton } from "@/components/admin/ListingPublishButton";

export default async function AdminMarketplacePage() {
  const listings = await getListingsForAdmin();
  const pending = listings.filter((l) => !l.published).length;

  return (
    <div>
      <h1 className="text-2xl font-bold">Marketplace listings</h1>
      <p className="mt-1 text-muted-foreground">
        Review and publish seller listings.
        {pending > 0 && <span className="ml-1 font-medium text-primary">{pending} pending</span>}
      </p>
      <div className="mt-8 space-y-4">
        {listings.length === 0 ? (
          <EmptyState icon={ShoppingBag} title="No listings yet" description="Submitted listings appear here for review." />
        ) : (
          listings.map((l) => (
            <Card key={l.id} className="card-elevated">
              <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <h2 className="font-semibold">{l.title}</h2>
                    {!l.published && <Badge className="bg-primary/15 text-primary">Pending</Badge>}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {l.seller_slug} · ${l.price} · {format(new Date(l.created_at), "MMM d, yyyy")}
                  </p>
                </div>
                <div className="flex gap-3">
                  {l.published && (
                    <Link href={`/marketplace/${l.slug}`} className="text-sm font-medium text-primary hover:underline">
                      View →
                    </Link>
                  )}
                  <ListingPublishButton listingId={l.id} published={l.published} />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
