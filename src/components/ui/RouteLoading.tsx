"use client";

import { usePathname } from "next/navigation";
import { renderSkeletonForPath } from "@/components/ui/PageSkeletons";

export function RouteLoading() {
  const pathname = usePathname();
  return renderSkeletonForPath(pathname);
}
