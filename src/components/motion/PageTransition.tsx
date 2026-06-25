"use client";

import { usePathname } from "next/navigation";
import { usePrefersReducedMotion } from "@/lib/motion";
import { shouldSkipPageTransition } from "@/lib/page-titles";
import { useNavigationTransition } from "@/components/providers/NavigationTransitionProvider";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reducedMotion = usePrefersReducedMotion();
  const { isTransitioning } = useNavigationTransition();

  if (isTransitioning || shouldSkipPageTransition(pathname) || reducedMotion) {
    return <>{children}</>;
  }

  return <>{children}</>;
}
