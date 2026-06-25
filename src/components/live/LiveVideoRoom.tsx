"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { LiveRoomSkeleton } from "@/components/ui/DirectorySkeletons";

const CollaborationWorkspace = dynamic(
  () => import("@/components/live/CollaborationWorkspace").then((m) => m.CollaborationWorkspace),
  { loading: () => <LiveRoomSkeleton /> },
);

type LiveVideoRoomProps = {
  slug: string;
  title: string;
  isHost: boolean;
  requireJoinApproval?: boolean;
  onEndCall?: () => void;
  ending?: boolean;
};

async function requestRoomToken(slug: string) {
  const res = await fetch("/api/video/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slug }),
  });
  const data = await res.json();
  return { res, data };
}

export function LiveVideoRoom({
  slug,
  title,
  isHost,
  requireJoinApproval = false,
  onEndCall,
  ending,
}: LiveVideoRoomProps) {
  const [token, setToken] = useState<string | null>(null);
  const [serverUrl, setServerUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingApproval, setPendingApproval] = useState(false);

  const connect = useCallback(async () => {
    try {
      const { res, data } = await requestRoomToken(slug);
      if (res.status === 202 && data.status === "pending") {
        setPendingApproval(true);
        setError(null);
        return false;
      }
      if (!res.ok) throw new Error(data.error || "Could not join room");
      setToken(data.token);
      setServerUrl(data.serverUrl);
      setPendingApproval(false);
      setError(null);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not join room");
      setPendingApproval(false);
      return false;
    }
  }, [slug]);

  useEffect(() => {
    let cancelled = false;

    async function initialConnect() {
      await connect();
      if (!cancelled) setLoading(false);
    }

    void initialConnect();
    return () => {
      cancelled = true;
    };
  }, [connect]);

  useEffect(() => {
    if (!pendingApproval) return;

    const interval = window.setInterval(() => {
      void connect().then((joined) => {
        if (joined) setLoading(false);
      });
    }, 3000);

    return () => window.clearInterval(interval);
  }, [pendingApproval, connect]);

  if (loading) {
    return <LiveRoomSkeleton />;
  }

  if (pendingApproval) {
    return (
      <div className="rounded-2xl border border-zone-live/25 bg-zone-live/5 p-8 text-center">
        <p className="font-display text-xl text-text-main">Waiting for host approval</p>
        <p className="mt-2 text-sm text-muted-foreground">
          The host will see your join request and can let you into the call.
        </p>
        <p className="mt-4 text-xs text-muted-foreground">Checking again automatically…</p>
        <Link href={`/live/${slug}`} className="mt-6 inline-block text-sm text-primary hover:underline">
          Back to session
        </Link>
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
    <CollaborationWorkspace
      slug={slug}
      title={title}
      serverUrl={serverUrl}
      token={token}
      isHost={isHost}
      requireJoinApproval={requireJoinApproval}
      onEndCall={onEndCall}
      ending={ending}
    />
  );
}
