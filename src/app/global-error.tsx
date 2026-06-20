"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-bg-main p-6 font-sans text-text-main">
        <div className="text-center">
          <h1 className="text-2xl font-bold">EngSols encountered an error</h1>
          <p className="mt-2 text-muted-foreground">Please refresh the page or try again later.</p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
