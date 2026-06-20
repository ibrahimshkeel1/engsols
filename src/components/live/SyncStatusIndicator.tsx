"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import type { Room } from "livekit-client";
import { RoomEvent } from "livekit-client";
import {
  isHydrationFailedOrAlone,
  isRoomStateHydrated,
  isRoomStateHydrationResolved,
  subscribeRoomStateHydration,
} from "@/lib/live-room-state";
import { cn } from "@/lib/utils";

type SyncVisualState = "catching-up" | "synced" | "solo";

type Props = {
  room?: Room;
  className?: string;
};

function resolveSyncVisualState(room: Room | undefined): SyncVisualState {
  if (!room || room.state !== "connected") {
    return "catching-up";
  }

  if (room.remoteParticipants.size === 0) {
    return "solo";
  }

  if (!isRoomStateHydrationResolved()) {
    return "catching-up";
  }

  if (isHydrationFailedOrAlone() || !isRoomStateHydrated()) {
    return "solo";
  }

  return "synced";
}

export function SyncStatusIndicator({ room, className }: Props) {
  const [, refresh] = useState(0);

  useEffect(() => subscribeRoomStateHydration(() => refresh((n) => n + 1)), []);

  useEffect(() => {
    if (!room) return;

    const onRoomChange = () => refresh((n) => n + 1);
    room.on(RoomEvent.Connected, onRoomChange);
    room.on(RoomEvent.Disconnected, onRoomChange);
    room.on(RoomEvent.Reconnected, onRoomChange);
    room.on(RoomEvent.ParticipantConnected, onRoomChange);
    room.on(RoomEvent.ParticipantDisconnected, onRoomChange);

    return () => {
      room.off(RoomEvent.Connected, onRoomChange);
      room.off(RoomEvent.Disconnected, onRoomChange);
      room.off(RoomEvent.Reconnected, onRoomChange);
      room.off(RoomEvent.ParticipantConnected, onRoomChange);
      room.off(RoomEvent.ParticipantDisconnected, onRoomChange);
    };
  }, [room]);

  const visualState = resolveSyncVisualState(room);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium",
        visualState === "catching-up" && "border-premium/30 bg-premium/10 text-premium",
        visualState === "synced" && "border-accent/30 bg-accent/10 text-accent",
        visualState === "solo" && "border-border/60 bg-muted/50 text-text-muted",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      {visualState === "catching-up" && (
        <>
          <Loader2 className="h-3 w-3 shrink-0 animate-spin text-premium" aria-hidden />
          Catching up...
        </>
      )}
      {visualState === "synced" && (
        <>
          <span className="relative flex h-2 w-2 shrink-0" aria-hidden>
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/50 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          Synced
        </>
      )}
      {visualState === "solo" && (
        <>
          <span className="h-2 w-2 shrink-0 rounded-full bg-muted-foreground/50" aria-hidden />
          Solo Session
        </>
      )}
    </span>
  );
}
