"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { endLiveSession } from "@/actions";
import { LiveVideoRoom } from "./LiveVideoRoom";

type LiveRoomClientProps = {
  slug: string;
  title: string;
  canEndCall: boolean;
  requireJoinApproval?: boolean;
};

export function LiveRoomClient({
  slug,
  title,
  canEndCall,
  requireJoinApproval = false,
}: LiveRoomClientProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [ending, setEnding] = useState(false);

  function handleEndCall() {
    setEnding(true);
    startTransition(async () => {
      await endLiveSession(slug);
      router.push(`/live/${slug}`);
      router.refresh();
    });
  }

  return (
    <LiveVideoRoom
      slug={slug}
      title={title}
      isHost={canEndCall}
      requireJoinApproval={requireJoinApproval}
      onEndCall={canEndCall ? handleEndCall : undefined}
      ending={ending || pending}
    />
  );
}
