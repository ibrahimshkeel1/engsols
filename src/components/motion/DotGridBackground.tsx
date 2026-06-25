"use client";

import { useRef, type ReactNode } from "react";
import { DotGrid, type DotGridHandle } from "@/components/motion/DotGrid";
import { DOT_GRID_COLORS, DOT_GRID_DEFAULTS } from "@/lib/dot-grid-theme";
import { usePrefersReducedMotion } from "@/lib/motion";
import { useIsClient, useMediaQuery } from "@/lib/use-is-client";
import { cn } from "@/lib/utils";

type DotGridBackgroundProps = {
  children: ReactNode;
  className?: string;
  sectionClassName?: string;
  id?: string;
};

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
  const mounted = useIsClient();
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reducedMotion = usePrefersReducedMotion();
  const interactive = mounted && canHover;
  const enablePush = interactive && !reducedMotion;

  const colors = DOT_GRID_COLORS;

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
          activeColorAlt={colors.activeColorAlt}
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
