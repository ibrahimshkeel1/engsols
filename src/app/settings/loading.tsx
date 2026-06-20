export default function SettingsLoading() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6" aria-hidden>
      <div className="h-9 w-56 animate-pulse rounded-lg bg-muted" />
      <div className="mt-3 h-4 w-80 max-w-full animate-pulse rounded bg-muted/70" />

      <div className="mt-8 rounded-2xl border border-zone-recruiter/15 bg-surface p-6 shadow-premium-card">
        <div className="h-5 w-32 animate-pulse rounded bg-muted" />
        <div className="mt-6 h-24 animate-pulse rounded-xl bg-muted/60" />
        <div className="mt-8 border-t border-border pt-8">
          <div className="h-5 w-28 animate-pulse rounded bg-muted" />
          <div className="mt-4 rounded-xl border border-zone-recruiter/20 bg-zone-recruiter/5 p-4">
            <div className="h-4 w-40 animate-pulse rounded bg-zone-recruiter/20" />
            <div className="mt-4 h-10 w-full animate-pulse rounded-xl bg-zone-recruiter/15 sm:w-64" />
          </div>
          <div className="mt-4 rounded-xl border border-zone-exams/20 bg-zone-exams/5 p-4">
            <div className="h-4 w-32 animate-pulse rounded bg-zone-exams/20" />
            <div className="mt-3 h-3 w-full animate-pulse rounded bg-muted/50" />
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-zone-mentorship/15 bg-surface p-6 shadow-premium-card">
        <div className="h-5 w-44 animate-pulse rounded bg-zone-mentorship/20" />
        <div className="mt-6 space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-muted/60" />
          ))}
        </div>
      </div>
    </div>
  );
}
