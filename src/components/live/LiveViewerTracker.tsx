"use client";

import { useEffect } from "react";
import { incrementLiveViewer } from "@/actions/forum";

export function LiveViewerTracker({ slug }: { slug: string }) {
  useEffect(() => {
    incrementLiveViewer(slug);
  }, [slug]);
  return null;
}
