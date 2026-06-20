"use client";

import { useState, useTransition } from "react";
import { setLiveJoinApproval } from "@/actions/live";
import { cn } from "@/lib/utils";

type Props = {
  slug: string;
  initialValue: boolean;
  disabled?: boolean;
  className?: string;
};

export function LiveJoinApprovalToggle({
  slug,
  initialValue,
  disabled = false,
  className,
}: Props) {
  const [enabled, setEnabled] = useState(initialValue);
  const [pending, startTransition] = useTransition();

  function handleChange(next: boolean) {
    setEnabled(next);
    startTransition(async () => {
      const result = await setLiveJoinApproval(slug, next);
      if (!result.ok) setEnabled(!next);
    });
  }

  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-card px-4 py-3",
        (disabled || pending) && "opacity-70",
        className,
      )}
    >
      <input
        type="checkbox"
        className="mt-1 h-4 w-4 rounded border-border accent-zone-live"
        checked={enabled}
        disabled={disabled || pending}
        onChange={(event) => handleChange(event.target.checked)}
      />
      <span>
        <span className="block text-sm font-medium text-foreground">Require approval to join</span>
        <span className="mt-0.5 block text-xs text-muted-foreground">
          When on, you approve each guest from the join requests panel before they enter the call.
        </span>
      </span>
    </label>
  );
}
