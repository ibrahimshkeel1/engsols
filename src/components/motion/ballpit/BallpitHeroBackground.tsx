"use client";

import { usePathname } from "next/navigation";
import { Component, useEffect, useState, type ReactNode } from "react";
import { Ballpit } from "@/components/motion/ballpit/Ballpit";
import { getBallpitColorsForPath } from "@/lib/ballpit-theme";
import { usePrefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

type BallpitHeroBackgroundProps = {
  children: ReactNode;
  className?: string;
};

class BallpitErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

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

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isMobile;
}

/**
 * Hero section wrapper with Ballpit canvas behind content.
 * Ball colors match the BubbleMenu hover color for the current route.
 */
export function BallpitHeroBackground({ children, className }: BallpitHeroBackgroundProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const canHover = useCanHover();
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();
  const colors = getBallpitColorsForPath(pathname);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className={cn("relative overflow-hidden !bg-transparent", className)}>
      {mounted && (
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
          <BallpitErrorBoundary>
            <Ballpit
              count={isMobile ? 80 : 130}
              gravity={0.55}
              friction={0.9975}
              wallBounce={0.95}
              followCursor={canHover && !reducedMotion}
              colors={colors}
              lightIntensity={140}
              minSize={0.4}
              maxSize={0.9}
              maxVelocity={0.12}
            />
          </BallpitErrorBoundary>
        </div>
      )}
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-background/92 via-background/78 to-background/94"
        aria-hidden
      />
      <div className="relative z-10">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background/88 via-background/72 to-transparent"
          aria-hidden
        />
        <div className="relative [&_.section-label]:drop-shadow-sm [&_.text-body-lg]:text-text-main [&_.text-display-xl]:text-text-main [&_h1]:drop-shadow-sm [&_p]:text-text-main/90 [&_p]:drop-shadow-sm">
          {children}
        </div>
      </div>
    </section>
  );
}
