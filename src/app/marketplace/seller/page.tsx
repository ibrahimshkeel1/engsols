import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getSellerDashboard } from "@/lib/data/seller-dashboard";
import { SellerDashboardPanel } from "@/components/marketplace/SellerDashboardPanel";
import { Card, CardContent } from "@/components/ui/card";

export default async function SellerDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/marketplace/seller");

  const { sellers, listings, inquiries } = await getSellerDashboard(user.id);
  const primary = sellers[0];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl tracking-tight">Seller dashboard</h1>
      <p className="mt-2 text-muted-foreground">Manage your listings and respond to buyer inquiries.</p>

      {!primary ? (
        <Card className="card-elevated mt-8">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">You don&apos;t have a seller profile yet.</p>
            <Link
              href="/marketplace/seller/new"
              className="mt-4 inline-flex h-11 items-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground hover:brightness-110"
            >
              Become a seller
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card className="card-elevated mt-8">
          <CardContent className="p-6">
            <SellerDashboardPanel
              sellerName={primary.name}
              sellerPublished={primary.published}
              listings={listings}
              inquiries={inquiries}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
