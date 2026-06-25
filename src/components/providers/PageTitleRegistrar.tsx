"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { hrefKey, rememberPageTitle } from "@/lib/page-title-cache";

/** Remember each page's h1 (and hero description) for accurate route transitions. */
export function PageTitleRegistrar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const key = hrefKey(`${pathname}${searchParams.size ? `?${searchParams.toString()}` : ""}`);
    const main = document.getElementById("main-content");
    if (!main) return;

    const h1 = main.querySelector("h1");
    if (!h1) return;
    const title = h1.textContent?.trim();
    if (!title) return;

    const heroBlock = h1.closest("section, header") ?? h1.parentElement;
    const description = heroBlock?.querySelector("p.text-body-lg, p.hero-dot-text-muted");
    const subtitle = description?.textContent?.trim();

    rememberPageTitle(key, title, subtitle && subtitle !== title ? subtitle : undefined);
  }, [pathname, searchParams]);

  return null;
}
