"use client";

import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { getNavHoverStyleForPath } from "@/lib/nav-hover-colors";

/** Sets --route-accent on <html> from the current menu route (matches BubbleMenu hover). */
export function RouteAccentProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const accent = getNavHoverStyleForPath(pathname);

    if (accent) {
      root.style.setProperty("--route-accent", accent.bgColor);
      root.style.setProperty("--route-accent-on", accent.textColor);
      root.dataset.routeAccent = "true";
    } else {
      root.style.removeProperty("--route-accent");
      root.style.removeProperty("--route-accent-on");
      delete root.dataset.routeAccent;
    }

    return () => {
      root.style.removeProperty("--route-accent");
      root.style.removeProperty("--route-accent-on");
      delete root.dataset.routeAccent;
    };
  }, [pathname]);

  return children;
}
