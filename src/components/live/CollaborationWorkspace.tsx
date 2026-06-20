"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRoomContext } from "@livekit/components-react";
import { RoomEvent } from "livekit-client";
import type { WorkspaceTab } from "@/types/live-workspace";
import { LiveKitRoomProvider } from "@/components/live/LiveKitSession";
import { LiveKitVideoStage, LiveRoomMediaChrome } from "@/components/live/LiveRoomMediaChrome";
import { LiveChatFloatingMessages } from "@/components/live/LiveChatFloatingMessages";
import { WorkspaceSwitcher } from "@/components/live/WorkspaceSwitcher";
import { WhiteboardWorkspace } from "@/components/live/WhiteboardWorkspace";
import { CadSandboxWorkspace } from "@/components/live/CadSandboxWorkspace";
import { SyncStatusIndicator } from "@/components/live/SyncStatusIndicator";
import { Button } from "@/components/ui/button";
import {
  appendWhiteboardElement,
  bufferRoomStateSnapshot,
  clearWhiteboardSegments,
  disposeRoomStateHydrationRetry,
  requestRoomStateOnce,
  resetRoomStateHydration,
  respondToRoomStateRequest,
} from "@/lib/live-room-state";
import {
  handleLockClaimPacket,
  handleLockReleasePacket,
  releasePresenterIfDisconnected,
} from "@/lib/presenter-lock";
import { decodeLiveSyncPacket, publishLiveSyncPacket } from "@/lib/livekit-sync";
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
    if (activeTab !== "whiteboard" || !room || room.state !== "connected") return;
    void publishLiveSyncPacket(room, { type: "REQUEST_ROOM_STATE" }, true);
  }, [activeTab, room]);

  useEffect(() => {
    if (!room) return;

    const onData = (payload: Uint8Array, participant?: { identity: string }) => {
      if (participant?.identity === room.localParticipant.identity) return;
      const packet = decodeLiveSyncPacket(payload);
      if (!packet) return;

      if (packet.type === "DRAW_STROKE" || packet.type === "DRAW_TEXT") {
        appendWhiteboardElement(packet);
        return;
      }

      if (packet.type === "CLEAR_CANVAS") {
        clearWhiteboardSegments();
        return;
      }

      if (packet.type === "REQUEST_ROOM_STATE") {
        respondToRoomStateRequest(room, isHost);
        return;
      }

      if (packet.type === "RECEIVE_ROOM_STATE") {
        bufferRoomStateSnapshot(packet.state);
        return;
      }

      if (packet.type === "LOCK_CLAIM") {
        handleLockClaimPacket(packet.identity);
        return;
      }

      if (packet.type === "LOCK_RELEASE") {
        handleLockReleasePacket(packet.identity);
      }
    };

    const onParticipantDisconnected = (participant: { identity: string }) => {
      releasePresenterIfDisconnected(participant.identity);
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
    room.on(RoomEvent.ParticipantDisconnected, onParticipantDisconnected);
    return () => {
      room.off(RoomEvent.DataReceived, onData);
      room.off(RoomEvent.Connected, onConnected);
      room.off(RoomEvent.Reconnected, onReconnected);
      room.off(RoomEvent.Disconnected, onDisconnected);
      room.off(RoomEvent.ParticipantDisconnected, onParticipantDisconnected);
      disposeRoomStateHydrationRetry(room);
    };
  }, [room, isHost]);

  return (
    <div className="flex h-[calc(100dvh-2rem)] min-h-0 flex-col gap-2 bg-bg-main sm:gap-3">
      <LiveRoomMediaChrome>
        <LiveChatFloatingMessages />
        <div className="live-workspace-chrome flex flex-wrap items-center justify-between gap-2 rounded-xl border border-zone-live/25 bg-zone-live/5 px-3 py-2 sm:gap-3 sm:px-4">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-zone-live sm:text-xs">
            <span className="live-dot me-1.5 inline-block h-1.5 w-1.5 rounded-full bg-zone-live align-middle" />
            Live now
          </p>
          <h1 className="truncate font-display text-lg tracking-tight text-text-main sm:text-2xl">{title}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SyncStatusIndicator room={room} className="hidden sm:inline-flex" />
          <WorkspaceSwitcher activeTab={activeTab} onTabChange={setActiveTab} />
          <Link href={`/live/${slug}`} className="btn-secondary hidden h-10 text-text-main sm:inline-flex">
            Session info
          </Link>
          {isHost && onEndCall && (
            <Button type="button" variant="secondary" onClick={onEndCall} disabled={ending} size="sm" className="sm:h-10">
              {ending ? "Ending..." : "End call"}
            </Button>
          )}
        </div>
      </div>

      <div
        className={cn(
          "grid min-h-0 flex-1 grid-cols-1 gap-2 sm:gap-3",
          isSplit && "lg:grid-cols-12 lg:gap-4",
        )}
      >
        {isSplit && (
          <div
            id={`workspace-panel-${activeTab}`}
            role="tabpanel"
            aria-labelledby={`workspace-tab-${activeTab}`}
            className="order-1 z-0 flex min-h-0 flex-1 flex-col lg:order-2 lg:col-span-7 lg:h-full"
          >
            <div className="mb-2 hidden items-center justify-between gap-2 rounded-lg border border-zone-live/20 bg-bg-surface px-3 py-2 text-xs text-text-muted backdrop-blur-sm sm:flex">
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

        <div
          data-lk-theme="default"
          className={cn(
            "live-video-shell live-kit-room live-video-shell--stage-only relative z-10 min-h-0 overflow-hidden rounded-2xl border border-zone-live/20 transition-all duration-200",
            isSplit
              ? "order-2 h-[100px] max-h-[24dvh] shrink-0 lg:order-1 lg:col-span-5 lg:h-full lg:max-h-none"
              : "h-full max-h-none flex-1",
            isSplit && "live-video-shell--compact",
          )}
        >
          <div className="live-video-conference-wrap h-full min-h-0">
            <LiveKitVideoStage />
          </div>
        </div>
      </div>
      </LiveRoomMediaChrome>
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
