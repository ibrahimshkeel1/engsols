import Link from "next/link";
import { createMarketplaceListing } from "@/actions/content";
import { disciplines } from "@/data/disciplines";
import { requireUser } from "@/lib/require-auth";
import { getCurrentUser } from "@/lib/auth";
import { getSellersForListing } from "@/lib/data/marketplace";
import { FormField } from "@/components/ui/FormField";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Input, Textarea, Select } from "@/components/ui/input";
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
        <p className="mt-4 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-600">{safeDecodeURIComponent(params.error)}</p>
      )}
      {params.message && (
        <p className="mt-4 rounded-xl bg-green-500/10 px-4 py-3 text-sm text-green-700">{safeDecodeURIComponent(params.message)}</p>
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
              Need another business?{" "}
              <Link href="/marketplace/seller/new" className="text-primary hover:underline">Register a seller profile</Link>
            </p>
            <form action={createMarketplaceListing} className="space-y-5">
              <FormField label="Seller account" id="sell-seller">
                <Select name="sellerSlug" required className="w-full">
                  {sellers.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
                </Select>
              </FormField>
              <FormField label="Category" id="sell-category">
                <Select name="category" required className="w-full">
                  <option value="equipment">Equipment</option>
                  <option value="materials">Materials</option>
                  <option value="services">Services</option>
                </Select>
              </FormField>
              <FormField label="Title" id="sell-title">
                <Input name="title" required />
              </FormField>
              <FormField label="Description" id="sell-desc">
                <Textarea name="description" required rows={5} />
              </FormField>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Price" id="sell-price">
                  <Input name="price" type="number" step="0.01" required />
                </FormField>
                <FormField label="Price unit" id="sell-unit">
                  <Input name="priceUnit" defaultValue="per unit" />
                </FormField>
              </div>
              <FormField label="Discipline" id="sell-discipline">
                <Select name="discipline" className="w-full">
                  {disciplines.map((d) => <option key={d} value={d}>{d}</option>)}
                </Select>
              </FormField>
              <FormField label="Condition" id="sell-condition">
                <Input name="condition" placeholder="e.g. New, Used" />
              </FormField>
              <FormField label="Location" id="sell-location">
                <Input name="location" />
              </FormField>
              <SubmitButton variant="accent" className="w-full" pendingLabel="Submitting...">
                Submit listing
              </SubmitButton>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
