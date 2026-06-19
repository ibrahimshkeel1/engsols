import { CalendarPlus } from "lucide-react";
import { buildGoogleCalendarUrl } from "@/lib/format-countdown";

type Props = {
  title: string;
  description?: string;
  scheduledAt: string;
  durationMinutes?: number;
  className?: string;
};

export function AddToCalendarButton({ title, description, scheduledAt, durationMinutes, className }: Props) {
  const href = buildGoogleCalendarUrl({ title, description, startAt: scheduledAt, durationMinutes });

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={
        className ??
        "inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-medium hover:bg-muted"
      }
    >
      <CalendarPlus className="h-4 w-4" />
      Add to Google Calendar
    </a>
  );
}
