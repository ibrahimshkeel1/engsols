"use client";

import { useEffect, useRef, useState } from "react";
import {
  createBallpit,
  isWebGLSupported,
  type BallpitOptions,
} from "@/components/motion/ballpit/create-ballpit";
import { cn } from "@/lib/utils";

export type BallpitProps = Partial<BallpitOptions> & {
  className?: string;
  followCursor?: boolean;
};

function hasLayoutSize(element: HTMLElement | null) {
  if (!element) return false;
  const { width, height } = element.getBoundingClientRect();
  return width >= 2 && height >= 2;
}

export function Ballpit({
  className,
  followCursor = true,
  count = 200,
  gravity = 0.55,
  friction = 0.9975,
  wallBounce = 0.95,
  colors = [0x00ff88, 0xff00aa, 0x00e5ff],
  ambientIntensity,
  lightIntensity,
  minSize,
  maxSize,
  maxVelocity,
}: BallpitProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const colorsKey = colors.join(",");

  useEffect(() => {
    if (!isWebGLSupported()) {
      setFailed(true);
      return;
    }
    if (failed) return;

    const root = rootRef.current;
    if (!root) return;

    // Fresh canvas per effect run — required for React Strict Mode remounts.
    const canvas = document.createElement("canvas");
    canvas.className = "block h-full w-full";
    canvas.setAttribute("aria-hidden", "true");
    root.appendChild(canvas);

    let disposed = false;
    let resizeObserver: ResizeObserver | null = null;
    let instance: ReturnType<typeof createBallpit> | null = null;

    const cleanup = () => {
      instance?.dispose();
      instance = null;
      if (canvas.parentElement === root) {
        root.removeChild(canvas);
      }
    };

    const init = () => {
      if (disposed || instance || !hasLayoutSize(root)) return false;

      try {
        instance = createBallpit(canvas, {
          followCursor,
          count,
          gravity,
          friction,
          wallBounce,
          colors,
          ambientIntensity,
          lightIntensity,
          minSize,
          maxSize,
          maxVelocity,
        });
        resizeObserver?.disconnect();
        resizeObserver = null;
        return true;
      } catch (error) {
        console.error("[Ballpit] failed to initialize", error);
        cleanup();
        setFailed(true);
        return true;
      }
    };

    const scheduleInit = () => {
      if (init()) return;
      resizeObserver = new ResizeObserver(() => init());
      resizeObserver.observe(root);
    };

    scheduleInit();
    requestAnimationFrame(scheduleInit);

    return () => {
      disposed = true;
      resizeObserver?.disconnect();
      cleanup();
    };
  }, [
    ambientIntensity,
    colorsKey,
    count,
    failed,
    followCursor,
    friction,
    gravity,
    lightIntensity,
    maxSize,
    maxVelocity,
    minSize,
    wallBounce,
  ]);

  if (failed) return null;

  return <div ref={rootRef} className={cn("absolute inset-0", className)} />;
}

export default Ballpit;
