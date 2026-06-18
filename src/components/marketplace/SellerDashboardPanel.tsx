"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import type { SellerInquiry, SellerListing } from "@/lib/data/seller-dashboard";

type Props = {
  listings: SellerListing[];
  inquiries: SellerInquiry[];
  sellerName: string;
  sellerPublished: boolean;
};

export function SellerDashboardPanel({ listings, inquiries, sellerName, sellerPublished }: Props) {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-lg font-semibold">{sellerName}</h2>
        <Badge className={sellerPublished ? "bg-green-500/15 text-green-700 dark:text-green-400" : "bg-muted text-muted-foreground"}>
          {sellerPublished ? "Live" : "Pending approval"}
        </Badge>
      </div>

      <section>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Your listings</h3>
          <Link href="/marketplace/sell" className="text-sm text-primary hover:underline">Add listing →</Link>
        </div>
        {listings.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">No listings yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {listings.map((l) => (
              <li key={l.id} className="flex items-center justify-between rounded-xl border border-border p-4">
                <div>
                  <p className="font-medium">{l.title}</p>
                  <p className="text-sm text-muted-foreground">${l.price}</p>
                </div>
                <div className="text-right">
                  <Badge className={l.published ? "bg-green-500/15 text-green-700" : "bg-muted text-muted-foreground"}>
                    {l.published ? "Published" : "Pending"}
                  </Badge>
                  {l.published && (
                    <Link href={`/marketplace/${l.slug}`} className="mt-1 block text-xs text-primary hover:underline">View</Link>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3 className="font-semibold">Inquiries inbox</h3>
        {inquiries.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">Inquiries from buyers appear here.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {inquiries.map((inq) => (
              <li key={inq.id} className="rounded-xl border border-border p-4">
                <div className="flex flex-wrap justify-between gap-2">
                  <p className="font-medium">{inq.listingTitle}</p>
                  <span className="text-xs text-muted-foreground">{format(new Date(inq.createdAt), "MMM d, yyyy")}</span>
                </div>
                <p className="mt-1 text-sm">
                  <a href={`mailto:${inq.requesterEmail}`} className="text-primary hover:underline">{inq.requesterName}</a>
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{inq.message}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
