import { submitMentorApplication } from "@/actions";
import { disciplines } from "@/data/disciplines";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function ApplyPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold">Become a mentor</h1>
      <p className="mt-2 text-muted-foreground">
        Share your engineering expertise with the next generation. Applications are reviewed by our team.
      </p>
      <Card className="card-elevated mt-8">
        <CardContent className="p-6">
          <form action={submitMentorApplication} className="space-y-5">
            <div>
              <label className="text-sm font-medium">Professional headline</label>
              <Input name="headline" required placeholder="Senior Drilling Engineer at Shell" className="mt-1.5" />
            </div>
            <div>
              <label className="text-sm font-medium">Company</label>
              <Input name="company" required placeholder="Current employer" className="mt-1.5" />
            </div>
            <div>
              <label className="text-sm font-medium">Discipline</label>
              <Select name="discipline" required className="mt-1.5 w-full">
                <option value="">Select discipline</option>
                {disciplines.map((d) => <option key={d} value={d}>{d}</option>)}
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Years of experience</label>
              <Input name="yearsExperience" required type="number" min={1} placeholder="10" className="mt-1.5" />
            </div>
            <div>
              <label className="text-sm font-medium">Monthly rate (USD)</label>
              <Input name="monthlyRate" required type="number" min={50} placeholder="150" className="mt-1.5" />
            </div>
            <div>
              <label className="text-sm font-medium">Skills (comma-separated)</label>
              <Input name="skills" placeholder="Directional drilling, well planning, IWCF" className="mt-1.5" />
            </div>
            <div>
              <label className="text-sm font-medium">Bio</label>
              <Textarea name="bio" required rows={5} placeholder="Tell us about your background and what you can help mentees with..." className="mt-1.5" />
            </div>
            <Button type="submit" variant="accent" className="w-full">Submit application</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
