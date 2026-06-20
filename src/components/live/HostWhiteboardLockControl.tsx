"use client";

import { useEffect, useState } from "react";
import { Lock, Unlock } from "lucide-react";
import type { Room } from "livekit-client";
import {
  claimPresenterLock,
  getActivePresenterId,
  releasePresenterLock,
  subscribePresenterLock,
} from "@/lib/presenter-lock";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  room?: Room;
  isHost?: boolean;
  className?: string;
};

/** Host-only control: lock the whiteboard so only the host can draw. */
export function HostWhiteboardLockControl({ room, isHost = false, className }: Props) {
  const [, refresh] = useState(0);

  useEffect(() => subscribePresenterLock(() => refresh((n) => n + 1)), []);

  if (!isHost || !room || room.remoteParticipants.size === 0) return null;

  const localId = room.localParticipant.identity;
  const presenterId = getActivePresenterId();
  const isLocked = presenterId === localId;

  async function handleToggle() {
    if (!room) return;
    if (isLocked) {
      await releasePresenterLock(room);
      return;
    }
    await claimPresenterLock(room);
  }

  return (
    <Button
      type="button"
      size="sm"
      variant={isLocked ? "secondary" : "outline"}
      onClick={handleToggle}
      className={cn("shrink-0", className)}
    >
      {isLocked ? (
        <>
          <Unlock className="mr-1.5 h-3.5 w-3.5" aria-hidden />
          <span className="hidden sm:inline">Unlock board</span>
          <span className="sm:hidden">Unlock</span>
        </>
      ) : (
        <>
          <Lock className="mr-1.5 h-3.5 w-3.5" aria-hidden />
          <span className="hidden sm:inline">Lock board</span>
          <span className="sm:hidden">Lock</span>
        </>
      )}
    </Button>
  );
}
