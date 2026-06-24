"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useTheme } from "next-themes";
import { DotGrid, type DotGridHandle } from "@/components/motion/DotGrid";
import { DOT_GRID_DEFAULTS, DOT_GRID_THEME } from "@/lib/dot-grid-theme";
import { usePrefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

type DotGridBackgroundProps = {
  children: ReactNode;
  className?: string;
  sectionClassName?: string;
  id?: string;
};

function useCanHover() {
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanHover(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return canHover;
}

/**
 * Section wrapper with themed DotGrid canvas behind content.
 */
export function DotGridBackground({
  children,
  className,
  sectionClassName,
  id,
}: DotGridBackgroundProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<DotGridHandle>(null);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const canHover = useCanHover();
  const reducedMotion = usePrefersReducedMotion();
  const interactive = mounted && canHover;
  const enablePush = interactive && !reducedMotion;

  useEffect(() => {
    setMounted(true);
  }, []);

  const colors =
    resolvedTheme === "dark" ? DOT_GRID_THEME.dark : DOT_GRID_THEME.light;

  return (
    <section
      ref={sectionRef}
      id={id}
      className={cn("relative overflow-hidden", sectionClassName, className)}
      onPointerMove={(e) => {
        if (!interactive) return;
        gridRef.current?.handlePointerMove(e.clientX, e.clientY);
      }}
      onPointerLeave={() => {
        gridRef.current?.handlePointerLeave();
      }}
      onPointerDown={(e) => {
        if (!enablePush) return;
        gridRef.current?.handlePointerClick(e.clientX, e.clientY);
      }}
    >
      {mounted && (
        <DotGrid
          ref={gridRef}
          className="z-0"
          eventRoot={sectionRef}
          trackPointer={interactive}
          enablePush={enablePush}
          baseColor={colors.baseColor}
          activeColor={colors.activeColor}
          baseOpacity={DOT_GRID_DEFAULTS.baseOpacity}
          dotSize={DOT_GRID_DEFAULTS.dotSize}
          gap={DOT_GRID_DEFAULTS.gap}
          proximity={DOT_GRID_DEFAULTS.proximity}
          shockRadius={DOT_GRID_DEFAULTS.shockRadius}
          shockStrength={DOT_GRID_DEFAULTS.shockStrength}
          returnDuration={DOT_GRID_DEFAULTS.returnDuration}
        />
      )}
      <div className="relative z-10">{children}</div>
    </section>
  );
}
