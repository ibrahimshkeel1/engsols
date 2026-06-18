"use client";

import { format } from "date-fns";
import type { BookingRequest } from "@/lib/data/bookings";

export function StudentBookingsSection({ bookings }: { bookings: BookingRequest[] }) {
  if (bookings.length === 0) {
    return (
      <p className="mt-2 text-sm text-muted-foreground">
        No booking requests yet. Book a mentor from their profile page.
      </p>
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
