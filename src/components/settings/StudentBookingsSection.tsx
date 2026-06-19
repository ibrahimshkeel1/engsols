"use client";

import { format } from "date-fns";
import { Calendar } from "lucide-react";
import type { BookingRequest } from "@/lib/data/bookings";
import { EmptyStateClient } from "@/components/shared/EmptyStateClient";
import { mentorPromptChips } from "@/data/empty-state-prompts";

export function StudentBookingsSection({ bookings }: { bookings: BookingRequest[] }) {
  if (bookings.length === 0) {
    return (
      <EmptyStateClient
        icon={Calendar}
        title="No booking requests yet"
        description="Book a free intro with a mentor — your requests appear here."
        action={{ href: "/mentors", label: "Find a mentor" }}
        promptChips={mentorPromptChips.slice(0, 3)}
      />
    );
  }

  return (
    <ul className="mt-4 space-y-3">
      {bookings.map((b) => (
        <li key={b.id} className="rounded-xl border border-border p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-medium">{b.mentorName}</p>
            <span className="rounded-md bg-muted px-2 py-0.5 text-xs capitalize">{b.status}</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground capitalize">{b.requestType.replace(/-/g, " ")}</p>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{b.message}</p>
          <p className="mt-2 text-xs text-muted-foreground">{format(new Date(b.createdAt), "MMM d, yyyy")}</p>
        </li>
      ))}
    </ul>
  );
}
