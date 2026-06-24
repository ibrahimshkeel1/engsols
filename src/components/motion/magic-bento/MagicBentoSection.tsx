"use client";

import { useRef, type ReactNode } from "react";
import "./MagicBento.css";
import {
  DEFAULT_GLOW_COLOR,
  DEFAULT_PARTICLE_COUNT,
  DEFAULT_SPOTLIGHT_RADIUS,
} from "@/components/motion/magic-bento/constants";
import { MagicBentoSpotlight } from "@/components/motion/magic-bento/MagicBentoSpotlight";
import { useMobileDetection } from "@/components/motion/magic-bento/useMobileDetection";
import { usePrefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type MagicBentoSectionProps = {
  children: ReactNode;
  className?: string;
  enableSpotlight?: boolean;
  disableAnimations?: boolean;
  spotlightRadius?: number;
  particleCount?: number;
  glowColor?: string;
};

export function MagicBentoSection({
  children,
  className,
  enableSpotlight = true,
  disableAnimations = false,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  glowColor = DEFAULT_GLOW_COLOR,
}: MagicBentoSectionProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobileDetection();
  const reducedMotion = usePrefersReducedMotion();
  const shouldDisableAnimations = disableAnimations || isMobile || reducedMotion;

  return (
    <div className={cn("bento-section", className)}>
      {enableSpotlight && (
        <MagicBentoSpotlight
          gridRef={gridRef}
          disableAnimations={shouldDisableAnimations}
          enabled={enableSpotlight}
          spotlightRadius={spotlightRadius}
          glowColor={glowColor}
        />
      )}
      <div ref={gridRef}>{children}</div>
    </div>
  );
}

export { MagicBentoCard, type MagicBentoCardProps } from "@/components/motion/magic-bento/MagicBentoCard";
export {
  DEFAULT_GLOW_COLOR,
  DEFAULT_PARTICLE_COUNT,
  DEFAULT_SPOTLIGHT_RADIUS,
} from "@/components/motion/magic-bento/constants";

/** Shared card effect defaults matching React Bits MagicBento usage. */
export const MAGIC_BENTO_CARD_DEFAULTS = {
  enableStars: true,
  enableBorderGlow: true,
  enableTilt: true,
  enableMagnetism: true,
  clickEffect: true,
  particleCount: DEFAULT_PARTICLE_COUNT,
  glowColor: DEFAULT_GLOW_COLOR,
} as const;
