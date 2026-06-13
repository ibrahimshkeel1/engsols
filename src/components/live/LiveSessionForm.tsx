import { createLiveSession } from "@/actions";
import { disciplines } from "@/data/disciplines";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

type LiveSessionFormProps = {
  title?: string;
  next?: string;
  defaultCallType?: string;
};

export function LiveSessionForm({
  title = "Schedule live session",
  next = "/live/new",
  defaultCallType = "scheduled",
}: LiveSessionFormProps) {
  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl tracking-tight">{title}</h1>
      <p className="mt-2 text-muted-foreground">
        Host a Q&A, workshop, or study group — all on EngSols video.
      </p>
      <Card className="card-elevated mt-8">
        <CardContent className="p-6">
          <form action={createLiveSession} className="space-y-5">
            <input type="hidden" name="next" value={next} />
            <input type="hidden" name="callType" value={defaultCallType} />
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input name="title" required placeholder="e.g. Reservoir simulation Q&A" className="mt-1.5" />
            </div>
            <div>
              <label className="text-sm font-medium">Discipline</label>
              <Select name="discipline" required className="mt-1.5 w-full">
                <option value="">Select discipline</option>
                {disciplines.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Scheduled date & time</label>
              <Input name="scheduledAt" type="datetime-local" className="mt-1.5" />
              <p className="mt-1 text-xs text-muted-foreground">Leave empty to save as draft, or use Go live now below.</p>
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea name="description" required rows={5} placeholder="What will you cover?" className="mt-1.5" />
            </div>
            <div className="flex flex-wrap gap-3">
              <Button type="submit" variant="accent">Schedule session</Button>
              <Button type="submit" name="startNow" value="true" variant="outline">
                Go live now
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
