import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <p className="section-label">404</p>
      <h1 className="font-display mt-2 text-3xl tracking-tight">Page not found</h1>
      <p className="mt-3 text-muted-foreground">
        This page doesn&apos;t exist or may have been moved.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="inline-flex h-11 items-center rounded-xl bg-accent px-6 text-sm font-semibold text-accent-foreground">
          Go home
        </Link>
        <Link href="/mentors" className="inline-flex h-11 items-center rounded-xl border border-border px-6 text-sm font-medium hover:bg-muted">
          Find mentors
        </Link>
      </div>
    </div>
  );
}
