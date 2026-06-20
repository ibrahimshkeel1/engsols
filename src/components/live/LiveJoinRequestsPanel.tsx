"use client";

import { useCallback, useEffect, useState } from "react";
import { UserPlus, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getPendingJoinRequests, resolveJoinRequest } from "@/actions/live";
import type { LiveJoinRequestRow } from "@/actions/live";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

  const refresh = useCallback(async () => {
    if (!isHost) return;
    const payload = await getPendingJoinRequests(slug);
    if (!payload) return;
    setSessionId(payload.sessionId);
    setRequests(payload.requests);
    if (payload.requests.length > 0) setOpen(true);
  }, [isHost, slug]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

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
  }, [isHost, sessionId, refresh]);

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
    <div className={cn("relative", className)}>
      <Button
        type="button"
        size="sm"
        variant={pendingCount > 0 ? "default" : "outline"}
        onClick={() => setOpen((value) => !value)}
        className="relative shrink-0"
      >
        <UserPlus className="mr-1.5 h-3.5 w-3.5" aria-hidden />
        Join requests
        {pendingCount > 0 && (
          <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white/20 px-1 text-[10px] font-bold">
            {pendingCount}
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[min(100vw-2rem,22rem)] rounded-xl border border-border bg-card p-3 shadow-lg">
          <div className="mb-2 flex items-center justify-between gap-2">
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
            <ul className="max-h-64 space-y-2 overflow-y-auto">
              {requests.map((request) => (
                <li
                  key={request.id}
                  className="flex items-center justify-between gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{request.displayName}</p>
                    {request.email && (
                      <p className="truncate text-xs text-muted-foreground">{request.email}</p>
                    )}
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
      )}
    </div>
  );
}
