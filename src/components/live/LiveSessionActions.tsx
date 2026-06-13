"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { startLiveSession, endLiveSession } from "@/actions";
import { Button } from "@/components/ui/button";

type LiveSessionActionsProps = {
  slug: string;
  status: "upcoming" | "live" | "ended";
  isHost: boolean;
  liveKitConfigured: boolean;
};

export function LiveSessionActions({ slug, status, isHost, liveKitConfigured }: LiveSessionActionsProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleStart() {
    startTransition(async () => {
      await startLiveSession(slug);
      router.refresh();
    });
  }

  function handleEnd() {
    startTransition(async () => {
      await endLiveSession(slug);
      router.refresh();
    });
  }

  if (status === "ended") {
    return <p className="text-sm text-muted-foreground">This session has ended.</p>;
  }

  if (!liveKitConfigured) {
    return (
      <p className="rounded-xl bg-muted px-4 py-3 text-sm text-muted-foreground">
        Add LiveKit credentials to enable in-platform video. See <code className="text-xs">.env.example</code>.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {status === "live" && (
        <Link
          href={`/live/${slug}/room`}
          className="inline-flex h-11 items-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground hover:brightness-110"
        >
          Join call
        </Link>
      )}
      {status === "upcoming" && isHost && (
        <Button type="button" variant="accent" onClick={handleStart} disabled={pending}>
          {pending ? "Starting..." : "Go live now"}
        </Button>
      )}
      {status === "upcoming" && !isHost && (
        <p className="text-sm text-muted-foreground">Waiting for the host to start the call.</p>
      )}
      {status === "live" && isHost && (
        <Button type="button" variant="outline" onClick={handleEnd} disabled={pending}>
          {pending ? "Ending..." : "End session"}
        </Button>
      )}
    </div>
  );
}
