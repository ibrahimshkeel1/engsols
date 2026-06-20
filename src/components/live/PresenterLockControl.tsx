"use client";

import { useEffect, useState } from "react";
import { Lock, Unlock } from "lucide-react";
import type { Room } from "livekit-client";
import {
  canLocalEdit,
  claimPresenterLock,
  getActivePresenterId,
  releasePresenterLock,
  subscribePresenterLock,
} from "@/lib/presenter-lock";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  room?: Room;
  className?: string;
};

export function PresenterLockControl({ room, className }: Props) {
  const [, refresh] = useState(0);

  useEffect(() => subscribePresenterLock(() => refresh((n) => n + 1)), []);

  if (!room || room.remoteParticipants.size === 0) return null;

  const localId = room.localParticipant.identity;
  const presenterId = getActivePresenterId();
  const isPresenter = presenterId === localId;
  const hasLock = Boolean(presenterId);
  const canEdit = canLocalEdit(room);

  async function handleToggle() {
    if (!room) return;
    if (isPresenter) {
      await releasePresenterLock(room);
      return;
    }
    await claimPresenterLock(room);
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {!canEdit && presenterId && (
        <span className="hidden text-xs text-muted-foreground sm:inline">
          Read-only · presenter active
        </span>
      )}
      <Button
        type="button"
        size="sm"
        variant={isPresenter ? "secondary" : "outline"}
        onClick={handleToggle}
        disabled={!isPresenter && hasLock}
        className="shrink-0"
      >
        {isPresenter ? (
          <>
            <Unlock className="mr-1.5 h-3.5 w-3.5" aria-hidden />
            Release control
          </>
        ) : (
          <>
            <Lock className="mr-1.5 h-3.5 w-3.5" aria-hidden />
            Claim control
          </>
        )}
      </Button>
    </div>
  );
}
