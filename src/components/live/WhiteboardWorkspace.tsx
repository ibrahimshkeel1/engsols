"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Eraser, Hand, Minus, Pencil, Type, ZoomIn, ZoomOut } from "lucide-react";
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
  type DrawTextPacket,
  type WhiteboardElement,
} from "@/lib/livekit-sync";
import {
  appendWhiteboardElement,
  clearWhiteboardSegments,
  registerWhiteboardRoomState,
  requestRoomStateOnce,
  respondToRoomStateRequest,
} from "@/lib/live-room-state";
import {
  DEFAULT_VIEWPORT,
  WHITEBOARD_VIRTUAL_HEIGHT,
  WHITEBOARD_VIRTUAL_WIDTH,
  clampZoom,
  computeFitTransform,
  screenToVirtual,
  toNormalizedStroke,
  toNormalizedText,
  toVirtualStroke,
  toVirtualText,
  virtualToScreen,
  zoomAtPoint,
  type FitTransform,
  type ViewportState,
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
const DEFAULT_TEXT_SIZE = 28;

function drawStroke(ctx: CanvasRenderingContext2D, segment: DrawStrokePacket) {
  const stroke = toVirtualStroke(segment);
  ctx.strokeStyle = stroke.color;
  ctx.lineWidth = stroke.thickness;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(stroke.x0, stroke.y0);
  ctx.lineTo(stroke.x1, stroke.y1);
  ctx.stroke();
}

function drawText(ctx: CanvasRenderingContext2D, item: DrawTextPacket) {
  const text = toVirtualText(item);
  ctx.font = `600 ${text.fontSize}px var(--font-sans), system-ui, sans-serif`;
  ctx.fillStyle = text.color;
  ctx.textBaseline = "top";
  ctx.fillText(text.text, text.x, text.y);
}

function drawGrid(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "#fafaf9";
  ctx.fillRect(0, 0, WHITEBOARD_VIRTUAL_WIDTH, WHITEBOARD_VIRTUAL_HEIGHT);

  ctx.strokeStyle = "rgba(0,0,0,0.06)";
  ctx.lineWidth = 1;
  const grid = 40;
  for (let x = 0; x < WHITEBOARD_VIRTUAL_WIDTH; x += grid) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, WHITEBOARD_VIRTUAL_HEIGHT);
    ctx.stroke();
  }
  for (let y = 0; y < WHITEBOARD_VIRTUAL_HEIGHT; y += grid) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(WHITEBOARD_VIRTUAL_WIDTH, y);
    ctx.stroke();
  }
}

function distanceBetweenTouches(
  a: { clientX: number; clientY: number },
  b: { clientX: number; clientY: number },
): number {
  return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
}

type Props = {
  room?: Room;
  isHost?: boolean;
};

export function WhiteboardWorkspace({ room, isHost = false }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const elementsRef = useRef<WhiteboardElement[]>([]);
  const fitRef = useRef<FitTransform>({
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    displayWidth: 0,
    displayHeight: 0,
  });
  const draftLineRef = useRef<{ from: Point; to: Point } | null>(null);
  const drawingRef = useRef(false);
  const panningRef = useRef(false);
  const lastPointRef = useRef<Point | null>(null);
  const lineStartRef = useRef<Point | null>(null);
  const panStartRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);
  const pinchRef = useRef<{ distance: number; zoom: number } | null>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

  const [tool, setTool] = useState<WhiteboardTool>("pencil");
  const [color, setColor] = useState<WhiteboardColor>(WHITEBOARD_COLORS.engineeringBlue);
  const [lineWidth, setLineWidth] = useState<(typeof LINE_WIDTHS)[number]>(4);
  const [viewport, setViewport] = useState<ViewportState>(DEFAULT_VIEWPORT);
  const [fit, setFit] = useState<FitTransform>({
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    displayWidth: 0,
    displayHeight: 0,
  });
  const [textDraft, setTextDraft] = useState<{ x: number; y: number; left: number; top: number } | null>(
    null,
  );
  const [, bump] = useState(0);

  const toolRef = useRef(tool);
  const colorRef = useRef(color);
  const lineWidthRef = useRef(lineWidth);
  const roomRef = useRef(room);
  const viewportRef = useRef(viewport);

  useEffect(() => {
    toolRef.current = tool;
    colorRef.current = color;
    lineWidthRef.current = lineWidth;
    roomRef.current = room;
    viewportRef.current = viewport;
  }, [tool, color, lineWidth, room, viewport]);

  const syncCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return fitRef.current;

    const rect = container.getBoundingClientRect();
    const fit = computeFitTransform(rect.width, rect.height);
    fitRef.current = fit;
    setFit(fit);

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(WHITEBOARD_VIRTUAL_WIDTH * dpr);
    canvas.height = Math.floor(WHITEBOARD_VIRTUAL_HEIGHT * dpr);
    canvas.style.width = `${WHITEBOARD_VIRTUAL_WIDTH}px`;
    canvas.style.height = `${WHITEBOARD_VIRTUAL_HEIGHT}px`;

    return fit;
  }, []);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    syncCanvas();
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawGrid(ctx);

    for (const element of elementsRef.current) {
      if (element.type === "DRAW_STROKE") drawStroke(ctx, element);
      else drawText(ctx, element);
    }

    if (draftLineRef.current) {
      ctx.strokeStyle = colorRef.current;
      ctx.lineWidth = lineWidthRef.current;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(draftLineRef.current.from.x, draftLineRef.current.from.y);
      ctx.lineTo(draftLineRef.current.to.x, draftLineRef.current.to.y);
      ctx.stroke();
    }
  }, [syncCanvas]);

  const drawElement = useCallback((element: WhiteboardElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (element.type === "DRAW_STROKE") drawStroke(ctx, element);
    else drawText(ctx, element);
  }, []);

  const hydrateFromSnapshot = useCallback(
    (segments: WhiteboardElement[]) => {
      elementsRef.current = [...segments];
      draftLineRef.current = null;
      redraw();
    },
    [redraw],
  );

  const appendElement = useCallback(
    (element: WhiteboardElement) => {
      elementsRef.current = [...elementsRef.current, element];
      drawElement(element);
    },
    [drawElement],
  );

  const clearElements = useCallback(() => {
    elementsRef.current = [];
    draftLineRef.current = null;
    redraw();
  }, [redraw]);

  useEffect(() => {
    return registerWhiteboardRoomState({
      getSegments: () => elementsRef.current,
      applySegments: (segments) => hydrateFromSnapshot(segments),
      appendElement,
      clearSegments: clearElements,
    });
  }, [appendElement, clearElements, hydrateFromSnapshot]);

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
  }, [redraw, viewport]);

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
      }
    };

    room.on(RoomEvent.DataReceived, onData);
    return () => {
      room.off(RoomEvent.DataReceived, onData);
    };
  }, [room, isHost, hydrateFromSnapshot]);

  useEffect(() => {
    if (textDraft) textInputRef.current?.focus();
  }, [textDraft]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const factor = event.deltaY > 0 ? 0.92 : 1.08;
      setViewport((current) =>
        zoomAtPoint(
          current,
          fitRef.current,
          event.clientX,
          event.clientY,
          container.getBoundingClientRect(),
          current.zoom * factor,
        ),
      );
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    return () => container.removeEventListener("wheel", onWheel);
  }, []);

  function getVirtualPoint(clientX: number, clientY: number): Point | null {
    const container = containerRef.current;
    if (!container) return null;
    return screenToVirtual(
      clientX,
      clientY,
      container.getBoundingClientRect(),
      fitRef.current,
      viewportRef.current,
    );
  }

  function publishStroke(virtualSegment: Omit<DrawStrokePacket, "type">) {
    const segment = toNormalizedStroke(virtualSegment);
    appendWhiteboardElement(segment);
    void publishLiveSyncPacket(roomRef.current, segment, true);
  }

  function publishText(virtual: Omit<DrawTextPacket, "type">) {
    const item = toNormalizedText(virtual);
    appendWhiteboardElement(item);
    void publishLiveSyncPacket(roomRef.current, item, true);
  }

  function beginDraw(clientX: number, clientY: number) {
    const point = getVirtualPoint(clientX, clientY);
    if (!point) return;
    drawingRef.current = true;
    lastPointRef.current = point;
    lineStartRef.current = point;
    draftLineRef.current = toolRef.current === "line" ? { from: point, to: point } : null;
    redraw();
  }

  function beginPan(clientX: number, clientY: number) {
    panningRef.current = true;
    panStartRef.current = {
      x: clientX,
      y: clientY,
      panX: viewportRef.current.panX,
      panY: viewportRef.current.panY,
    };
  }

  function beginText(clientX: number, clientY: number) {
    const point = getVirtualPoint(clientX, clientY);
    const container = containerRef.current;
    if (!point || !container) return;
    const rect = container.getBoundingClientRect();
    const screen = virtualToScreen(point.x, point.y, rect, fitRef.current, viewportRef.current);
    setTextDraft({
      x: point.x,
      y: point.y,
      left: screen.x - rect.left,
      top: screen.y - rect.top,
    });
  }

  function handlePointerDown(clientX: number, clientY: number) {
    if (toolRef.current === "hand") {
      beginPan(clientX, clientY);
      return;
    }
    if (toolRef.current === "text") {
      beginText(clientX, clientY);
      return;
    }
    beginDraw(clientX, clientY);
  }

  function handlePointerMove(clientX: number, clientY: number) {
    if (panningRef.current && panStartRef.current) {
      const dx = clientX - panStartRef.current.x;
      const dy = clientY - panStartRef.current.y;
      setViewport({
        ...viewportRef.current,
        panX: panStartRef.current.panX + dx,
        panY: panStartRef.current.panY + dy,
      });
      return;
    }

    if (!drawingRef.current) return;
    const point = getVirtualPoint(clientX, clientY);
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
    if (panningRef.current) {
      panningRef.current = false;
      panStartRef.current = null;
      return;
    }

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

  function commitText(value: string) {
    if (!textDraft) return;
    const trimmed = value.trim();
    if (trimmed) {
      publishText({
        x: textDraft.x,
        y: textDraft.y,
        text: trimmed.slice(0, 200),
        color: colorRef.current,
        fontSize: DEFAULT_TEXT_SIZE,
      });
    }
    setTextDraft(null);
    bump((n) => n + 1);
  }

  function clearCanvas() {
    clearWhiteboardSegments();
    void publishLiveSyncPacket(roomRef.current, { type: "CLEAR_CANVAS" }, true);
    bump((n) => n + 1);
  }

  const stageTransform = `translate(${fit.offsetX + viewport.panX}px, ${fit.offsetY + viewport.panY}px) scale(${fit.scale * viewport.zoom})`;

  return (
    <div className="flex h-full min-h-0 flex-col rounded-xl border border-border bg-card">
      <div className="flex items-center gap-2 overflow-x-auto border-b border-border px-3 py-2 scrollbar-none sm:gap-3">
        <div className="flex items-center gap-1 rounded-lg bg-muted/60 p-1">
          {(
            [
              { id: "pencil" as const, label: "Pencil", icon: Pencil },
              { id: "line" as const, label: "Line", icon: Minus },
              { id: "text" as const, label: "Text", icon: Type },
              { id: "hand" as const, label: "Pan", icon: Hand },
            ] as const
          ).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTool(id)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all duration-200 active:scale-[0.98]",
                tool === id ? "bg-zone-live text-white shadow-sm" : "text-muted-foreground hover:text-foreground",
              )}
              aria-pressed={tool === id}
            >
              <Icon className={cn("h-3.5 w-3.5", id === "line" && "rotate-45")} aria-hidden />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 rounded-lg bg-muted/60 p-1">
          <button
            type="button"
            onClick={() =>
              setViewport((current) => ({ ...current, zoom: clampZoom(current.zoom * 1.15) }))
            }
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-background hover:text-foreground"
            aria-label="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() =>
              setViewport((current) => ({ ...current, zoom: clampZoom(current.zoom / 1.15) }))
            }
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-background hover:text-foreground"
            aria-label="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewport(DEFAULT_VIEWPORT)}
            className="rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-background hover:text-foreground"
          >
            Fit
          </button>
        </div>

        <div className="flex items-center gap-1.5" role="group" aria-label="Stroke color">
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

        {tool !== "text" && (
          <div className="flex items-center gap-1" role="group" aria-label="Line thickness">
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
        )}

        <button
          type="button"
          onClick={clearCanvas}
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground"
        >
          <Eraser className="h-3.5 w-3.5" aria-hidden />
          Clear
        </button>
      </div>

      <div
        ref={containerRef}
        className="relative min-h-0 flex-1 overflow-hidden overscroll-none bg-stone-200/60"
        style={{ touchAction: "none" }}
      >
        <div className="absolute left-0 top-0 origin-top-left will-change-transform" style={{ transform: stageTransform }}>
          <canvas
            ref={canvasRef}
            className={cn(
              "block touch-none shadow-md",
              tool === "hand" ? "cursor-grab active:cursor-grabbing" : tool === "text" ? "cursor-text" : "cursor-crosshair",
            )}
            onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
            onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
            onMouseUp={handlePointerUp}
            onMouseLeave={handlePointerUp}
            onTouchStart={(e) => {
              if (e.cancelable) e.preventDefault();
              if (e.touches.length === 2) {
                pinchRef.current = {
                  distance: distanceBetweenTouches(e.touches[0], e.touches[1]),
                  zoom: viewportRef.current.zoom,
                };
                return;
              }
              const t = e.touches[0];
              if (t) handlePointerDown(t.clientX, t.clientY);
            }}
            onTouchMove={(e) => {
              if (e.cancelable) e.preventDefault();
              if (e.touches.length === 2 && pinchRef.current) {
                const nextDistance = distanceBetweenTouches(e.touches[0], e.touches[1]);
                const ratio = nextDistance / pinchRef.current.distance;
                setViewport({ ...viewportRef.current, zoom: clampZoom(pinchRef.current.zoom * ratio) });
                return;
              }
              const t = e.touches[0];
              if (t) handlePointerMove(t.clientX, t.clientY);
            }}
            onTouchEnd={(e) => {
              if (e.cancelable) e.preventDefault();
              if (e.touches.length < 2) pinchRef.current = null;
              if (e.touches.length === 0) handlePointerUp();
            }}
            onTouchCancel={(e) => {
              if (e.cancelable) e.preventDefault();
              pinchRef.current = null;
              handlePointerUp();
            }}
          />
        </div>

        {textDraft && (
          <input
            ref={textInputRef}
            type="text"
            defaultValue=""
            placeholder="Type and press Enter"
            className="absolute z-20 min-w-[8rem] rounded-md border border-zone-live bg-background px-2 py-1 text-sm shadow-md outline-none ring-2 ring-zone-live/20"
            style={{ left: textDraft.left, top: textDraft.top }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                commitText(e.currentTarget.value);
              }
              if (e.key === "Escape") setTextDraft(null);
            }}
            onBlur={(e) => commitText(e.currentTarget.value)}
          />
        )}
      </div>
    </div>
  );
}
