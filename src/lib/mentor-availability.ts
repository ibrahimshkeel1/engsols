import type { Mentor } from "@/types";

export function formatMentorAvailabilitySummary(mentor: Pick<Mentor, "respondsWithinHours" | "introSlotsThisWeek">): string | null {
  if (mentor.respondsWithinHours) {
    return `Typically responds within ${mentor.respondsWithinHours} hours`;
  }
  if (mentor.introSlotsThisWeek && mentor.introSlotsThisWeek > 0) {
    return "Intro calls available this week";
  }
  return null;
}
