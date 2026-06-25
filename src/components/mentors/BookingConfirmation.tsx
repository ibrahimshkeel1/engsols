import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import type { Mentor } from "@/types";

type Props = {
  mentorName: string;
  requestType: string;
  mentor?: Pick<Mentor, "respondsWithinHours">;
  isGuest?: boolean;
};

function responseWindow(mentor?: Pick<Mentor, "respondsWithinHours">): string {
  if (mentor?.respondsWithinHours && mentor.respondsWithinHours <= 48) {
    return `${mentor.respondsWithinHours} hours`;
  }
  return "1–2 business days";
}

export function BookingConfirmation({ mentorName, requestType, mentor, isGuest }: Props) {
  const isIntro = requestType === "intro";
  const typeLabel = requestType.replace(/-/g, " ");

  return (
    <div className="rounded-xl border border-zone-mentorship/30 bg-zone-mentorship/5 p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-zone-mentorship" aria-hidden />
        <div>
          <p className="font-semibold text-foreground">Request sent to {mentorName}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Your {typeLabel} request is in their inbox. Here&apos;s what happens next:
          </p>
        </div>
      </div>

      <ol className="mt-5 space-y-3 border-t border-border/60 pt-5 text-sm text-muted-foreground">
        <li className="flex gap-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
            1
          </span>
          <span>
            <strong className="text-foreground">{mentorName}</strong> typically responds within{" "}
            <strong className="text-foreground">{responseWindow(mentor)}</strong>.
          </span>
        </li>
        <li className="flex gap-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
            2
          </span>
          <span>You&apos;ll receive a calendar link or reply by email to schedule your session.</span>
        </li>
        <li className="flex gap-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
            3
          </span>
          <span>
            {isIntro
              ? "Your intro call is a chance to meet with no long-term commitment."
              : "After your session, you can continue with monthly mentorship or book another one-off."}
          </span>
        </li>
      </ol>

      {isGuest ? (
        <p className="mt-4 text-xs text-muted-foreground">
          <Link href="/signup" className="font-medium text-zone-mentorship hover:underline">
            Create a free account
          </Link>{" "}
          to track this request and save mentors.
        </p>
      ) : (
        <p className="mt-4 text-xs text-muted-foreground">
          <Link href="/bookings" className="font-medium text-zone-mentorship hover:underline">
            View my bookings
          </Link>{" "}
          to track status.
        </p>
      )}
    </div>
  );
}
