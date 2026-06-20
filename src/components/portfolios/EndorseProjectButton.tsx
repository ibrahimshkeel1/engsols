"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { BadgeCheck, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { endorseProject, removeEndorsement } from "@/actions/endorsement";
import type { ProjectEndorsement } from "@/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Props = {
  projectId: string;
  portfolioId: string;
  projectTitle: string;
  existingEndorsement?: ProjectEndorsement;
  className?: string;
};

export function EndorseProjectButton({
  projectId,
  portfolioId,
  projectTitle,
  existingEndorsement,
  className,
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState(existingEndorsement?.endorsementText ?? "");
  const [pending, startTransition] = useTransition();

  function handleEndorse() {
    startTransition(async () => {
      const result = await endorseProject(projectId, portfolioId, note);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Project endorsed — visible to recruiters");
      setOpen(false);
      router.refresh();
    });
  }

  function handleRemove() {
    startTransition(async () => {
      const result = await removeEndorsement(projectId);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Endorsement removed");
      setOpen(false);
      router.refresh();
    });
  }

  if (existingEndorsement) {
    return (
      <div className={cn("flex flex-wrap items-center gap-2", className)}>
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-zone-mentorship-border bg-zone-mentorship/10 px-2.5 py-1 text-xs font-medium text-zone-mentorship-on">
          <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
          You endorsed this project
        </span>
        <button
          type="button"
          onClick={handleRemove}
          disabled={pending}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-zone-news"
        >
          {pending ? <Loader2 className="h-3 w-3 animate-spin" /> : <X className="h-3 w-3" />}
          Revoke
        </button>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setOpen((v) => !v)}
        className="gap-1.5"
      >
        <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
        Endorse project
      </Button>

      {open && (
        <div className="absolute right-0 top-full z-20 mt-2 w-72 rounded-xl border border-border bg-card p-4 shadow-lg">
          <p className="text-sm font-medium">Endorse &ldquo;{projectTitle}&rdquo;</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Your verified backing appears on this project for recruiters.
          </p>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="Optional note — what stood out about this work?"
            className="mt-3 text-sm"
          />
          <div className="mt-3 flex justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)} disabled={pending}>
              Cancel
            </Button>
            <Button type="button" variant="accent" size="sm" onClick={handleEndorse} disabled={pending}>
              {pending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Saving…
                </>
              ) : (
                "Submit endorsement"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
