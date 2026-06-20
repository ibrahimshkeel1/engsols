export default function MentorLoading() {
  return (
    <div className="px-1 py-2" aria-hidden>
      <div className="h-3 w-28 animate-pulse rounded bg-zone-mentorship/20" />
      <div className="mt-3 h-8 w-48 animate-pulse rounded-lg bg-muted" />
      <div className="mt-2 h-4 w-72 max-w-full animate-pulse rounded-lg bg-muted/70" />
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-zone-mentorship/15 bg-surface p-6 shadow-premium-card"
          >
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="mt-4 h-9 w-32 animate-pulse rounded bg-zone-mentorship/15" />
            <div className="mt-3 h-3 w-full animate-pulse rounded bg-muted/60" />
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-2xl border border-zone-mentorship/15 bg-surface p-6 shadow-premium-card">
        <div className="h-5 w-40 animate-pulse rounded bg-zone-mentorship/15" />
        <div className="mt-6 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-xl bg-muted/70" />
          ))}
        </div>
      </div>
    </div>
  );
}
