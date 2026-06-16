import { submitMentorApplication } from "@/actions";
import { disciplines } from "@/data/disciplines";
import { requireUser } from "@/lib/require-auth";
import { safeDecodeURIComponent } from "@/lib/utils/safe-decode";
import { ProfilePhotoUpload } from "@/components/profile/ProfilePhotoUpload";
import { GoalsChecklist } from "@/components/mentors/GoalsChecklist";
import { FormField } from "@/components/ui/FormField";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Input, Textarea, Select } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function ApplyPage({ searchParams }: Props) {
  const params = await searchParams;
  const user = await requireUser("/apply");

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl tracking-tight">Become a mentor</h1>
      <p className="mt-2 text-muted-foreground">
        Share your engineering expertise with the next generation. Applications are reviewed by our team.
      </p>
      {params.error && (
        <p className="mt-4 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-600">
          {safeDecodeURIComponent(params.error)}
        </p>
      )}
      <Card className="card-elevated mt-8">
        <CardContent className="p-6">
          <ProfilePhotoUpload name={user.full_name || "Mentor"} initialUrl={user.avatar_url} />
          <form action={submitMentorApplication} className="mt-8 space-y-5">
            <FormField label="Professional headline" id="apply-headline">
              <Input name="headline" required placeholder="Senior Drilling Engineer at Shell" />
            </FormField>
            <FormField label="Company" id="apply-company">
              <Input name="company" required placeholder="Current employer" />
            </FormField>
            <FormField label="Discipline" id="apply-discipline">
              <Select name="discipline" required className="w-full">
                <option value="">Select discipline</option>
                {disciplines.map((d) => <option key={d} value={d}>{d}</option>)}
              </Select>
            </FormField>
            <FormField label="Years of experience" id="apply-years">
              <Input name="yearsExperience" required type="number" min={1} placeholder="10" />
            </FormField>
            <FormField label="Monthly rate (USD)" id="apply-rate">
              <Input name="monthlyRate" required type="number" min={50} placeholder="150" />
            </FormField>
            <FormField label="Skills (comma-separated)" id="apply-skills">
              <Input name="skills" placeholder="Directional drilling, well planning, IWCF" />
            </FormField>
            <GoalsChecklist />
            <FormField label="Bio" id="apply-bio">
              <Textarea name="bio" required rows={5} placeholder="Tell us about your background and what you can help mentees with..." />
            </FormField>
            <SubmitButton variant="accent" className="w-full" pendingLabel="Submitting...">
              Submit application
            </SubmitButton>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
