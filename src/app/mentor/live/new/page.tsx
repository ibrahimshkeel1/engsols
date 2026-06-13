import { createLiveSession } from "@/actions";
import { disciplines } from "@/data/disciplines";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function MentorNewLivePage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold">Schedule live session</h1>
      <p className="mt-1 text-muted-foreground">Host a Q&A, workshop, or industry walkthrough.</p>
      <Card className="card-elevated mt-8">
        <CardContent className="p-6">
          <form action={createLiveSession} className="space-y-5">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input name="title" required placeholder="e.g. Directional Drilling Q&A" className="mt-1.5" />
            </div>
            <div>
              <label className="text-sm font-medium">Discipline</label>
              <Select name="discipline" required className="mt-1.5 w-full">
                <option value="">Select discipline</option>
                {disciplines.map((d) => <option key={d} value={d}>{d}</option>)}
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Scheduled date & time</label>
              <Input name="scheduledAt" required type="datetime-local" className="mt-1.5" />
            </div>
            <div>
              <label className="text-sm font-medium">Stream URL (optional)</label>
              <Input name="streamUrl" type="url" placeholder="YouTube, Zoom, or Teams link" className="mt-1.5" />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea name="description" required rows={5} placeholder="What will you cover?" className="mt-1.5" />
            </div>
            <Button type="submit" variant="accent">Create session</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
