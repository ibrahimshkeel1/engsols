import { Clock, CalendarCheck } from "lucide-react";
import type { Mentor } from "@/types";

export function MentorAvailabilityBadges({ mentor }: { mentor: Mentor }) {
  const badges = [];

  if (mentor.respondsWithinHours) {
    badges.push(
      <span key="responds" className="inline-flex items-center gap-1 rounded-md bg-zone-mentorship/12 px-2 py-0.5 text-xs font-medium text-zone-mentorship">
        <Clock className="h-3 w-3" />
        Responds within {mentor.respondsWithinHours}h
      </span>,
    );
  }

  if (mentor.introSlotsThisWeek && mentor.introSlotsThisWeek > 0) {
    badges.push(
      <span key="slots" className="inline-flex items-center gap-1 rounded-md bg-zone-mentorship/10 px-2 py-0.5 text-xs font-medium text-zone-mentorship">
        <CalendarCheck className="h-3 w-3" />
        Intro calls this week
      </span>,
    );
  }

  if (!badges.length) return null;

  return <div className="flex flex-wrap gap-2">{badges}</div>;
}
