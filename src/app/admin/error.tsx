"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { logger } from "@/lib/logger";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("admin-error", error.message, { digest: error.digest });
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="font-display text-3xl tracking-tight">Admin panel error</h1>
      <p className="mt-3 text-muted-foreground">An error occurred loading this admin page.</p>
      <div className="mt-8 flex gap-3">
        <Button type="button" variant="accent" onClick={reset}>
          Try again
        </Button>
        <Link href="/admin" className="inline-flex h-10 items-center rounded-xl border border-border px-5 text-sm font-semibold">
          Admin home
        </Link>
      </div>
    </div>
  );
}
