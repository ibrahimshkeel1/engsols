"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Box, Loader2, Upload } from "lucide-react";
import { RoomEvent, type Room } from "livekit-client";
import type { CadRenderMode } from "@/types/live-workspace";
import {
  decodeLiveSyncPacket,
  isRoomStateSnapshot,
  publishLiveSyncPacket,
} from "@/lib/livekit-sync";
import { registerCadRoomState } from "@/lib/live-room-state";
import {
  canLocalEdit,
  handleLockClaimPacket,
  handleLockReleasePacket,
  subscribePresenterLock,
} from "@/lib/presenter-lock";
import { PresenterLockControl } from "@/components/live/PresenterLockControl";
import { cn } from "@/lib/utils";

type Vec3 = { x: number; y: number; z: number };
type Face = { indices: [number, number, number]; shade: number };

const ACCEPTED_EXT = /\.(stl|obj)$/i;
const CAD_SYNC_THROTTLE_MS = 50;

function rotateY(v: Vec3, angle: number): Vec3 {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return { x: v.x * c - v.z * s, y: v.y, z: v.x * s + v.z * c };
}

function rotateX(v: Vec3, angle: number): Vec3 {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return { x: v.x, y: v.y * c - v.z * s, z: v.y * s + v.z * c };
}

function project(
  v: Vec3,
  rotX: number,
  rotY: number,
  cx: number,
  cy: number,
  scale: number,
): { x: number; y: number; z: number } {
  let p = rotateY(v, rotY);
  p = rotateX(p, rotX);
  const isoX = (p.x - p.z) * 0.866;
  const isoY = p.y + (p.x + p.z) * 0.5;
  return { x: cx + isoX * scale, y: cy + isoY * scale, z: p.z };
}

function buildTrussMesh(): { vertices: Vec3[]; edges: [number, number][]; faces: Face[] } {
  const vertices: Vec3[] = [];
  const edges: [number, number][] = [];
  const faces: Face[] = [];

  const hubR = 0.35;
  const outerR = 1.1;
  const teeth = 12;

  for (let i = 0; i < teeth; i++) {
    const a = (i / teeth) * Math.PI * 2;
    const a2 = ((i + 0.45) / teeth) * Math.PI * 2;
    const inner = { x: Math.cos(a) * hubR, y: Math.sin(a) * hubR, z: 0 };
    const outer = { x: Math.cos(a) * outerR, y: Math.sin(a) * outerR, z: 0 };
    const tip = { x: Math.cos(a2) * (outerR + 0.18), y: Math.sin(a2) * (outerR + 0.18), z: 0 };
    const base = vertices.length;
    vertices.push(inner, outer, tip);
    edges.push([base, base + 1], [base + 1, base + 2], [base + 2, base]);
    faces.push({ indices: [base, base + 1, base + 2], shade: 0.55 + (i % 3) * 0.12 });
  }

  const strutDirs: Vec3[] = [
    { x: 1, y: 0.2, z: 0.3 },
    { x: -0.9, y: 0.4, z: 0.5 },
    { x: 0.2, y: -1, z: 0.4 },
    { x: 0.3, y: 0.5, z: -1 },
    { x: -0.5, y: -0.6, z: -0.8 },
    { x: 0.8, y: -0.3, z: 0.9 },
  ];

  const centerIdx = vertices.length;
  vertices.push({ x: 0, y: 0, z: 0 });

  for (const dir of strutDirs) {
    const len = Math.hypot(dir.x, dir.y, dir.z);
    const end = { x: (dir.x / len) * 1.4, y: (dir.y / len) * 1.4, z: (dir.z / len) * 1.4 };
    const mid = {
      x: (dir.x / len) * 0.75,
      y: (dir.y / len) * 0.75,
      z: (dir.z / len) * 0.75,
    };
    const i0 = vertices.length;
    vertices.push(mid, end);
    edges.push([centerIdx, i0], [i0, i0 + 1]);
    faces.push({ indices: [centerIdx, i0, i0 + 1], shade: 0.45 });
  }

  return { vertices, edges, faces };
}

const MESH = buildTrussMesh();

const RENDER_MODES: { id: CadRenderMode; label: string }[] = [
  { id: "wireframe", label: "Wireframe" },
  { id: "shaded", label: "Shaded mesh" },
  { id: "point_cloud", label: "Point cloud" },
];

type Props = {
  room?: Room;
  isHost?: boolean;
};

export function CadSandboxWorkspace({ room }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);
  const rotRef = useRef({ x: 0.55, y: 0.85 });
  const dragRef = useRef<{ active: boolean; lastX: number; lastY: number }>({
    active: false,
    lastX: 0,
    lastY: 0,
  });
  const applyingRemoteRef = useRef(false);
  const lastSyncRef = useRef(0);
  const roomRef = useRef(room);
  const renderModeRef = useRef<CadRenderMode>("wireframe");

  const [renderMode, setRenderMode] = useState<CadRenderMode>("wireframe");
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [, lockTick] = useState(0);

  const readOnly = !canLocalEdit(room);

  useEffect(() => subscribePresenterLock(() => lockTick((n) => n + 1)), []);

  useEffect(() => {
    roomRef.current = room;
    renderModeRef.current = renderMode;
  }, [room, renderMode]);

  const applyCadState = useCallback((cad: { rotationX: number; rotationY: number; renderMode: CadRenderMode }) => {
    applyingRemoteRef.current = true;
    rotRef.current = { x: cad.rotationX, y: cad.rotationY };
    setRenderMode(cad.renderMode);
    applyingRemoteRef.current = false;
  }, []);

  useEffect(() => {
    return registerCadRoomState({
      getCadState: () => ({
        rotationX: rotRef.current.x,
        rotationY: rotRef.current.y,
        renderMode: renderModeRef.current,
      }),
      applyCadState: (cad) => applyCadState(cad),
    });
  }, [applyCadState]);

  const publishTransform = useCallback(() => {
    if (applyingRemoteRef.current) return;
    const now = Date.now();
    if (now - lastSyncRef.current < CAD_SYNC_THROTTLE_MS) return;
    lastSyncRef.current = now;

    void publishLiveSyncPacket(
      roomRef.current,
      {
        type: "CAD_TRANSFORM",
        rotationX: rotRef.current.x,
        rotationY: rotRef.current.y,
        renderMode: renderModeRef.current,
      },
      false,
    );
  }, []);

  const paint = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, "#0f1419");
    gradient.addColorStop(1, "#1a2332");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    if (!unlocked) return;

    const cx = rect.width * 0.42;
    const cy = rect.height * 0.52;
    const scale = Math.min(rect.width, rect.height) * 0.22;
    const { x: rotX, y: rotY } = rotRef.current;

    const projected = MESH.vertices.map((v) => project(v, rotX, rotY, cx, cy, scale));

    if (renderMode === "shaded") {
      const sortedFaces = [...MESH.faces].sort((a, b) => {
        const za =
          (projected[a.indices[0]].z + projected[a.indices[1]].z + projected[a.indices[2]].z) / 3;
        const zb =
          (projected[b.indices[0]].z + projected[b.indices[1]].z + projected[b.indices[2]].z) / 3;
        return za - zb;
      });
      for (const face of sortedFaces) {
        const [i0, i1, i2] = face.indices;
        const p0 = projected[i0];
        const p1 = projected[i1];
        const p2 = projected[i2];
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.closePath();
        const b = Math.floor(face.shade * 180);
        ctx.fillStyle = `rgba(0, 122, 255, ${0.25 + face.shade * 0.35})`;
        ctx.fill();
        ctx.strokeStyle = `rgb(${b + 40}, ${b + 80}, ${b + 120})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    if (renderMode === "wireframe" || renderMode === "shaded") {
      ctx.strokeStyle = renderMode === "wireframe" ? "#5ac8fa" : "rgba(90, 200, 250, 0.65)";
      ctx.lineWidth = renderMode === "wireframe" ? 1.5 : 1;
      for (const [a, b] of MESH.edges) {
        const p0 = projected[a];
        const p1 = projected[b];
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.stroke();
      }
    }

    if (renderMode === "point_cloud") {
      for (const p of projected) {
        const depth = 0.4 + (p.z + 1.5) * 0.15;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5 * depth, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(52, 199, 89, ${0.5 + depth * 0.3})`;
        ctx.fill();
      }
    }

    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.font = "11px system-ui, sans-serif";
    ctx.fillText(fileName ? `Asset: ${fileName}` : "Truss node preview", 12, rect.height - 14);
    ctx.fillText("Drag to rotate · synced live", 12, rect.height - 28);
  }, [fileName, renderMode, unlocked]);

  useEffect(() => {
    const loop = () => {
      paint();
      frameRef.current = requestAnimationFrame(loop);
    };
    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  }, [paint]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(() => paint());
    observer.observe(container);
    return () => observer.disconnect();
  }, [paint]);

  useEffect(() => {
    if (!room) return;

    const onData = (payload: Uint8Array, participant?: { identity: string }) => {
      if (participant?.identity === room.localParticipant.identity) return;
      const packet = decodeLiveSyncPacket(payload);
      if (!packet) return;

      if (packet.type === "CAD_TRANSFORM") {
        applyCadState(packet);
        return;
      }

      if (packet.type === "RECEIVE_ROOM_STATE" && isRoomStateSnapshot(packet.state)) {
        applyCadState(packet.state.cad);
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
  }, [room, applyCadState]);

  function handleFile(file: File) {
    if (!ACCEPTED_EXT.test(file.name)) return;
    setFileName(file.name);
    setLoading(true);
    setUnlocked(false);
    window.setTimeout(() => {
      setLoading(false);
      setUnlocked(true);
    }, 1500);
  }

  function onDrop(e: React.DragEvent) {
    if (readOnly) return;
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function onCanvasMouseDown(e: React.MouseEvent) {
    if (!unlocked || readOnly) return;
    dragRef.current = { active: true, lastX: e.clientX, lastY: e.clientY };
  }

  function onCanvasMouseMove(e: React.MouseEvent) {
    if (readOnly || !dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.lastX;
    const dy = e.clientY - dragRef.current.lastY;
    dragRef.current.lastX = e.clientX;
    dragRef.current.lastY = e.clientY;
    rotRef.current.y += dx * 0.008;
    rotRef.current.x += dy * 0.008;
    rotRef.current.x = Math.max(-1.2, Math.min(1.2, rotRef.current.x));
    publishTransform();
  }

  function onCanvasMouseUp() {
    if (dragRef.current.active) {
      dragRef.current.active = false;
      publishTransform();
    }
  }

  function handleRenderModeChange(mode: CadRenderMode) {
    if (readOnly) return;
    setRenderMode(mode);
    if (applyingRemoteRef.current) return;
    lastSyncRef.current = 0;
    void publishLiveSyncPacket(
      roomRef.current,
      {
        type: "CAD_TRANSFORM",
        rotationX: rotRef.current.x,
        rotationY: rotRef.current.y,
        renderMode: mode,
      },
      false,
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col rounded-xl border border-border bg-card lg:flex-row">
      <div
        ref={containerRef}
        className="relative min-h-0 min-w-0 flex-1 touch-none"
        onDragOver={(e) => {
          if (readOnly) return;
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
      >
        <canvas
          ref={canvasRef}
          className={cn("absolute inset-0", readOnly ? "cursor-default" : unlocked ? "cursor-grab active:cursor-grabbing" : "cursor-default")}
          onMouseDown={onCanvasMouseDown}
          onMouseMove={onCanvasMouseMove}
          onMouseUp={onCanvasMouseUp}
          onMouseLeave={onCanvasMouseUp}
        />

        {!unlocked && !loading && (
          <div
            className={cn(
              "absolute inset-3 flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors",
              dragOver ? "border-zone-live bg-zone-live/10" : "border-border/60 bg-background/40 backdrop-blur-sm",
            )}
          >
            <Upload className="h-10 w-10 text-muted-foreground" aria-hidden />
            <p className="mt-3 text-sm font-medium">Drop an engineering asset</p>
            <p className="mt-1 text-xs text-muted-foreground">.STL or .OBJ blueprint files</p>
            <label className="btn-cta mt-4 cursor-pointer px-4 py-2 text-xs">
              Browse files
              <input
                type="file"
                accept=".stl,.obj"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
              />
            </label>
          </div>
        )}

        {readOnly && unlocked && (
          <div className="pointer-events-none absolute inset-0 flex items-end justify-center bg-background/10 pb-4 backdrop-blur-[1px]">
            <span className="rounded-full border border-border/80 bg-background/90 px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
              Read-only viewer — orbit controls locked
            </span>
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/70 backdrop-blur-sm">
            <Loader2 className="h-10 w-10 animate-spin text-zone-live" aria-hidden />
            <p className="mt-3 text-sm font-medium">Parsing {fileName}…</p>
          </div>
        )}
      </div>

      <aside className="flex shrink-0 flex-row gap-2 overflow-x-auto border-t border-border bg-muted/30 p-2 lg:w-52 lg:flex-col lg:overflow-visible lg:border-l lg:border-t-0 lg:p-3">
        <PresenterLockControl room={room} className="w-full lg:mb-2" />
        <div className="hidden items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground lg:flex">
          <Box className="h-3.5 w-3.5" aria-hidden />
          Render mode
        </div>
        <div className="flex flex-1 gap-1.5 lg:mt-3 lg:flex-col lg:space-y-1.5" role="radiogroup" aria-label="3D render mode">
          {RENDER_MODES.map((mode) => (
            <button
              key={mode.id}
              type="button"
              role="radio"
              aria-checked={renderMode === mode.id}
              disabled={!unlocked || readOnly}
              onClick={() => handleRenderModeChange(mode.id)}
              className={cn(
                "shrink-0 rounded-lg px-3 py-2 text-left text-xs font-medium transition-all duration-200 active:scale-[0.98] disabled:opacity-40 lg:w-full",
                renderMode === mode.id
                  ? "bg-zone-live text-white shadow-zone-live dark:text-slate-950"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {mode.label}
            </button>
          ))}
        </div>
        <p className="hidden pt-4 text-[10px] leading-relaxed text-muted-foreground lg:block lg:mt-auto">
          Camera orientation syncs across the live session via LiveKit data channels.
        </p>
      </aside>
    </div>
  );
}
