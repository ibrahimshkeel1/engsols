"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { darkSpeckleBackgroundStyle } from "@/lib/speckle-texture";
import { SiteMenu } from "@/components/layout/SiteMenu";

export { navLinks } from "@/lib/site-nav";

export function NavbarShell({
  children,
  menuFooter,
  showForYou = false,
}: {
  children: React.ReactNode;
  menuFooter?: ReactNode;
  showForYou?: boolean;
}) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn("nav-shell sticky top-0 z-50", scrolled && "nav-shell-scrolled")}
      style={darkSpeckleBackgroundStyle}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6">
        <SiteMenu showForYou={showForYou} footer={menuFooter} trailing={children} />
      </div>
    </header>
  );
}
