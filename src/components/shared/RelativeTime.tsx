"use client";

import { useSyncExternalStore } from "react";
import { formatRelativeTime } from "@/lib/format-relative-time";

function subscribe() {
  return () => {};
}

export function RelativeTime({ date }: { date: string }) {
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  if (!mounted) return <span>…</span>;

  return <span>{formatRelativeTime(date)}</span>;
}
