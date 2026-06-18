"use client";

import Link from "next/link";
import { Bell } from "lucide-react";

type Props = {
  initialCount?: number;
};

export function NotificationBell({ initialCount = 0 }: Props) {
  return (
    <Link
      href="/notifications"
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-muted hover:text-foreground"
      aria-label="Notifications"
    >
      <Bell className="h-4 w-4" />
      {initialCount > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
          {initialCount > 9 ? "9+" : initialCount}
        </span>
      )}
    </Link>
  );
}
