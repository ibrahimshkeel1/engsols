import { savePortfolio } from "@/actions";
import { disciplines } from "@/data/disciplines";
import { getCurrentUser } from "@/lib/auth";
import { ProfilePhotoUpload } from "@/components/profile/ProfilePhotoUpload";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default async function BuildPortfolioPage() {
  const user = await getCurrentUser();

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold">Build your portfolio</h1>
      <p className="mt-2 text-muted-foreground">Get discovered by mentors and employers on EngSols.</p>
      <Card className="card-elevated mt-8">
        <CardContent className="p-6">
          <ProfilePhotoUpload
            name={user?.full_name || "Student"}
            initialUrl={user?.avatar_url}
          />
          <form action={savePortfolio} className="mt-8 space-y-5">
            <div>
              <label className="text-sm font-medium">Headline</label>
              <Input name="headline" required placeholder="e.g. Petroleum Engineering Graduate" className="mt-1.5" />
            </div>
            <div>
              <label className="text-sm font-medium">University</label>
              <Input name="university" required className="mt-1.5" />
            </div>
            <div>
              <label className="text-sm font-medium">Discipline</label>
              <Select name="discipline" required className="mt-1.5 w-full">
                <option value="">Select discipline</option>
                {disciplines.map((d) => <option key={d} value={d}>{d}</option>)}
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Bio</label>
              <Textarea name="bio" required rows={4} className="mt-1.5" />
            </div>
            <div>
              <label className="text-sm font-medium">Skills (comma-separated)</label>
              <Input name="skills" placeholder="Eclipse, Python, Reservoir Simulation" className="mt-1.5" />
            </div>
            <input type="hidden" name="publish" value="true" />
            <Button type="submit" variant="accent" className="w-full">Publish portfolio</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
