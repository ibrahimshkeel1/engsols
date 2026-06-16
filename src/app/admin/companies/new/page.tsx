import { createCompanyListing } from "@/actions/content";
import { disciplines } from "@/data/disciplines";
import { Card, CardContent } from "@/components/ui/card";
import { FormField } from "@/components/ui/FormField";
import { Input, Select, Textarea } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/SubmitButton";

const companyTypes = [
  { value: "operator", label: "Operator" },
  { value: "service-company", label: "Service company" },
  { value: "manufacturer", label: "Manufacturer" },
  { value: "consultancy", label: "Consultancy" },
  { value: "epc", label: "EPC" },
] as const;

type Props = { searchParams: Promise<{ error?: string }> };

export default async function AdminNewCompanyPage({ searchParams }: Props) {
  const { error } = await searchParams;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold">Add company</h1>
      <p className="mt-1 text-muted-foreground">Create a new company profile for the directory.</p>
      {error && (
        <p className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}
      <Card className="card-elevated mt-8">
        <CardContent className="p-6">
          <form action={createCompanyListing} className="space-y-5">
            <FormField label="Company name" id="company-name">
              <Input name="name" required placeholder="Acme Engineering" />
            </FormField>
            <FormField label="Type" id="company-type">
              <Select name="type" required className="w-full">
                {companyTypes.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </Select>
            </FormField>
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Headquarters" id="company-hq">
                <Input name="headquarters" required placeholder="Houston, TX" />
              </FormField>
              <FormField label="Country" id="company-country">
                <Input name="country" required placeholder="United States" />
              </FormField>
            </div>
            <FormField label="Website" id="company-website">
              <Input name="website" type="url" required placeholder="https://example.com" />
            </FormField>
            <FormField label="Disciplines" id="company-disciplines" hint="Comma-separated list">
              <Input
                name="disciplines"
                required
                placeholder={disciplines.slice(0, 3).join(", ")}
                defaultValue={disciplines[0]}
              />
            </FormField>
            <FormField label="Description" id="company-description">
              <Textarea name="description" required rows={5} placeholder="What does this company do?" />
            </FormField>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="verified" value="true" className="rounded" />
              Mark as verified
            </label>
            <SubmitButton variant="accent" pendingLabel="Creating...">
              Create company
            </SubmitButton>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
