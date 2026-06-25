"use client";

import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
  useMemo,
  type CSSProperties,
} from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import "./DotGrid.css";

type Dot = {
  cx: number;
  cy: number;
  xOffset: number;
  yOffset: number;
  _inertiaApplied: boolean;
};

export type DotGridHandle = {
  handlePointerMove: (clientX: number, clientY: number) => void;
  handlePointerLeave: () => void;
  handlePointerClick: (clientX: number, clientY: number) => void;
};

type DotGridProps = {
  dotSize?: number;
  gap?: number;
  baseColor?: string;
  activeColor?: string;
  baseOpacity?: number;
  proximity?: number;
  speedTrigger?: number;
  shockRadius?: number;
  shockStrength?: number;
  maxSpeed?: number;
  returnDuration?: number;
  className?: string;
  style?: CSSProperties;
  eventRoot?: React.RefObject<HTMLElement | null>;
  trackPointer?: boolean;
  enablePush?: boolean;
  disabled?: boolean;
};

function hexToRgb(hex: string) {
  const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!m) return { r: 0, g: 0, b: 0 };
  return {
    r: parseInt(m[1], 16),
    g: parseInt(m[2], 16),
    b: parseInt(m[3], 16),
  };
}

function pushDot(
  dot: Dot,
  pushX: number,
  pushY: number,
  returnDuration: number,
) {
  gsap.killTweensOf(dot);
  dot._inertiaApplied = true;
  gsap.to(dot, {
    xOffset: pushX,
    yOffset: pushY,
    duration: 0.3,
    ease: "power2.out",
    onComplete: () => {
      gsap.to(dot, {
        xOffset: 0,
        yOffset: 0,
        duration: returnDuration,
        ease: "elastic.out(1,0.75)",
        onComplete: () => {
          dot._inertiaApplied = false;
        },
      });
    },
  });
}

export const DotGrid = forwardRef<DotGridHandle, DotGridProps>(function DotGrid(
  {
    dotSize = 16,
    gap = 32,
    baseColor = "#5227FF",
    activeColor = "#5227FF",
    baseOpacity = 0.55,
    proximity = 150,
    speedTrigger = 20,
    shockRadius = 250,
    shockStrength = 5,
    maxSpeed = 5000,
    returnDuration = 1.5,
    className = "",
    style,
    eventRoot,
    trackPointer = true,
    enablePush = true,
    disabled = false,
  },
  ref,
) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const isVisibleRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const pointerRef = useRef({
    x: -9999,
    y: -9999,
    vx: 0,
    vy: 0,
    speed: 0,
    lastTime: 0,
    lastX: 0,
    lastY: 0,
  });

  const baseRgb = useMemo(() => hexToRgb(baseColor), [baseColor]);
  const activeRgb = useMemo(() => hexToRgb(activeColor), [activeColor]);

  const circlePath = useMemo(() => {
    if (typeof window === "undefined" || !window.Path2D) return null;
    const p = new window.Path2D();
    p.arc(0, 0, dotSize / 2, 0, Math.PI * 2);
    return p;
  }, [dotSize]);

  const hasMotion = useCallback(() => {
    return dotsRef.current.some(
      (dot) =>
        dot._inertiaApplied ||
        Math.abs(dot.xOffset) > 0.01 ||
        Math.abs(dot.yOffset) > 0.01,
    );
  }, []);

  const stopLoop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx || !circlePath) return;

    const { width, height } = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, width, height);

    const { x: px, y: py } = pointerRef.current;
    const proxSq = proximity * proximity;

    for (const dot of dotsRef.current) {
      const ox = dot.cx + dot.xOffset;
      const oy = dot.cy + dot.yOffset;
      const dx = ox - px;
      const dy = oy - py;
      const dsq = dx * dx + dy * dy;

      let fill = baseColor;
      let alpha = baseOpacity;
      if (trackPointer && dsq <= proxSq) {
        const dist = Math.sqrt(dsq);
        const t = 1 - dist / proximity;
        const r = Math.round(baseRgb.r + (activeRgb.r - baseRgb.r) * t);
        const g = Math.round(baseRgb.g + (activeRgb.g - baseRgb.g) * t);
        const b = Math.round(baseRgb.b + (activeRgb.b - baseRgb.b) * t);
        fill = `rgb(${r},${g},${b})`;
        alpha = baseOpacity + (1 - baseOpacity) * t;
      }

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(ox, oy);
      ctx.fillStyle = fill;
      ctx.fill(circlePath);
      ctx.restore();
    }
  }, [
    activeRgb,
    baseColor,
    baseOpacity,
    baseRgb,
    circlePath,
    proximity,
    trackPointer,
  ]);

  const tick = useCallback(() => {
    if (!isVisibleRef.current) {
      rafRef.current = null;
      return;
    }

    drawFrame();

    if (enablePush && hasMotion()) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      rafRef.current = null;
    }
  }, [drawFrame, enablePush, hasMotion]);

  const startLoop = useCallback(() => {
    if (!isVisibleRef.current || rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const requestRedraw = useCallback(() => {
    if (!isVisibleRef.current) return;
    if (enablePush && hasMotion()) {
      startLoop();
      return;
    }
    drawFrame();
  }, [drawFrame, enablePush, hasMotion, startLoop]);

  const toLocalCoords = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  }, []);

  const applyPushFromPointer = useCallback(
    (x: number, y: number, vx: number, vy: number, speed: number) => {
      if (!enablePush) return;
      let pushed = false;
      for (const dot of dotsRef.current) {
        const dist = Math.hypot(dot.cx - x, dot.cy - y);
        if (speed > speedTrigger && dist < proximity && !dot._inertiaApplied) {
          pushDot(dot, dot.cx - x + vx * 0.01, dot.cy - y + vy * 0.01, returnDuration);
          pushed = true;
        }
      }
      if (pushed) startLoop();
    },
    [enablePush, proximity, returnDuration, speedTrigger, startLoop],
  );

  const applyClickShock = useCallback(
    (x: number, y: number) => {
      if (!enablePush) return;
      let pushed = false;
      for (const dot of dotsRef.current) {
        const dist = Math.hypot(dot.cx - x, dot.cy - y);
        if (dist < shockRadius && !dot._inertiaApplied) {
          const falloff = Math.max(0, 1 - dist / shockRadius);
          pushDot(
            dot,
            (dot.cx - x) * shockStrength * falloff,
            (dot.cy - y) * shockStrength * falloff,
            returnDuration,
          );
          pushed = true;
        }
      }
      if (pushed) startLoop();
    },
    [enablePush, returnDuration, shockRadius, shockStrength, startLoop],
  );

  useImperativeHandle(
    ref,
    () => ({
      handlePointerMove(clientX, clientY) {
        const local = toLocalCoords(clientX, clientY);
        if (!local) return;

        const now = performance.now();
        const pr = pointerRef.current;
        const dt = pr.lastTime ? now - pr.lastTime : 16;
        const dx = clientX - pr.lastX;
        const dy = clientY - pr.lastY;
        let vx = (dx / dt) * 1000;
        let vy = (dy / dt) * 1000;
        let speed = Math.hypot(vx, vy);
        if (speed > maxSpeed) {
          const scale = maxSpeed / speed;
          vx *= scale;
          vy *= scale;
          speed = maxSpeed;
        }
        pr.lastTime = now;
        pr.lastX = clientX;
        pr.lastY = clientY;
        pr.vx = vx;
        pr.vy = vy;
        pr.speed = speed;
        pr.x = local.x;
        pr.y = local.y;

        applyPushFromPointer(local.x, local.y, vx, vy, speed);
        requestRedraw();
      },
      handlePointerLeave() {
        pointerRef.current.x = -9999;
        pointerRef.current.y = -9999;
        requestRedraw();
      },
      handlePointerClick(clientX, clientY) {
        const local = toLocalCoords(clientX, clientY);
        if (!local) return;
        applyClickShock(local.x, local.y);
      },
    }),
    [applyClickShock, applyPushFromPointer, maxSpeed, requestRedraw, toLocalCoords],
  );

  const buildGrid = useCallback(() => {
    const wrap = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const sizeEl = eventRoot?.current ?? wrap;
    const { width, height } = sizeEl.getBoundingClientRect();
    if (width < 1 || height < 1) return;

    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cols = Math.floor((width + gap) / (dotSize + gap));
    const rows = Math.floor((height + gap) / (dotSize + gap));
    const cell = dotSize + gap;
    const gridW = cell * cols - gap;
    const gridH = cell * rows - gap;
    const startX = (width - gridW) / 2 + dotSize / 2;
    const startY = (height - gridH) / 2 + dotSize / 2;

    const dots: Dot[] = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        dots.push({
          cx: startX + x * cell,
          cy: startY + y * cell,
          xOffset: 0,
          yOffset: 0,
          _inertiaApplied: false,
        });
      }
    }
    dotsRef.current = dots;
    requestRedraw();
  }, [dotSize, gap, eventRoot, requestRedraw]);

  useLayoutEffect(() => {
    buildGrid();
  }, [buildGrid]);

  useEffect(() => {
    if (!circlePath || disabled) return;

    const wrap = wrapperRef.current;
    if (!wrap) return;

    const io = new IntersectionObserver(([entry]) => {
      isVisibleRef.current = entry?.isIntersecting ?? false;
      if (isVisibleRef.current) {
        requestRedraw();
      } else {
        stopLoop();
      }
    }, { threshold: 0 });

    io.observe(wrap);
    return () => {
      io.disconnect();
      stopLoop();
    };
  }, [circlePath, disabled, requestRedraw, stopLoop]);

  useEffect(() => {
    if (!circlePath || disabled) return;
    requestRedraw();
  }, [
    baseColor,
    baseOpacity,
    baseRgb,
    activeRgb,
    circlePath,
    disabled,
    proximity,
    requestRedraw,
    trackPointer,
  ]);

  useEffect(() => {
    buildGrid();
    const raf = requestAnimationFrame(buildGrid);

    let ro: ResizeObserver | null = null;
    const sizeEl = eventRoot?.current ?? wrapperRef.current;
    if (sizeEl && "ResizeObserver" in window) {
      ro = new ResizeObserver(buildGrid);
      ro.observe(sizeEl);
    } else {
      window.addEventListener("resize", buildGrid);
    }
    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
      window.removeEventListener("resize", buildGrid);
    };
  }, [buildGrid, eventRoot]);

  return (
    <div className={cn("dot-grid", className)} style={style} aria-hidden>
      <div ref={wrapperRef} className="dot-grid__wrap">
        <canvas ref={canvasRef} className="dot-grid__canvas" />
      </div>
    </div>
  );
});

export default DotGrid;
