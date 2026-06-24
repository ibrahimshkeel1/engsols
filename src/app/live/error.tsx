"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { logger } from "@/lib/logger";

export default function LiveError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("live-error", error.message, { digest: error.digest });
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="font-display text-3xl tracking-tight">Live session error</h1>
      <p className="mt-3 text-muted-foreground">Something went wrong with this live room. You can retry or return to live sessions.</p>
      <div className="mt-8 flex gap-3">
        <Button type="button" variant="accent" onClick={reset}>
          Try again
        </Button>
        <Link href="/live" className="inline-flex h-10 items-center rounded-xl border border-border px-5 text-sm font-semibold">
          All live sessions
        </Link>
      </div>
    </div>
  );
}
