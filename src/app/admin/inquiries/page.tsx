import Link from "next/link";
import { format } from "date-fns";
import { MessageSquare } from "lucide-react";
import { getMarketplaceInquiriesForAdmin } from "@/lib/data/admin-content";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/EmptyState";

export default async function AdminInquiriesPage() {
  const inquiries = await getMarketplaceInquiriesForAdmin();

  return (
    <div>
      <h1 className="text-2xl font-bold">Marketplace inquiries</h1>
      <p className="mt-1 text-muted-foreground">Buyer inquiries across all marketplace listings.</p>
      <div className="mt-8 space-y-4">
        {inquiries.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="No inquiries yet"
            description="Inquiries appear when buyers contact sellers through listing pages."
          />
        ) : (
          inquiries.map((inq) => (
            <Card key={inq.id} className="card-elevated">
              <CardContent className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h2 className="font-semibold">{inq.listing_title}</h2>
                    <p className="text-sm text-muted-foreground">
                      {inq.requester_name} ·{" "}
                      <a href={`mailto:${inq.requester_email}`} className="text-primary hover:underline">
                        {inq.requester_email}
                      </a>
                    </p>
                  </div>
                  <Badge className="capitalize">{inq.status}</Badge>
                </div>
                <p className="mt-3 text-sm">{inq.message}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {format(new Date(inq.created_at), "MMM d, yyyy h:mm a")}
                  {inq.seller_slug && ` · Seller: ${inq.seller_slug}`}
                </p>
                {inq.listing_slug && (
                  <Link href={`/marketplace/${inq.listing_slug}`} className="mt-2 inline-block text-sm text-primary hover:underline">
                    View listing →
                  </Link>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
