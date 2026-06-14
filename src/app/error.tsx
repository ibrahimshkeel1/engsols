"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="font-display text-2xl tracking-tight">Something went wrong</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {error.message || "This page could not load. Try again or return home."}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button type="button" variant="accent" onClick={reset}>
          Try again
        </Button>
        <Link
          href="/"
          className="inline-flex h-11 items-center rounded-xl border border-border px-5 text-sm font-medium hover:bg-muted"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
