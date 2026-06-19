import { describe, expect, it } from "vitest";
import {
  buildRoomStateSnapshot,
  decodeLiveSyncPacket,
  encodeLiveSyncPacket,
  isLiveSyncPacket,
  isRoomStateSnapshot,
} from "@/lib/livekit-sync";

describe("livekit-sync packets", () => {
  it("round-trips DRAW_STROKE", () => {
    const packet = {
      type: "DRAW_STROKE" as const,
      x0: 1,
      y0: 2,
      x1: 10,
      y1: 20,
      color: "#007AFF",
      thickness: 4,
      tool: "pencil" as const,
    };
    const decoded = decodeLiveSyncPacket(encodeLiveSyncPacket(packet));
    expect(decoded).toEqual(packet);
  });

  it("round-trips CAD_TRANSFORM", () => {
    const packet = {
      type: "CAD_TRANSFORM" as const,
      rotationX: 0.5,
      rotationY: 1.2,
      renderMode: "wireframe" as const,
    };
    expect(isLiveSyncPacket(packet)).toBe(true);
    expect(decodeLiveSyncPacket(encodeLiveSyncPacket(packet))).toEqual(packet);
  });

  it("round-trips REQUEST_ROOM_STATE and RECEIVE_ROOM_STATE", () => {
    const request = { type: "REQUEST_ROOM_STATE" as const };
    expect(decodeLiveSyncPacket(encodeLiveSyncPacket(request))).toEqual(request);

    const receive = {
      type: "RECEIVE_ROOM_STATE" as const,
      state: {
        whiteboardSegments: [
          {
            type: "DRAW_STROKE" as const,
            x0: 0,
            y0: 0,
            x1: 5,
            y1: 5,
            color: "#000",
            thickness: 2,
            tool: "line" as const,
          },
        ],
        cad: { rotationX: 0.4, rotationY: 0.9, renderMode: "shaded" as const },
      },
    };
    expect(isRoomStateSnapshot(receive.state)).toBe(true);
    expect(decodeLiveSyncPacket(encodeLiveSyncPacket(receive))).toEqual(receive);
    expect(
      buildRoomStateSnapshot({
        whiteboardSegments: receive.state.whiteboardSegments,
        cad: receive.state.cad,
      }),
    ).toEqual(receive.state);
  });

  it("rejects malformed payloads", () => {
    expect(decodeLiveSyncPacket(new TextEncoder().encode("{bad"))).toBeNull();
    expect(decodeLiveSyncPacket(new TextEncoder().encode('{"type":"UNKNOWN"}'))).toBeNull();
    expect(
      decodeLiveSyncPacket(
        new TextEncoder().encode(
          JSON.stringify({
            type: "RECEIVE_ROOM_STATE",
            state: { whiteboardSegments: [{ type: "DRAW_STROKE", x0: "bad" }], cad: {} },
          }),
        ),
      ),
    ).toBeNull();
  });
});
