"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRoomContext } from "@livekit/components-react";
import { RoomEvent } from "livekit-client";
import type { WorkspaceTab } from "@/types/live-workspace";
import { LiveKitRoomProvider, LiveKitVideoPane } from "@/components/live/LiveKitSession";
import { WorkspaceSwitcher } from "@/components/live/WorkspaceSwitcher";
import { WhiteboardWorkspace } from "@/components/live/WhiteboardWorkspace";
import { CadSandboxWorkspace } from "@/components/live/CadSandboxWorkspace";
import { SyncStatusIndicator } from "@/components/live/SyncStatusIndicator";
import { Button } from "@/components/ui/button";
import {
  bufferRoomStateSnapshot,
  disposeRoomStateHydrationRetry,
  requestRoomStateOnce,
  resetRoomStateHydration,
  respondToRoomStateRequest,
} from "@/lib/live-room-state";
import { decodeLiveSyncPacket } from "@/lib/livekit-sync";
import { cn } from "@/lib/utils";

type Props = {
  slug: string;
  title: string;
  serverUrl: string;
  token: string;
  isHost: boolean;
  onEndCall?: () => void;
  ending?: boolean;
};

function CollaborationWorkspaceInner({
  slug,
  title,
  isHost,
  onEndCall,
  ending,
}: Omit<Props, "serverUrl" | "token">) {
  const room = useRoomContext();
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("video_only");
  const isSplit = activeTab === "whiteboard" || activeTab === "3D_review";
  const remoteCount = room?.remoteParticipants.size ?? 0;

  useEffect(() => {
    if (!room) return;
    requestRoomStateOnce(room);
  }, [room, remoteCount]);

  useEffect(() => {
    if (!room) return;

    const onData = (payload: Uint8Array, participant?: { identity: string }) => {
      if (participant?.identity === room.localParticipant.identity) return;
      const packet = decodeLiveSyncPacket(payload);
      if (!packet) return;

      if (packet.type === "REQUEST_ROOM_STATE") {
        respondToRoomStateRequest(room, isHost);
        return;
      }

      if (packet.type === "RECEIVE_ROOM_STATE") {
        bufferRoomStateSnapshot(packet.state);
      }
    };

    const onConnected = () => requestRoomStateOnce(room);

    const onReconnected = () => {
      resetRoomStateHydration(room);
      requestRoomStateOnce(room);
    };

    const onDisconnected = () => disposeRoomStateHydrationRetry(room);

    room.on(RoomEvent.DataReceived, onData);
    room.on(RoomEvent.Connected, onConnected);
    room.on(RoomEvent.Reconnected, onReconnected);
    room.on(RoomEvent.Disconnected, onDisconnected);
    return () => {
      room.off(RoomEvent.DataReceived, onData);
      room.off(RoomEvent.Connected, onConnected);
      room.off(RoomEvent.Reconnected, onReconnected);
      room.off(RoomEvent.Disconnected, onDisconnected);
      disposeRoomStateHydrationRetry(room);
    };
  }, [room, isHost]);

  return (
    <div className="flex h-[calc(100vh-80px)] min-h-0 flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-red-600 dark:text-red-400">Live now</p>
          <h1 className="font-display text-xl tracking-tight sm:text-2xl">{title}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SyncStatusIndicator room={room} />
          <WorkspaceSwitcher activeTab={activeTab} onTabChange={setActiveTab} />
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

      <div
        className={cn(
          "grid min-h-0 flex-1 grid-cols-1 gap-3",
          isSplit && "h-[calc(100vh-80px)] lg:grid-cols-12 lg:gap-4",
        )}
      >
        <div
          className={cn(
            "live-video-shell live-kit-room min-h-0 overflow-hidden rounded-2xl border border-border",
            isSplit ? "h-[280px] lg:col-span-5 lg:h-full lg:max-h-none" : "h-full max-h-none flex-1",
            isSplit && "live-video-shell--compact",
          )}
        >
          <LiveKitVideoPane />
        </div>

        {isSplit && (
          <div
            id={`workspace-panel-${activeTab}`}
            role="tabpanel"
            aria-labelledby={`workspace-tab-${activeTab}`}
            className="flex min-h-0 flex-col lg:col-span-7 lg:h-full"
          >
            <div className="mb-2 flex items-center justify-between gap-2 rounded-lg border border-border/50 bg-muted/40 px-3 py-2 text-xs text-muted-foreground backdrop-blur-sm">
              <span>
                {activeTab === "whiteboard"
                  ? "Collaborative whiteboard — synced live with all participants"
                  : "3D CAD sandbox — camera synced with all participants"}
              </span>
              <SyncStatusIndicator room={room} />
            </div>
            <div className="min-h-0 flex-1">
              {activeTab === "whiteboard" && <WhiteboardWorkspace room={room} isHost={isHost} />}
              {activeTab === "3D_review" && <CadSandboxWorkspace room={room} isHost={isHost} />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function CollaborationWorkspace(props: Props) {
  const { serverUrl, token, ...inner } = props;

  return (
    <LiveKitRoomProvider serverUrl={serverUrl} token={token}>
      <CollaborationWorkspaceInner {...inner} />
    </LiveKitRoomProvider>
  );
}
