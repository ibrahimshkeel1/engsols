"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { updateMentorBookingStatus } from "@/actions/mentor";
import type { BookingRequest } from "@/lib/data/bookings";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyStateClient } from "@/components/shared/EmptyStateClient";

export function MentorBookingsList({ bookings }: { bookings: BookingRequest[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function setStatus(id: string, status: "pending" | "contacted" | "closed") {
    startTransition(async () => {
      await updateMentorBookingStatus(id, status);
      router.refresh();
    });
  }

  if (bookings.length === 0) {
    return (
      <EmptyStateClient
        icon={Calendar}
        title="No booking requests yet"
        description="They appear here when students reach out from your public profile."
        action={{ href: "/mentor/profile", label: "Update profile" }}
      />
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((b) => (
        <Card key={b.id} className="card-elevated">
          <CardContent className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium capitalize">{b.requestType.replace(/_/g, " ")}</span>
                <p className="mt-2 font-semibold">{b.requesterName}</p>
                <a href={`mailto:${b.requesterEmail}`} className="text-sm text-primary hover:underline">{b.requesterEmail}</a>
              </div>
              <p className="text-xs text-muted-foreground">{format(new Date(b.createdAt), "MMM d, yyyy h:mm a")}</p>
            </div>
            <p className="mt-3 text-sm">{b.message}</p>
            <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
              <span className="w-full text-xs font-medium uppercase text-muted-foreground">Status: {b.status}</span>
              <Button type="button" size="sm" variant="outline" disabled={pending || b.status === "contacted"} onClick={() => setStatus(b.id, "contacted")}>
                Mark contacted
              </Button>
              <Button type="button" size="sm" variant="outline" disabled={pending || b.status === "closed"} onClick={() => setStatus(b.id, "closed")}>
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
