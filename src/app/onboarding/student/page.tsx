import { redirect } from "next/navigation";
import { saveStudentOnboardingStep1 } from "@/actions";
import { disciplines } from "@/data/disciplines";
import { goals } from "@/data/goals";
import { requireUser } from "@/lib/require-auth";
import { safeDecodeURIComponent } from "@/lib/utils/safe-decode";
import { ProfilePhotoUpload } from "@/components/profile/ProfilePhotoUpload";
import { StepIndicator } from "@/components/shared/StepIndicator";
import { FormField } from "@/components/ui/FormField";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Input, Select } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const STEPS = [{ label: "Your goal" }, { label: "Mentor matches" }, { label: "Portfolio" }];

type Props = { searchParams: Promise<{ error?: string }> };

export default async function StudentOnboardingPage({ searchParams }: Props) {
  const params = await searchParams;
  const user = await requireUser("/onboarding/student");

  if (user.role === "mentor") redirect("/onboarding/mentor");
  if (user.role === "admin") redirect("/admin");

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <StepIndicator steps={STEPS} current={1} progressPercent={33} />
      <h1 className="mt-6 font-display text-3xl tracking-tight">What are you working toward?</h1>
      <p className="mt-2 text-muted-foreground">
        Add a photo and tell us your goal — we&apos;ll match you with mentors who&apos;ve been there.
      </p>
      {params.error && (
        <p className="mt-4 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-600">
          {safeDecodeURIComponent(params.error)}
        </p>
      )}
      <Card className="card-elevated mt-8">
        <CardContent className="p-6">
          <ProfilePhotoUpload name={user.full_name || "Student"} initialUrl={user.avatar_url} />
          <form action={saveStudentOnboardingStep1} className="mt-8 space-y-5">
            <FormField label="Full name" id="onboard-name">
              <Input name="fullName" required defaultValue={user.full_name || ""} autoComplete="name" />
            </FormField>
            <FormField label="Discipline" id="onboard-discipline">
              <Select name="discipline" required className="w-full">
                <option value="">Select discipline</option>
                {disciplines.map((d) => <option key={d} value={d}>{d}</option>)}
              </Select>
            </FormField>
            <FormField label="Primary goal" id="onboard-goal">
              <Select name="goal" required className="w-full">
                <option value="">What do you want to achieve?</option>
                {goals.map((g) => <option key={g.id} value={g.label}>{g.label}</option>)}
              </Select>
            </FormField>
            <SubmitButton variant="accent" className="w-full" pendingLabel="Finding mentors...">
              See my mentor matches →
            </SubmitButton>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
