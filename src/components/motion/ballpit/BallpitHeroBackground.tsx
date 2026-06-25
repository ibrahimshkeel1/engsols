"use client";

import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
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
  const { resolvedTheme } = useTheme();
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();
  const colors = getBallpitColorsForPath(pathname);
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className={cn("ballpit-hero relative overflow-hidden !bg-transparent", className)}>
      {mounted && (
        <div
          className="ballpit-hero-canvas pointer-events-none absolute inset-0 z-0"
          aria-hidden
        >
          <BallpitErrorBoundary>
            <Ballpit
              count={isMobile ? 80 : 130}
              gravity={0.55}
              friction={0.9975}
              wallBounce={0.95}
              followCursor={!reducedMotion}
              colors={colors}
              lightIntensity={isDark ? 120 : 140}
              minSize={0.4}
              maxSize={0.9}
              maxVelocity={0.12}
            />
          </BallpitErrorBoundary>
        </div>
      )}
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-background/92 via-background/78 to-background/94 dark:from-background/50 dark:via-background/28 dark:to-background/42"
        aria-hidden
      />
      <div className="relative z-10">
        <div
          className="ballpit-hero-read-panel pointer-events-none absolute inset-0"
          aria-hidden
        />
        <div className="ballpit-hero-copy relative">{children}</div>
      </div>
    </section>
  );
}
