"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Eraser, Minus, Pencil } from "lucide-react";
import { RoomEvent, type Room } from "livekit-client";
import {
  WHITEBOARD_COLORS,
  type WhiteboardColor,
  type WhiteboardTool,
} from "@/types/live-workspace";
import {
  decodeLiveSyncPacket,
  isRoomStateSnapshot,
  publishLiveSyncPacket,
  type DrawStrokePacket,
} from "@/lib/livekit-sync";
import {
  appendWhiteboardSegment,
  clearWhiteboardSegments,
  registerWhiteboardRoomState,
  requestRoomStateOnce,
  respondToRoomStateRequest,
} from "@/lib/live-room-state";
import {
  canLocalEdit,
  handleLockClaimPacket,
  handleLockReleasePacket,
  subscribePresenterLock,
} from "@/lib/presenter-lock";
import { PresenterLockControl } from "@/components/live/PresenterLockControl";
import {
  computeCanvasLayout,
  toNormalizedSegment,
  toPixelSegmentCompat,
  type CanvasLayout,
} from "@/lib/whiteboard-coords";
import { cn } from "@/lib/utils";

type Point = { x: number; y: number };

const COLOR_OPTIONS: { id: string; value: WhiteboardColor; label: string }[] = [
  { id: "red", value: WHITEBOARD_COLORS.signalRed, label: "Signal red" },
  { id: "blue", value: WHITEBOARD_COLORS.engineeringBlue, label: "Engineering blue" },
  { id: "green", value: WHITEBOARD_COLORS.matrixGreen, label: "Matrix green" },
  { id: "black", value: WHITEBOARD_COLORS.carbonBlack, label: "Carbon black" },
];

const LINE_WIDTHS = [2, 4, 6, 10] as const;

function drawSegment(
  ctx: CanvasRenderingContext2D,
  segment: Pick<DrawStrokePacket, "x0" | "y0" | "x1" | "y1" | "color" | "thickness">,
) {
  ctx.strokeStyle = segment.color;
  ctx.lineWidth = segment.thickness;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(segment.x0, segment.y0);
  ctx.lineTo(segment.x1, segment.y1);
  ctx.stroke();
}

function drawGrid(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.fillStyle = "#fafaf9";
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "rgba(0,0,0,0.06)";
  ctx.lineWidth = 1;
  const grid = 24;
  for (let x = 0; x < width; x += grid) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += grid) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
}

type Props = {
  room?: Room;
  isHost?: boolean;
};

export function WhiteboardWorkspace({ room, isHost = false }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const segmentsRef = useRef<DrawStrokePacket[]>([]);
  const layoutRef = useRef<CanvasLayout>({ width: 0, height: 0, offsetX: 0, offsetY: 0 });
  const draftLineRef = useRef<{ from: Point; to: Point } | null>(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef<Point | null>(null);
  const lineStartRef = useRef<Point | null>(null);

  const [tool, setTool] = useState<WhiteboardTool>("pencil");
  const [color, setColor] = useState<WhiteboardColor>(WHITEBOARD_COLORS.engineeringBlue);
  const [lineWidth, setLineWidth] = useState<(typeof LINE_WIDTHS)[number]>(4);
  const [canvasLayout, setCanvasLayout] = useState<CanvasLayout>({
    width: 0,
    height: 0,
    offsetX: 0,
    offsetY: 0,
  });
  const [, bump] = useState(0);
  const [, lockTick] = useState(0);

  const readOnly = !canLocalEdit(room);

  useEffect(() => subscribePresenterLock(() => lockTick((n) => n + 1)), []);

  const toolRef = useRef(tool);
  const colorRef = useRef(color);
  const lineWidthRef = useRef(lineWidth);
  const roomRef = useRef(room);

  useEffect(() => {
    toolRef.current = tool;
    colorRef.current = color;
    lineWidthRef.current = lineWidth;
    roomRef.current = room;
  }, [tool, color, lineWidth, room]);

  const syncCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return layoutRef.current;

    const rect = container.getBoundingClientRect();
    const layout = computeCanvasLayout(rect.width, rect.height);
    layoutRef.current = layout;
    setCanvasLayout(layout);

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(layout.width * dpr);
    canvas.height = Math.floor(layout.height * dpr);
    canvas.style.width = `${layout.width}px`;
    canvas.style.height = `${layout.height}px`;
    canvas.style.left = `${layout.offsetX}px`;
    canvas.style.top = `${layout.offsetY}px`;

    return layout;
  }, []);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const layout = syncCanvasSize();
    if (layout.width <= 0 || layout.height <= 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawGrid(ctx, layout.width, layout.height);

    for (const segment of segmentsRef.current) {
      drawSegment(ctx, toPixelSegmentCompat(segment, layout));
    }

    if (draftLineRef.current) {
      drawSegment(ctx, {
        x0: draftLineRef.current.from.x,
        y0: draftLineRef.current.from.y,
        x1: draftLineRef.current.to.x,
        y1: draftLineRef.current.to.y,
        color: colorRef.current,
        thickness: lineWidthRef.current,
      });
    }
  }, [syncCanvasSize]);

  const drawRemoteSegment = useCallback((segment: DrawStrokePacket) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const layout = layoutRef.current;
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawSegment(ctx, toPixelSegmentCompat(segment, layout));
  }, []);

  const hydrateFromSnapshot = useCallback(
    (segments: DrawStrokePacket[]) => {
      segmentsRef.current = [...segments];
      draftLineRef.current = null;
      redraw();
    },
    [redraw],
  );

  const appendSegment = useCallback(
    (segment: DrawStrokePacket) => {
      segmentsRef.current = [...segmentsRef.current, segment];
      drawRemoteSegment(segment);
    },
    [drawRemoteSegment],
  );

  const clearSegments = useCallback(() => {
    segmentsRef.current = [];
    draftLineRef.current = null;
    redraw();
  }, [redraw]);

  useEffect(() => {
    return registerWhiteboardRoomState({
      getSegments: () => segmentsRef.current,
      applySegments: (segments) => hydrateFromSnapshot(segments),
      appendSegment,
      clearSegments,
    });
  }, [appendSegment, clearSegments, hydrateFromSnapshot]);

  useEffect(() => {
    requestRoomStateOnce(room);
  }, [room, room?.remoteParticipants.size]);

  useEffect(() => {
    redraw();
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => redraw());
    observer.observe(container);
    return () => observer.disconnect();
  }, [redraw]);

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

      if (packet.type === "RECEIVE_ROOM_STATE" && isRoomStateSnapshot(packet.state)) {
        hydrateFromSnapshot(packet.state.whiteboardSegments);
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

    room.on(RoomEvent.DataReceived, onData);
    return () => {
      room.off(RoomEvent.DataReceived, onData);
    };
  }, [room, isHost, hydrateFromSnapshot]);

  function getPoint(clientX: number, clientY: number): Point | null {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    if (x < 0 || y < 0 || x > rect.width || y > rect.height) return null;
    return { x, y };
  }

  function publishStroke(pixelSegment: Omit<DrawStrokePacket, "type">) {
    const layout = layoutRef.current;
    if (layout.width <= 0 || layout.height <= 0) return;
    const segment = toNormalizedSegment(pixelSegment, layout);
    appendWhiteboardSegment(segment);
    void publishLiveSyncPacket(roomRef.current, segment, true);
  }

  function handlePointerDown(clientX: number, clientY: number) {
    if (readOnly) return;
    const point = getPoint(clientX, clientY);
    if (!point) return;
    drawingRef.current = true;
    lastPointRef.current = point;
    lineStartRef.current = point;
    draftLineRef.current = toolRef.current === "line" ? { from: point, to: point } : null;
    redraw();
  }

  function handlePointerMove(clientX: number, clientY: number) {
    if (readOnly) return;
    if (!drawingRef.current) return;
    const point = getPoint(clientX, clientY);
    if (!point) return;

    if (toolRef.current === "pencil") {
      const last = lastPointRef.current;
      if (last) {
        publishStroke({
          x0: last.x,
          y0: last.y,
          x1: point.x,
          y1: point.y,
          color: colorRef.current,
          thickness: lineWidthRef.current,
          tool: "pencil",
        });
      }
      lastPointRef.current = point;
      return;
    }

    if (draftLineRef.current) {
      draftLineRef.current = { from: draftLineRef.current.from, to: point };
      redraw();
    }
  }

  function handlePointerUp() {
    if (!drawingRef.current) return;
    drawingRef.current = false;

    if (toolRef.current === "line" && lineStartRef.current && draftLineRef.current) {
      publishStroke({
        x0: lineStartRef.current.x,
        y0: lineStartRef.current.y,
        x1: draftLineRef.current.to.x,
        y1: draftLineRef.current.to.y,
        color: colorRef.current,
        thickness: lineWidthRef.current,
        tool: "line",
      });
    }

    draftLineRef.current = null;
    lastPointRef.current = null;
    lineStartRef.current = null;
    redraw();
    bump((n) => n + 1);
  }

  function clearCanvas() {
    if (readOnly) return;
    clearWhiteboardSegments();
    void publishLiveSyncPacket(roomRef.current, { type: "CLEAR_CANVAS" }, true);
    bump((n) => n + 1);
  }

  return (
    <div className="flex h-full min-h-0 flex-col rounded-xl border border-border bg-card">
      <div className="flex items-center gap-2 overflow-x-auto border-b border-border px-3 py-2 scrollbar-none sm:gap-3">
        <PresenterLockControl room={room} />
        <div className={cn("flex items-center gap-1 rounded-lg bg-muted/60 p-1", readOnly && "pointer-events-none opacity-50")}>
          <button
            type="button"
            onClick={() => setTool("pencil")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all duration-200 active:scale-[0.98]",
              tool === "pencil" ? "bg-zone-live text-white shadow-sm" : "text-muted-foreground hover:text-foreground",
            )}
            aria-pressed={tool === "pencil"}
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden />
            Pencil
          </button>
          <button
            type="button"
            onClick={() => setTool("line")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all duration-200 active:scale-[0.98]",
              tool === "line" ? "bg-zone-live text-white shadow-sm" : "text-muted-foreground hover:text-foreground",
            )}
            aria-pressed={tool === "line"}
          >
            <Minus className="h-3.5 w-3.5 rotate-45" aria-hidden />
            Line
          </button>
        </div>

        <div className={cn("flex items-center gap-1.5", readOnly && "pointer-events-none opacity-50")} role="group" aria-label="Stroke color">
          {COLOR_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              title={opt.label}
              aria-label={opt.label}
              aria-pressed={color === opt.value}
              onClick={() => setColor(opt.value)}
              className={cn(
                "h-7 w-7 rounded-full border-2 transition-transform hover:scale-110",
                color === opt.value ? "border-zone-live ring-2 ring-zone-live/30" : "border-border",
              )}
              style={{ backgroundColor: opt.value }}
            />
          ))}
        </div>

        <div className={cn("flex items-center gap-1", readOnly && "pointer-events-none opacity-50")} role="group" aria-label="Line thickness">
          {LINE_WIDTHS.map((w) => (
            <button
              key={w}
              type="button"
              aria-pressed={lineWidth === w}
              onClick={() => setLineWidth(w)}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-md border text-xs font-medium transition-all duration-200 active:scale-[0.98]",
                lineWidth === w ? "border-zone-live bg-zone-live/10 text-zone-live" : "border-border text-muted-foreground",
              )}
            >
              {w}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={clearCanvas}
          disabled={readOnly}
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground disabled:opacity-40"
        >
          <Eraser className="h-3.5 w-3.5" aria-hidden />
          Clear canvas
        </button>
      </div>

      <div
        ref={containerRef}
        className="relative min-h-0 flex-1 overscroll-none bg-stone-100/80"
        style={{ touchAction: "none" }}
      >
        <canvas
          ref={canvasRef}
          className={cn("absolute touch-none shadow-sm", readOnly ? "cursor-default" : "cursor-crosshair")}
          style={{
            left: canvasLayout.offsetX,
            top: canvasLayout.offsetY,
            width: canvasLayout.width,
            height: canvasLayout.height,
          }}
          onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
          onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onTouchStart={(e) => {
            if (e.cancelable) e.preventDefault();
            const t = e.touches[0];
            if (t) handlePointerDown(t.clientX, t.clientY);
          }}
          onTouchMove={(e) => {
            if (e.cancelable) e.preventDefault();
            const t = e.touches[0];
            if (t) handlePointerMove(t.clientX, t.clientY);
          }}
          onTouchEnd={(e) => {
            if (e.cancelable) e.preventDefault();
            handlePointerUp();
          }}
          onTouchCancel={(e) => {
            if (e.cancelable) e.preventDefault();
            handlePointerUp();
          }}
        />
        {readOnly && (
          <div className="pointer-events-none absolute inset-0 flex items-end justify-center bg-background/10 pb-4 backdrop-blur-[1px]">
            <span className="rounded-full border border-border/80 bg-background/90 px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
              Read-only viewer — another participant has control
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
