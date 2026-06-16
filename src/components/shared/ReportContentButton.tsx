"use client";

import { useState } from "react";
import { toast } from "sonner";
import { reportContent } from "@/actions/forum";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";

export function ReportContentButton({ contentType, contentId }: { contentType: string; contentId: string }) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const formData = new FormData(e.currentTarget);
    formData.set("contentType", contentType);
    formData.set("contentId", contentId);
    const result = await reportContent(formData);
    setPending(false);
    if (result?.error) toast.error(result.error);
    else {
      toast.success("Report submitted. Our team will review it.");
      setOpen(false);
    }
  }

  if (!open) {
    return (
      <Button type="button" size="sm" variant="ghost" className="text-xs text-muted-foreground" onClick={() => setOpen(true)}>
        Report
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 rounded-xl border border-border bg-muted/30 p-4">
      <Textarea name="reason" required rows={2} placeholder="Why are you reporting this?" />
      <div className="mt-2 flex gap-2">
        <Button type="submit" size="sm" variant="accent" disabled={pending}>Submit</Button>
        <Button type="button" size="sm" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
      </div>
    </form>
  );
}
