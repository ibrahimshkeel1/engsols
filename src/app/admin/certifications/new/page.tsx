import { createCertification } from "@/actions/content";
import { disciplines } from "@/data/disciplines";
import { Card, CardContent } from "@/components/ui/card";
import { FormField } from "@/components/ui/FormField";
import { Input, Select, Textarea } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/SubmitButton";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function AdminNewCertificationPage({ searchParams }: Props) {
  const { error } = await searchParams;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold">Add certification</h1>
      <p className="mt-1 text-muted-foreground">Create a certification guide for the library.</p>
      {error && (
        <p className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}
      <Card className="card-elevated mt-8">
        <CardContent className="p-6">
          <form action={createCertification} className="space-y-5">
            <FormField label="Full name" id="cert-name">
              <Input name="name" required placeholder="Professional Engineer (PE)" />
            </FormField>
            <FormField label="Short name" id="cert-short-name">
              <Input name="shortName" required placeholder="PE" />
            </FormField>
            <FormField label="Discipline" id="cert-discipline">
              <Select name="discipline" required className="w-full">
                {disciplines.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </Select>
            </FormField>
            <FormField label="Description" id="cert-description">
              <Textarea name="description" required rows={4} placeholder="Overview of the certification..." />
            </FormField>
            <FormField label="Eligibility" id="cert-eligibility">
              <Textarea name="eligibility" required rows={3} placeholder="Who can apply?" />
            </FormField>
            <FormField label="Exam format" id="cert-exam-format">
              <Input name="examFormat" required placeholder="Computer-based, 8 hours" />
            </FormField>
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Avg prep (months)" id="cert-prep-months">
                <Input name="avgPrepMonths" type="number" min={1} defaultValue={6} required />
              </FormField>
              <FormField label="Pass rate" id="cert-pass-rate" hint="Optional, e.g. 65%">
                <Input name="passRate" placeholder="65%" />
              </FormField>
            </div>
            <FormField label="Related mentor slugs" id="cert-mentor-slugs" hint="Comma-separated mentor profile slugs">
              <Input name="mentorSlugs" placeholder="jane-doe-abc123, john-smith-def456" />
            </FormField>
            <SubmitButton variant="accent" pendingLabel="Creating...">
              Create certification
            </SubmitButton>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
