"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updateMentorExtrasByAdmin } from "@/actions/mentor";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  mentorId: string;
  respondsWithinHours?: number | null;
  introSlotsThisWeek?: number | null;
  introVideoUrl?: string | null;
};

export function AdminMentorExtrasForm({ mentorId, respondsWithinHours, introSlotsThisWeek, introVideoUrl }: Props) {
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const formData = new FormData(e.currentTarget);
    const result = await updateMentorExtrasByAdmin(formData);
    setPending(false);
    if (result?.error) toast.error(result.error);
    else toast.success("Mentor extras updated");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3 rounded-xl border border-border bg-muted/30 p-4">
      <input type="hidden" name="mentorId" value={mentorId} />
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Wave 4 profile fields</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <FormField label="Response time (hours)" id={`responds-${mentorId}`}>
          <Input name="respondsWithinHours" type="number" min={1} max={168} placeholder="48" defaultValue={respondsWithinHours ?? ""} />
        </FormField>
        <FormField label="Intro slots this week" id={`slots-${mentorId}`}>
          <Input name="introSlotsThisWeek" type="number" min={0} max={20} placeholder="3" defaultValue={introSlotsThisWeek ?? ""} />
        </FormField>
      </div>
      <FormField label="Intro video URL" id={`video-${mentorId}`}>
        <Input name="introVideoUrl" type="url" placeholder="https://youtube.com/..." defaultValue={introVideoUrl ?? ""} />
      </FormField>
      <Button type="submit" size="sm" variant="outline" disabled={pending}>
        {pending ? "Saving..." : "Save extras"}
      </Button>
    </form>
  );
}
