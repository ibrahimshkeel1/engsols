export function formatCountdown(scheduledAt: string, now = Date.now()): string | null {
  const target = new Date(scheduledAt).getTime();
  const diffMs = target - now;
  if (diffMs <= 0) return null;

  const diffMins = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffDays >= 1) return `Starts in ${diffDays}d ${Math.floor((diffMs % 86_400_000) / 3_600_000)}h`;
  if (diffHours >= 1) return `Starts in ${diffHours}h ${diffMins % 60}m`;
  if (diffMins >= 1) return `Starts in ${diffMins}m`;
  return "Starting soon";
}

export function buildGoogleCalendarUrl(opts: {
  title: string;
  description?: string;
  startAt: string;
  durationMinutes?: number;
}): string {
  const start = new Date(opts.startAt);
  const end = new Date(start.getTime() + (opts.durationMinutes ?? 60) * 60_000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: opts.title,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: opts.description ?? "",
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
