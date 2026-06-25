"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Calendar, MessageSquare, Star } from "lucide-react";
import type { StudentBooking } from "@/lib/data/booking-messages";
import { EmptyStateClient } from "@/components/shared/EmptyStateClient";
import { mentorPromptChips } from "@/data/empty-state-prompts";
import { ButtonLink } from "@/components/ui/button";

function statusHint(status: string): string {
  switch (status) {
    case "pending":
      return "Waiting for the mentor to respond — you'll get an email when they do.";
    case "contacted":
      return "The mentor has replied — message them or check your email for next steps.";
    case "closed":
      return "This request is complete. Leave a review if you had a session.";
    default:
      return "We'll email you when there's an update.";
  }
}

type Props = {
  bookings: StudentBooking[];
  reviewedMentorSlugs: string[];
};

export function StudentBookingsSection({ bookings, reviewedMentorSlugs }: Props) {
  const reviewed = new Set(reviewedMentorSlugs);

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
      {bookings.map((b) => {
        const canReview =
          (b.status === "contacted" || b.status === "closed") &&
          !reviewed.has(b.mentorSlug) &&
          b.requestType !== "marketplace_inquiry";

        return (
          <li key={b.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Link
                href={`/mentors/${b.mentorSlug}`}
                className="font-medium text-oil-gas-navy hover:text-oil-gas-orange hover:underline"
              >
                {b.mentorName}
              </Link>
              <span className="rounded-md bg-oil-gas-ice px-2 py-0.5 text-xs capitalize text-oil-gas-navy-muted">
                {b.status}
              </span>
            </div>
            <p className="mt-1 text-xs capitalize text-oil-gas-navy-muted">
              {b.requestType.replace(/-/g, " ")}
            </p>
            <p className="mt-2 line-clamp-2 text-sm text-oil-gas-navy-muted">{b.message}</p>
            <p className="mt-2 text-xs text-oil-gas-navy-muted">{statusHint(b.status)}</p>
            <p className="mt-2 text-xs text-oil-gas-navy-muted/80">{format(new Date(b.createdAt), "MMM d, yyyy")}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {(b.status === "pending" || b.status === "contacted") && (
                <ButtonLink href={`/bookings/${b.id}`} size="sm" variant="secondary">
                  <MessageSquare className="me-1.5 h-3.5 w-3.5" />
                  Messages
                </ButtonLink>
              )}
              {canReview && (
                <ButtonLink
                  href={`/mentors/${b.mentorSlug}#leave-review`}
                  size="sm"
                  className="bg-oil-gas-orange hover:bg-oil-gas-orange-hover"
                >
                  <Star className="me-1.5 h-3.5 w-3.5" />
                  Leave a review
                </ButtonLink>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
