"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Loader2, UserSearch, X } from "lucide-react";
import { toast } from "sonner";
import { submitSpecialistRequest } from "@/actions/mentor";
import type { MentorFilters } from "@/lib/filter-mentors";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";

export type SpecialistRequestContext = {
  discipline?: string;
  subField?: string;
  searchQuery?: string;
  filtersSnapshot?: MentorFilters;
  defaultName?: string;
  defaultEmail?: string;
};

type Props = {
  context?: SpecialistRequestContext;
  triggerLabel?: string;
  triggerClassName?: string;
  variant?: "button" | "link";
};

export function SpecialistRequestTrigger({
  context,
  triggerLabel = "Request a Specialist Mentor",
  triggerClassName,
  variant = "button",
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [open]);

  function closeDialog() {
    setOpen(false);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const skillsRaw = (form.get("skillsRequested") as string) || "";

    startTransition(async () => {
      const result = await submitSpecialistRequest({
        requesterName: form.get("requesterName") as string,
        requesterEmail: form.get("requesterEmail") as string,
        discipline: form.get("discipline") as string,
        subField: (form.get("subField") as string) || "",
        skillsRequested: skillsRaw
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        careerRequirements: form.get("careerRequirements") as string,
        searchQuery: context?.searchQuery ?? "",
        filtersSnapshot: context?.filtersSnapshot,
      });

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Request received! Our team will match you with a specialist mentor.");
      e.currentTarget.reset();
      closeDialog();
    });
  }

  return (
    <>
      {variant === "link" ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={triggerClassName ?? "font-medium text-primary underline-offset-4 hover:underline"}
        >
          {triggerLabel}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={
            triggerClassName ??
            "inline-flex h-10 items-center gap-2 rounded-xl bg-accent px-5 text-sm font-semibold text-accent-foreground hover:brightness-110"
          }
        >
          <UserSearch className="h-4 w-4" aria-hidden />
          {triggerLabel}
        </button>
      )}

      <dialog
        ref={dialogRef}
        onClose={closeDialog}
        className="fixed inset-0 z-50 m-auto w-[min(100%,28rem)] max-h-[90dvh] overflow-y-auto rounded-2xl border border-border bg-card p-0 shadow-2xl backdrop:bg-black/50 open:animate-in open:fade-in-0"
        aria-labelledby="specialist-request-title"
      >
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex items-start justify-between border-b border-border px-6 py-5">
            <div>
              <h2 id="specialist-request-title" className="font-display text-lg font-semibold tracking-tight">
                Request a Specialist Mentor
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Tell us your niche requirements and we&apos;ll work to match you with an expert.
              </p>
            </div>
            <button
              type="button"
              onClick={closeDialog}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4 px-6 py-5">
            <FormField label="Your name" id="specialist-name">
              <Input
                name="requesterName"
                required
                autoComplete="name"
                defaultValue={context?.defaultName ?? ""}
              />
            </FormField>
            <FormField label="Email" id="specialist-email">
              <Input
                name="requesterEmail"
                required
                type="email"
                autoComplete="email"
                defaultValue={context?.defaultEmail ?? ""}
              />
            </FormField>
            <FormField label="Target discipline" id="specialist-discipline">
              <Input
                name="discipline"
                required
                placeholder="e.g. Nuclear Engineering, Reservoir Engineering"
                defaultValue={context?.discipline ?? ""}
              />
            </FormField>
            <FormField label="Sub-field or niche (optional)" id="specialist-subfield">
              <Input
                name="subField"
                placeholder="e.g. Thermal hydraulics, Directional drilling"
                defaultValue={context?.subField ?? ""}
              />
            </FormField>
            <FormField label="Key skills needed (comma-separated, optional)" id="specialist-skills">
              <Input name="skillsRequested" placeholder="e.g. CFD, Well control, Thermodynamics" />
            </FormField>
            <FormField label="Career requirements" id="specialist-requirements">
              <Textarea
                name="careerRequirements"
                required
                rows={4}
                placeholder="Describe your goals, timeline, and what you need from a specialist mentor..."
              />
            </FormField>
          </div>

          <div className="flex justify-end gap-3 border-t border-border px-6 py-4">
            <Button type="button" variant="outline" onClick={closeDialog} disabled={pending}>
              Cancel
            </Button>
            <Button type="submit" variant="accent" disabled={pending}>
              {pending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Submitting...
                </>
              ) : (
                "Submit request"
              )}
            </Button>
          </div>
        </form>
      </dialog>
    </>
  );
}
