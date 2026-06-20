import Link from "next/link";
import { requireUser } from "@/lib/require-auth";
import { getCurrentUser } from "@/lib/auth";
import { getSellersForListing } from "@/lib/data/marketplace";
import { MarketplaceSellForm } from "@/components/marketplace/MarketplaceSellForm";
import { Card, CardContent } from "@/components/ui/card";
import { safeDecodeURIComponent } from "@/lib/utils/safe-decode";

type Props = { searchParams: Promise<{ error?: string; message?: string }> };

export default async function SellListingPage({ searchParams }: Props) {
  await requireUser("/marketplace/sell");
  const params = await searchParams;
  const user = await getCurrentUser();
  const sellers = user ? await getSellersForListing(user.id) : [];

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl tracking-tight">List on marketplace</h1>
      <p className="mt-2 text-muted-foreground">Sell equipment, materials, or services to engineers worldwide.</p>
      {params.error && (
        <p className="mt-4 rounded-xl bg-zone-news/10 px-4 py-3 text-sm text-zone-news-on">{safeDecodeURIComponent(params.error)}</p>
      )}
      {params.message && (
        <p className="mt-4 rounded-xl bg-zone-mentorship/10 px-4 py-3 text-sm text-zone-mentorship-on">{safeDecodeURIComponent(params.message)}</p>
      )}
      {sellers.length === 0 ? (
        <div className="mt-6 space-y-3">
          <p className="text-muted-foreground">
            Register as a seller first, then submit listings once your profile is approved.
          </p>
          <Link
            href="/marketplace/seller/new"
            className="inline-flex h-11 items-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground hover:brightness-110"
          >
            Become a seller
          </Link>
        </div>
      ) : (
        <Card className="card-elevated mt-8">
          <CardContent className="p-6">
            <p className="mb-4 text-sm text-muted-foreground">
              Manage inquiries on your{" "}
              <Link href="/marketplace/seller" className="text-primary hover:underline">seller dashboard</Link>.
              {" "}Need another business?{" "}
              <Link href="/marketplace/seller/new" className="text-primary hover:underline">Register a seller profile</Link>
            </p>
            <MarketplaceSellForm sellers={sellers} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
