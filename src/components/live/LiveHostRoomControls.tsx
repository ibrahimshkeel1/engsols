"use client";

import { LiveJoinApprovalToggle } from "@/components/live/LiveJoinApprovalToggle";
import { LiveJoinRequestsPanel } from "@/components/live/LiveJoinRequestsPanel";
import { cn } from "@/lib/utils";

type Props = {
  slug: string;
  isHost: boolean;
  requireJoinApproval: boolean;
  className?: string;
};

export function LiveHostRoomControls({
  slug,
  isHost,
  requireJoinApproval,
  className,
}: Props) {
  if (!isHost) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <LiveJoinApprovalToggle slug={slug} initialValue={requireJoinApproval} compact />
      <LiveJoinRequestsPanel slug={slug} isHost={isHost} />
    </div>
  );
}
