"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import type { BookingRequest } from "@/lib/data/bookings";
import { EmptyStateClient } from "@/components/shared/EmptyStateClient";
import { mentorPromptChips } from "@/data/empty-state-prompts";

function statusHint(status: string): string {
  switch (status) {
    case "pending":
      return "Waiting for the mentor to respond — you'll get an email when they do.";
    case "contacted":
      return "The mentor has replied — check your email for next steps or a calendar link.";
    case "closed":
      return "This request is complete.";
    default:
      return "We'll email you when there's an update.";
  }
}

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
            <Link href={`/mentors/${b.mentorSlug}`} className="font-medium hover:text-zone-mentorship hover:underline">
              {b.mentorName}
            </Link>
            <span className="rounded-md bg-muted px-2 py-0.5 text-xs capitalize">{b.status}</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground capitalize">{b.requestType.replace(/-/g, " ")}</p>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{b.message}</p>
          <p className="mt-2 text-xs text-muted-foreground">{statusHint(b.status)}</p>
          <p className="mt-2 text-xs text-muted-foreground">{format(new Date(b.createdAt), "MMM d, yyyy")}</p>
        </li>
      ))}
    </ul>
  );
}
