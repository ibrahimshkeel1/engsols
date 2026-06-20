import type { Room } from "livekit-client";
import {
  buildRoomStateSnapshot,
  isRoomStateAuthority,
  publishLiveSyncPacket,
  type DrawStrokePacket,
  type DrawTextPacket,
  type RoomStateCad,
  type RoomStateSnapshot,
  type WhiteboardElement,
} from "@/lib/livekit-sync";
import { applyPresenterLockFromRemote, getActivePresenterId } from "@/lib/presenter-lock";

type WhiteboardContributor = {
  getSegments: () => WhiteboardElement[];
  applySegments: (segments: WhiteboardElement[]) => void;
  appendElement: (element: WhiteboardElement) => void;
  clearSegments: () => void;
};

type CadContributor = {
  getCadState: () => RoomStateCad;
  applyCadState: (cad: RoomStateCad) => void;
};

type HydrationTracker = {
  initialRequestSent: boolean;
  firstAttemptTimer: ReturnType<typeof setTimeout> | null;
  secondAttemptTimer: ReturnType<typeof setTimeout> | null;
};

const DEFAULT_CAD_STATE: RoomStateCad = {
  rotationX: 0.55,
  rotationY: 0.85,
  renderMode: "wireframe",
};

const RESPONSE_COOLDOWN_MS = 250;
export const HYDRATION_RETRY_MS = 2500;

let whiteboardContributor: WhiteboardContributor | null = null;
let cadContributor: CadContributor | null = null;
let cachedWhiteboardSegments: WhiteboardElement[] = [];
let cachedCadState: RoomStateCad = DEFAULT_CAD_STATE;

let pendingSnapshot: RoomStateSnapshot | null = null;
let hydrated = false;
let hydrationFailedOrAlone = false;
let lastRespondAt = 0;
let activeHydrationRoom: Room | null = null;

const hydrationTrackers = new WeakMap<Room, HydrationTracker>();
const hydrationListeners = new Set<() => void>();

function notifyHydrationListeners(): void {
  hydrationListeners.forEach((listener) => listener());
}

export function subscribeRoomStateHydration(listener: () => void): () => void {
  hydrationListeners.add(listener);
  return () => {
    hydrationListeners.delete(listener);
  };
}

function getOrCreateTracker(room: Room): HydrationTracker {
  let tracker = hydrationTrackers.get(room);
  if (!tracker) {
    tracker = {
      initialRequestSent: false,
      firstAttemptTimer: null,
      secondAttemptTimer: null,
    };
    hydrationTrackers.set(room, tracker);
  }
  return tracker;
}

function clearHydrationTimers(tracker: HydrationTracker): void {
  if (tracker.firstAttemptTimer !== null) {
    clearTimeout(tracker.firstAttemptTimer);
    tracker.firstAttemptTimer = null;
  }
  if (tracker.secondAttemptTimer !== null) {
    clearTimeout(tracker.secondAttemptTimer);
    tracker.secondAttemptTimer = null;
  }
}

function completeHydrationSuccess(): void {
  hydrated = true;
  hydrationFailedOrAlone = false;
  if (!activeHydrationRoom) {
    notifyHydrationListeners();
    return;
  }

  const tracker = hydrationTrackers.get(activeHydrationRoom);
  if (tracker) clearHydrationTimers(tracker);
  hydrationTrackers.delete(activeHydrationRoom);
  activeHydrationRoom = null;
  notifyHydrationListeners();
}

function markHydrationFailedOrAlone(room: Room): void {
  if (hydrated) return;
  hydrationFailedOrAlone = true;

  const tracker = hydrationTrackers.get(room);
  if (tracker) clearHydrationTimers(tracker);
  hydrationTrackers.delete(room);
  if (activeHydrationRoom === room) activeHydrationRoom = null;
  notifyHydrationListeners();
}

function startHydrationRetryLoop(room: Room): void {
  if (hydrated || hydrationFailedOrAlone) return;

  const tracker = getOrCreateTracker(room);
  clearHydrationTimers(tracker);

  tracker.firstAttemptTimer = setTimeout(() => {
    tracker.firstAttemptTimer = null;
    if (hydrated || hydrationFailedOrAlone) return;
    if (room.state !== "connected" || room.remoteParticipants.size === 0) return;

    void publishLiveSyncPacket(room, { type: "REQUEST_ROOM_STATE" }, true);

    tracker.secondAttemptTimer = setTimeout(() => {
      tracker.secondAttemptTimer = null;
      if (hydrated) return;
      markHydrationFailedOrAlone(room);
    }, HYDRATION_RETRY_MS);
  }, HYDRATION_RETRY_MS);
}

export function registerWhiteboardRoomState(contributor: WhiteboardContributor): () => void {
  whiteboardContributor = contributor;
  const segments = contributor.getSegments();
  if (segments.length > 0) {
    cachedWhiteboardSegments = segments;
  } else if (pendingSnapshot) {
    contributor.applySegments(pendingSnapshot.whiteboardSegments);
  } else if (cachedWhiteboardSegments.length > 0) {
    contributor.applySegments(cachedWhiteboardSegments);
  }
  return () => {
    if (whiteboardContributor === contributor) {
      cachedWhiteboardSegments = contributor.getSegments();
      whiteboardContributor = null;
    }
  };
}

export function appendWhiteboardElement(element: WhiteboardElement): void {
  cachedWhiteboardSegments = [...cachedWhiteboardSegments, element];
  whiteboardContributor?.appendElement(element);
}

/** @deprecated Use appendWhiteboardElement */
export function appendWhiteboardSegment(segment: DrawStrokePacket): void {
  appendWhiteboardElement(segment);
}

export function clearWhiteboardSegments(): void {
  cachedWhiteboardSegments = [];
  whiteboardContributor?.clearSegments();
}

export function registerCadRoomState(contributor: CadContributor): () => void {
  cadContributor = contributor;
  const cad = contributor.getCadState();
  cachedCadState = cad;
  if (pendingSnapshot) {
    contributor.applyCadState(pendingSnapshot.cad);
  }
  return () => {
    if (cadContributor === contributor) {
      cachedCadState = contributor.getCadState();
      cadContributor = null;
    }
  };
}

export function getWhiteboardSegmentsSnapshot(): WhiteboardElement[] {
  return whiteboardContributor?.getSegments() ?? cachedWhiteboardSegments;
}

export function getCadStateSnapshot(): RoomStateCad {
  return cadContributor?.getCadState() ?? cachedCadState;
}

export function isRoomStateHydrated(): boolean {
  return hydrated;
}

export function isHydrationFailedOrAlone(): boolean {
  return hydrationFailedOrAlone;
}

export function isRoomStateHydrationResolved(): boolean {
  return hydrated || hydrationFailedOrAlone;
}

export function disposeRoomStateHydrationRetry(room: Room | undefined): void {
  if (!room) return;

  const tracker = hydrationTrackers.get(room);
  if (tracker) clearHydrationTimers(tracker);
  hydrationTrackers.delete(room);
  if (activeHydrationRoom === room) activeHydrationRoom = null;
}

export function resetRoomStateHydration(room: Room): void {
  hydrated = false;
  hydrationFailedOrAlone = false;
  pendingSnapshot = null;

  const tracker = hydrationTrackers.get(room);
  if (tracker) {
    clearHydrationTimers(tracker);
    tracker.initialRequestSent = false;
  } else {
    hydrationTrackers.delete(room);
  }

  if (activeHydrationRoom === room) activeHydrationRoom = null;
  notifyHydrationListeners();
}

export function requestRoomStateOnce(room: Room | undefined): void {
  if (!room || room.state !== "connected") return;
  if (room.remoteParticipants.size === 0) return;
  if (hydrated || hydrationFailedOrAlone) return;

  const tracker = getOrCreateTracker(room);
  if (tracker.initialRequestSent) return;

  tracker.initialRequestSent = true;
  activeHydrationRoom = room;
  void publishLiveSyncPacket(room, { type: "REQUEST_ROOM_STATE" }, true);
  startHydrationRetryLoop(room);
}

export function respondToRoomStateRequest(room: Room, isHost: boolean): void {
  if (!isRoomStateAuthority(room, isHost)) return;
  const now = Date.now();
  if (now - lastRespondAt < RESPONSE_COOLDOWN_MS) return;
  lastRespondAt = now;

  const state = buildRoomStateSnapshot({
    whiteboardSegments: getWhiteboardSegmentsSnapshot(),
    cad: getCadStateSnapshot(),
    activePresenterId: getActivePresenterId(),
  });

  void publishLiveSyncPacket(room, { type: "RECEIVE_ROOM_STATE", state }, true);
}

export function applyRoomStateSnapshot(snapshot: RoomStateSnapshot): void {
  pendingSnapshot = null;
  cachedWhiteboardSegments = snapshot.whiteboardSegments;
  cachedCadState = snapshot.cad;
  whiteboardContributor?.applySegments(snapshot.whiteboardSegments);
  cadContributor?.applyCadState(snapshot.cad);
  if (snapshot.activePresenterId !== undefined) {
    applyPresenterLockFromRemote(snapshot.activePresenterId);
  }
  completeHydrationSuccess();
}

export function bufferRoomStateSnapshot(snapshot: RoomStateSnapshot): void {
  pendingSnapshot = snapshot;
  cachedWhiteboardSegments = snapshot.whiteboardSegments;
  cachedCadState = snapshot.cad;
  whiteboardContributor?.applySegments(snapshot.whiteboardSegments);
  cadContributor?.applyCadState(snapshot.cad);
  if (snapshot.activePresenterId !== undefined) {
    applyPresenterLockFromRemote(snapshot.activePresenterId);
  }
  completeHydrationSuccess();
}

/** @internal test helper */
export function __resetLiveRoomStateForTests(): void {
  hydrated = false;
  hydrationFailedOrAlone = false;
  pendingSnapshot = null;
  activeHydrationRoom = null;
  lastRespondAt = 0;
  cachedWhiteboardSegments = [];
  whiteboardContributor = null;
}
