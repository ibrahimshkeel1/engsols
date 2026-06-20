import { createLiveSession } from "@/actions";
import { disciplines } from "@/data/disciplines";
import { FormField } from "@/components/ui/FormField";
import { SubmitButton } from "@/components/ui/SubmitButton";
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
            <FormField label="Title" id="live-title">
              <Input name="title" required placeholder="e.g. Reservoir simulation Q&A" />
            </FormField>
            <FormField label="Discipline" id="live-discipline">
              <Select name="discipline" required className="w-full">
                <option value="">Select discipline</option>
                {disciplines.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </Select>
            </FormField>
            <FormField
              label="Scheduled date & time"
              id="live-scheduled"
              hint="Leave empty to save as draft, or use Go live now below."
            >
              <Input name="scheduledAt" type="datetime-local" />
            </FormField>
            <FormField label="Description" id="live-description">
              <Textarea name="description" required rows={5} placeholder="What will you cover?" />
            </FormField>
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3">
              <input
                type="checkbox"
                name="requireJoinApproval"
                value="true"
                className="mt-1 h-4 w-4 rounded border-border accent-zone-live"
              />
              <span>
                <span className="block text-sm font-medium">Require approval to join</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  Guests request access and you approve them from the join requests panel in the call.
                </span>
              </span>
            </label>
            <div className="flex flex-wrap gap-3">
              <SubmitButton variant="accent" pendingLabel="Scheduling...">Schedule session</SubmitButton>
              <SubmitButton name="startNow" value="true" variant="outline" pendingLabel="Starting...">
                Go live now
              </SubmitButton>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
