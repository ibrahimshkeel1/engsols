import { completeStudentOnboarding } from "@/actions";
import { disciplines } from "@/data/disciplines";
import { goals } from "@/data/goals";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function StudentOnboardingPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <p className="section-label">Step 1 of 2</p>
      <h1 className="font-display mt-2 text-3xl tracking-tight">Set up your profile</h1>
      <p className="mt-2 text-muted-foreground">Tell us about your goals so we can match you with the right mentors.</p>
      <Card className="card-elevated mt-8">
        <CardContent className="p-6">
          <form action={completeStudentOnboarding} className="space-y-5">
            <div>
              <label className="text-sm font-medium">Full name</label>
              <Input name="fullName" required className="mt-1.5" />
            </div>
            <div>
              <label className="text-sm font-medium">Headline</label>
              <Input name="headline" required placeholder="e.g. Petroleum Engineering Graduate" className="mt-1.5" />
            </div>
            <div>
              <label className="text-sm font-medium">University</label>
              <Input name="university" className="mt-1.5" />
            </div>
            <div>
              <label className="text-sm font-medium">Discipline</label>
              <Select name="discipline" required className="mt-1.5 w-full">
                <option value="">Select discipline</option>
                {disciplines.map((d) => <option key={d} value={d}>{d}</option>)}
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Primary goal</label>
              <Select name="goal" required className="mt-1.5 w-full">
                <option value="">What do you want to achieve?</option>
                {goals.map((g) => <option key={g.id} value={g.label}>{g.label}</option>)}
              </Select>
            </div>
            <Button type="submit" variant="accent" className="w-full">Continue to portfolio →</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
