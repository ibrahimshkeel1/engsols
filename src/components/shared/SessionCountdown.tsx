"use client";

import { useSyncExternalStore } from "react";
import { formatCountdown } from "@/lib/format-countdown";

function subscribe(onStoreChange: () => void) {
  const id = setInterval(onStoreChange, 30_000);
  return () => clearInterval(id);
}

export function SessionCountdown({ scheduledAt, className }: { scheduledAt: string; className?: string }) {
  const label = useSyncExternalStore(
    subscribe,
    () => formatCountdown(scheduledAt),
    () => null,
  );

  if (!label) return null;

  return (
    <span className={className ?? "inline-flex rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"}>
      {label}
    </span>
  );
}
