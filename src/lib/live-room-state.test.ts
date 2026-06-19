import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Room } from "livekit-client";
import { publishLiveSyncPacket } from "@/lib/livekit-sync";
import {
  HYDRATION_RETRY_MS,
  __resetLiveRoomStateForTests,
  bufferRoomStateSnapshot,
  disposeRoomStateHydrationRetry,
  isHydrationFailedOrAlone,
  isRoomStateHydrated,
  isRoomStateHydrationResolved,
  requestRoomStateOnce,
  resetRoomStateHydration,
} from "@/lib/live-room-state";

vi.mock("@/lib/livekit-sync", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/livekit-sync")>();
  return {
    ...actual,
    publishLiveSyncPacket: vi.fn().mockResolvedValue(undefined),
  };
});

function createMockRoom(remoteCount = 1): Room {
  return {
    state: "connected",
    remoteParticipants: { size: remoteCount },
    localParticipant: { identity: "local-user" },
  } as Room;
}

describe("live-room-state hydration retry", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.mocked(publishLiveSyncPacket).mockClear();
    __resetLiveRoomStateForTests();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("sends an initial request and clears timers after hydration", () => {
    const room = createMockRoom();
    requestRoomStateOnce(room);

    expect(publishLiveSyncPacket).toHaveBeenCalledTimes(1);
    expect(publishLiveSyncPacket).toHaveBeenCalledWith(room, { type: "REQUEST_ROOM_STATE" }, true);
    expect(isRoomStateHydrated()).toBe(false);

    bufferRoomStateSnapshot({
      whiteboardSegments: [],
      cad: { rotationX: 0.5, rotationY: 0.8, renderMode: "wireframe" },
    });

    expect(isRoomStateHydrated()).toBe(true);
    expect(isRoomStateHydrationResolved()).toBe(true);

    vi.advanceTimersByTime(HYDRATION_RETRY_MS * 2);
    expect(publishLiveSyncPacket).toHaveBeenCalledTimes(1);
  });

  it("retries once after the first timeout window", () => {
    const room = createMockRoom();
    requestRoomStateOnce(room);

    vi.advanceTimersByTime(HYDRATION_RETRY_MS);

    expect(isRoomStateHydrated()).toBe(false);
    expect(isHydrationFailedOrAlone()).toBe(false);
    expect(publishLiveSyncPacket).toHaveBeenCalledTimes(2);
    expect(publishLiveSyncPacket).toHaveBeenLastCalledWith(room, { type: "REQUEST_ROOM_STATE" }, true);
  });

  it("marks solitude fallback after both retry windows expire", () => {
    const room = createMockRoom();
    requestRoomStateOnce(room);

    vi.advanceTimersByTime(HYDRATION_RETRY_MS * 2);

    expect(isHydrationFailedOrAlone()).toBe(true);
    expect(isRoomStateHydrationResolved()).toBe(true);
    expect(publishLiveSyncPacket).toHaveBeenCalledTimes(2);
  });

  it("disposes timers on unmount without leaking follow-up retries", () => {
    const room = createMockRoom();
    requestRoomStateOnce(room);
    disposeRoomStateHydrationRetry(room);

    vi.advanceTimersByTime(HYDRATION_RETRY_MS * 2);

    expect(publishLiveSyncPacket).toHaveBeenCalledTimes(1);
    expect(isHydrationFailedOrAlone()).toBe(false);
  });

  it("allows a fresh hydration cycle after reconnect reset", () => {
    const room = createMockRoom();
    requestRoomStateOnce(room);

    vi.advanceTimersByTime(HYDRATION_RETRY_MS * 2);
    expect(isHydrationFailedOrAlone()).toBe(true);

    resetRoomStateHydration(room);
    requestRoomStateOnce(room);

    expect(isHydrationFailedOrAlone()).toBe(false);
    expect(publishLiveSyncPacket).toHaveBeenCalledTimes(3);
  });
});
