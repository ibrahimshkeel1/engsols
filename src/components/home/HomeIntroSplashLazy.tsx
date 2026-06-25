"use client";

import dynamic from "next/dynamic";

export const HomeIntroSplash = dynamic(
  () => import("@/components/home/HomeIntroSplash").then((m) => m.HomeIntroSplash),
  { ssr: false },
);
