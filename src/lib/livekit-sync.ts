import type { CadRenderMode, WhiteboardTool } from "@/types/live-workspace";
import type { Room } from "livekit-client";

export type DrawStrokePacket = {
  type: "DRAW_STROKE";
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  color: string;
  thickness: number;
  tool: WhiteboardTool;
};

export type ClearCanvasPacket = {
  type: "CLEAR_CANVAS";
};

export type CadTransformPacket = {
  type: "CAD_TRANSFORM";
  rotationX: number;
  rotationY: number;
  renderMode: CadRenderMode;
};

export type RequestRoomStatePacket = {
  type: "REQUEST_ROOM_STATE";
};

export type RoomStateCad = {
  rotationX: number;
  rotationY: number;
  renderMode: CadRenderMode;
};

export type RoomStateSnapshot = {
  whiteboardSegments: DrawStrokePacket[];
  cad: RoomStateCad;
  activePresenterId?: string | null;
};

export type ReceiveRoomStatePacket = {
  type: "RECEIVE_ROOM_STATE";
  state: RoomStateSnapshot;
};

export type LockClaimPacket = {
  type: "LOCK_CLAIM";
  identity: string;
};

export type LockReleasePacket = {
  type: "LOCK_RELEASE";
  identity: string;
};

export type LiveSyncPacket =
  | DrawStrokePacket
  | ClearCanvasPacket
  | CadTransformPacket
  | RequestRoomStatePacket
  | ReceiveRoomStatePacket
  | LockClaimPacket
  | LockReleasePacket;

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const DEFAULT_CAD_STATE: RoomStateCad = {
  rotationX: 0.55,
  rotationY: 0.85,
  renderMode: "wireframe",
};

export function encodeLiveSyncPacket(packet: LiveSyncPacket): Uint8Array {
  return encoder.encode(JSON.stringify(packet));
}

export function decodeLiveSyncPacket(payload: Uint8Array): LiveSyncPacket | null {
  try {
    const parsed: unknown = JSON.parse(decoder.decode(payload));
    return isLiveSyncPacket(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function isDrawStrokePacket(value: unknown): value is DrawStrokePacket {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    v.type === "DRAW_STROKE" &&
    typeof v.x0 === "number" &&
    typeof v.y0 === "number" &&
    typeof v.x1 === "number" &&
    typeof v.y1 === "number" &&
    typeof v.color === "string" &&
    typeof v.thickness === "number" &&
    (v.tool === "pencil" || v.tool === "line")
  );
}

function isClearCanvasPacket(value: unknown): value is ClearCanvasPacket {
  return !!value && typeof value === "object" && (value as ClearCanvasPacket).type === "CLEAR_CANVAS";
}

function isCadTransformPacket(value: unknown): value is CadTransformPacket {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    v.type === "CAD_TRANSFORM" &&
    typeof v.rotationX === "number" &&
    typeof v.rotationY === "number" &&
    (v.renderMode === "wireframe" || v.renderMode === "shaded" || v.renderMode === "point_cloud")
  );
}

function isRequestRoomStatePacket(value: unknown): value is RequestRoomStatePacket {
  return !!value && typeof value === "object" && (value as RequestRoomStatePacket).type === "REQUEST_ROOM_STATE";
}

export function isRoomStateCad(value: unknown): value is RoomStateCad {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.rotationX === "number" &&
    typeof v.rotationY === "number" &&
    (v.renderMode === "wireframe" || v.renderMode === "shaded" || v.renderMode === "point_cloud")
  );
}

export function isRoomStateSnapshot(value: unknown): value is RoomStateSnapshot {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  if (!Array.isArray(v.whiteboardSegments)) return false;
  if (!v.whiteboardSegments.every(isDrawStrokePacket)) return false;
  return isRoomStateCad(v.cad);
}

function isReceiveRoomStatePacket(value: unknown): value is ReceiveRoomStatePacket {
  if (!value || typeof value !== "object") return false;
  const v = value as ReceiveRoomStatePacket;
  return v.type === "RECEIVE_ROOM_STATE" && isRoomStateSnapshot(v.state);
}

function isLockClaimPacket(value: unknown): value is LockClaimPacket {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return v.type === "LOCK_CLAIM" && typeof v.identity === "string";
}

function isLockReleasePacket(value: unknown): value is LockReleasePacket {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return v.type === "LOCK_RELEASE" && typeof v.identity === "string";
}

export function isLiveSyncPacket(value: unknown): value is LiveSyncPacket {
  return (
    isDrawStrokePacket(value) ||
    isClearCanvasPacket(value) ||
    isCadTransformPacket(value) ||
    isRequestRoomStatePacket(value) ||
    isReceiveRoomStatePacket(value) ||
    isLockClaimPacket(value) ||
    isLockReleasePacket(value)
  );
}

export function buildRoomStateSnapshot(parts: {
  whiteboardSegments: DrawStrokePacket[];
  cad: RoomStateCad;
  activePresenterId?: string | null;
}): RoomStateSnapshot {
  return {
    whiteboardSegments: parts.whiteboardSegments.filter(isDrawStrokePacket),
    cad: isRoomStateCad(parts.cad) ? parts.cad : DEFAULT_CAD_STATE,
    activePresenterId: parts.activePresenterId ?? null,
  };
}

export function isRoomStateAuthority(room: Room, isHost: boolean): boolean {
  if (isHost) return true;

  const localJoined = room.localParticipant.joinedAt?.getTime() ?? Number.MAX_SAFE_INTEGER;
  let oldestJoined = localJoined;
  let oldestIdentity = room.localParticipant.identity;

  for (const participant of room.remoteParticipants.values()) {
    const joined = participant.joinedAt?.getTime() ?? Number.MAX_SAFE_INTEGER;
    if (joined < oldestJoined) {
      oldestJoined = joined;
      oldestIdentity = participant.identity;
    } else if (joined === oldestJoined && participant.identity < oldestIdentity) {
      oldestIdentity = participant.identity;
    }
  }

  return oldestIdentity === room.localParticipant.identity;
}

export async function publishLiveSyncPacket(
  room: Room | undefined,
  packet: LiveSyncPacket,
  reliable: boolean,
): Promise<void> {
  if (!room || room.state !== "connected") return;
  const data = encodeLiveSyncPacket(packet);
  await room.localParticipant.publishData(data, { reliable });
}
