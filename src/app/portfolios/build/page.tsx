import { savePortfolio, skipPortfolioOnboarding } from "@/actions";
import { disciplines } from "@/data/disciplines";
import { requireUser } from "@/lib/require-auth";
import { getPortfolioByUserId } from "@/lib/data/portfolios";
import { safeDecodeURIComponent } from "@/lib/utils/safe-decode";
import { ProfilePhotoUpload } from "@/components/profile/ProfilePhotoUpload";
import { PortfolioProjectsBuilder } from "@/components/portfolios/PortfolioProjectsBuilder";
import { PortfolioExperienceBuilder } from "@/components/portfolios/PortfolioExperienceBuilder";
import { StepIndicator } from "@/components/shared/StepIndicator";
import { FormField } from "@/components/ui/FormField";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Input, Textarea, Select } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const STEPS = [{ label: "Your goal" }, { label: "Mentor matches" }, { label: "Portfolio" }];

type Props = { searchParams: Promise<{ error?: string }> };

export default async function BuildPortfolioPage({ searchParams }: Props) {
  const params = await searchParams;
  const user = await requireUser("/portfolios/build");
  const existing = await getPortfolioByUserId(user.id);

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <StepIndicator steps={STEPS} current={3} progressPercent={100} />
      <h1 className="mt-6 font-display text-3xl tracking-tight">Build your portfolio</h1>
      <p className="mt-2 text-muted-foreground">Optional but powerful — get discovered by mentors and employers.</p>
      {params.error && (
        <p className="mt-4 rounded-xl bg-zone-news/10 px-4 py-3 text-sm text-zone-news-on">
          {safeDecodeURIComponent(params.error)}
        </p>
      )}
      <Card className="card-elevated mt-8">
        <CardContent className="p-6">
          <ProfilePhotoUpload name={user.full_name || "Student"} initialUrl={user.avatar_url} />
          <form action={savePortfolio} className="mt-8 space-y-5">
            <FormField label="Headline" id="portfolio-headline">
              <Input name="headline" required defaultValue={existing?.headline ?? ""} placeholder="e.g. Petroleum Engineering Graduate" />
            </FormField>
            <FormField label="University" id="portfolio-university">
              <Input name="university" required defaultValue={existing?.university ?? ""} />
            </FormField>
            <FormField label="Discipline" id="portfolio-discipline">
              <Select name="discipline" required className="w-full" defaultValue={existing?.discipline ?? ""}>
                <option value="">Select discipline</option>
                {disciplines.map((d) => <option key={d} value={d}>{d}</option>)}
              </Select>
            </FormField>
            <FormField label="Bio" id="portfolio-bio">
              <Textarea name="bio" required rows={4} defaultValue={existing?.bio ?? ""} />
            </FormField>
            <FormField label="Skills (comma-separated)" id="portfolio-skills">
              <Input name="skills" defaultValue={(existing?.skills ?? []).join(", ")} placeholder="Eclipse, Python, Reservoir Simulation" />
            </FormField>
            <input type="hidden" name="publish" value="true" />
            <SubmitButton variant="accent" className="w-full" pendingLabel="Publishing...">
              Publish portfolio
            </SubmitButton>
          </form>
          <form action={skipPortfolioOnboarding} className="mt-3">
            <button
              type="submit"
              className="w-full rounded-xl border border-border py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted"
            >
              Skip for now
            </button>
          </form>
          <PortfolioProjectsBuilder projects={existing?.portfolio_projects ?? []} />
          <PortfolioExperienceBuilder experience={existing?.portfolio_experience ?? []} />
        </CardContent>
      </Card>
    </div>
  );
}
