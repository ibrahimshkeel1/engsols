"use client";

import { useCallback, useEffect, useState } from "react";
import { UserPlus, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getPendingJoinRequests, resolveJoinRequest } from "@/actions/live";
import type { LiveJoinRequestRow } from "@/actions/live";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const POLL_MS = 3000;

type Props = {
  slug: string;
  isHost: boolean;
  className?: string;
};

export function LiveJoinRequestsPanel({ slug, isHost, className }: Props) {
  const [open, setOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [requests, setRequests] = useState<LiveJoinRequestRow[]>([]);
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  const applyPayload = useCallback((payload: NonNullable<Awaited<ReturnType<typeof getPendingJoinRequests>>>) => {
    setSessionId(payload.sessionId);
    setRequests(payload.requests);
    if (payload.requests.length > 0) setOpen(true);
  }, []);

  const refresh = useCallback(async () => {
    if (!isHost) return;
    const payload = await getPendingJoinRequests(slug);
    if (!payload) return;
    applyPayload(payload);
  }, [applyPayload, isHost, slug]);

  useEffect(() => {
    if (!isHost) return;

    let cancelled = false;
    void getPendingJoinRequests(slug).then((payload) => {
      if (cancelled || !payload) return;
      applyPayload(payload);
    });

    const interval = window.setInterval(() => {
      void refresh();
    }, POLL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [applyPayload, isHost, refresh, slug]);

  useEffect(() => {
    if (!isHost || !sessionId) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`live-join-requests-${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "live_join_requests",
          filter: `session_id=eq.${sessionId}`,
        },
        () => {
          void refresh();
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [isHost, refresh, sessionId]);

  if (!isHost) return null;

  const pendingCount = requests.length;

  async function handleResolve(requestId: string, approved: boolean) {
    setResolvingId(requestId);
    try {
      await resolveJoinRequest(slug, requestId, approved);
      await refresh();
    } finally {
      setResolvingId(null);
    }
  }

  return (
    <>
      {pendingCount > 0 && !open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed right-4 top-20 z-[300] rounded-xl border border-zone-live/30 bg-zone-live px-4 py-2 text-sm font-semibold text-white shadow-lg"
        >
          {pendingCount} guest{pendingCount === 1 ? "" : "s"} waiting to join
        </button>
      )}

      <div className={cn("relative", className)}>
        <Button
          type="button"
          size="sm"
          variant={pendingCount > 0 ? "default" : "outline"}
          onClick={() => setOpen((value) => !value)}
          className="relative shrink-0"
        >
          <UserPlus className="mr-1.5 h-3.5 w-3.5" aria-hidden />
          <span className="hidden sm:inline">Join requests</span>
          <span className="sm:hidden">Requests</span>
          {pendingCount > 0 && (
            <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white/20 px-1 text-[10px] font-bold">
              {pendingCount}
            </span>
          )}
        </Button>
      </div>

      {open && (
        <div className="fixed inset-0 z-[290]" onClick={() => setOpen(false)}>
          <div
            className="fixed right-4 top-20 z-[301] w-[min(100vw-2rem,24rem)] rounded-xl border border-border bg-card p-4 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-label="Join requests"
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-foreground">Waiting to join</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Close join requests panel"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {requests.length === 0 ? (
              <p className="text-sm text-muted-foreground">No pending requests.</p>
            ) : (
              <ul className="max-h-72 space-y-2 overflow-y-auto">
                {requests.map((request) => (
                  <li
                    key={request.id}
                    className="flex items-center justify-between gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{request.displayName}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(request.requestedAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={resolvingId === request.id}
                        onClick={() => void handleResolve(request.id, false)}
                      >
                        Deny
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        disabled={resolvingId === request.id}
                        onClick={() => void handleResolve(request.id, true)}
                      >
                        Approve
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
}
