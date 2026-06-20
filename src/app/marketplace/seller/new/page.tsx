import { createSellerProfile } from "@/actions/seller";
import { requireUser } from "@/lib/require-auth";
import { FormField } from "@/components/ui/FormField";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Input, Textarea, Select } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { safeDecodeURIComponent } from "@/lib/utils/safe-decode";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function SellerOnboardingPage({ searchParams }: Props) {
  await requireUser("/marketplace/seller/new");
  const params = await searchParams;

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl tracking-tight">Become a seller</h1>
      <p className="mt-2 text-muted-foreground">
        Register your business to list equipment, materials, or services. Profiles are reviewed before going live.
      </p>
      {params.error && (
        <p className="mt-4 rounded-xl bg-zone-news/10 px-4 py-3 text-sm text-zone-news-on">{safeDecodeURIComponent(params.error)}</p>
      )}
      <Card className="card-elevated mt-8">
        <CardContent className="p-6">
          <form action={createSellerProfile} className="space-y-5">
            <FormField label="Business name" id="seller-name">
              <Input name="name" required />
            </FormField>
            <FormField label="Type" id="seller-type">
              <Select name="type" className="w-full">
                <option value="manufacturer">Manufacturer</option>
                <option value="distributor">Distributor</option>
                <option value="service">Service provider</option>
              </Select>
            </FormField>
            <FormField label="Location" id="seller-location">
              <Input name="location" placeholder="City, region" />
            </FormField>
            <FormField label="Country" id="seller-country">
              <Input name="country" />
            </FormField>
            <FormField label="Description" id="seller-desc">
              <Textarea name="description" rows={4} placeholder="What you sell and your specialties" />
            </FormField>
            <SubmitButton variant="accent" className="w-full" pendingLabel="Submitting...">
              Submit seller profile
            </SubmitButton>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
