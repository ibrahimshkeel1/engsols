"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  VideoConference,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type LiveVideoRoomProps = {
  slug: string;
  title: string;
  isHost: boolean;
  onEndCall?: () => void;
  ending?: boolean;
};

export function LiveVideoRoom({ slug, title, isHost, onEndCall, ending }: LiveVideoRoomProps) {
  const [token, setToken] = useState<string | null>(null);
  const [serverUrl, setServerUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchToken() {
      try {
        const res = await fetch("/api/video/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Could not join room");
        if (!cancelled) {
          setToken(data.token);
          setServerUrl(data.serverUrl);
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Could not join room");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchToken();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-2xl bg-muted">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !token || !serverUrl) {
    return (
      <div className="rounded-2xl border border-border bg-muted/50 p-8 text-center">
        <p className="font-medium">{error ?? "Video unavailable"}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Ensure LiveKit env vars are set and you are logged in.
        </p>
        <Link href={`/live/${slug}`} className="mt-4 inline-block text-sm text-primary hover:underline">
          Back to session
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-red-600 dark:text-red-400">Live now</p>
          <h1 className="font-display text-xl tracking-tight sm:text-2xl">{title}</h1>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/live/${slug}`}
            className="inline-flex h-10 items-center rounded-xl border border-border px-4 text-sm font-medium hover:bg-muted"
          >
            Session info
          </Link>
          {isHost && onEndCall && (
            <Button type="button" variant="outline" onClick={onEndCall} disabled={ending}>
              {ending ? "Ending..." : "End call"}
            </Button>
          )}
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-border [&_.lk-video-conference]:min-h-[60vh]">
        <LiveKitRoom
          serverUrl={serverUrl}
          token={token}
          connect
          audio
          video
          data-lk-theme="default"
        >
          <VideoConference />
          <RoomAudioRenderer />
        </LiveKitRoom>
      </div>
    </div>
  );
}
