"use client";

import { BadgeCheck } from "lucide-react";
import type { ProjectEndorsement } from "@/types";
import { cn } from "@/lib/utils";

type Props = {
  endorsements: ProjectEndorsement[];
  className?: string;
  size?: "sm" | "md";
};

export function EndorsementBadge({ endorsements, className, size = "sm" }: Props) {
  if (!endorsements.length) return null;

  const primary = endorsements[0];
  const label =
    endorsements.length === 1
      ? `Endorsed by ${primary.mentorName}`
      : `${endorsements.length} mentor endorsements`;

  return (
    <span className={cn("group relative inline-flex", className)}>
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full border border-zone-mentorship-border bg-zone-mentorship/10 font-semibold text-zone-mentorship-on",
          size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
        )}
      >
        <BadgeCheck className={cn(size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5")} aria-hidden />
        Mentor endorsed
      </span>

      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-0 z-20 mb-2 hidden w-64 rounded-xl border border-border bg-card p-3 text-left text-xs shadow-lg group-hover:block group-focus-within:block"
      >
        <p className="font-semibold text-foreground">{label}</p>
        {endorsements.map((e) => (
          <div key={e.id} className="mt-2 border-t border-border/60 pt-2 first:mt-0 first:border-0 first:pt-0">
            <p className="font-medium">{e.mentorName}</p>
            <p className="text-muted-foreground">
              {e.mentorHeadline}
              {e.mentorCompany ? ` · ${e.mentorCompany}` : ""}
            </p>
            {e.endorsementText && (
              <p className="mt-1 italic text-muted-foreground">&ldquo;{e.endorsementText}&rdquo;</p>
            )}
          </div>
        ))}
      </span>
    </span>
  );
}
