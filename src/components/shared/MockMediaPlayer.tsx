"use client";

import { Play } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type MediaPlayerProps = {
  thumbnail: string;
  title: string;
  duration?: string;
  live?: boolean;
  videoUrl?: string | null;
  className?: string;
};

export function MediaPlayer({
  thumbnail,
  title,
  duration,
  live,
  videoUrl,
  className,
}: MediaPlayerProps) {
  if (videoUrl) {
    return (
      <div className={cn("relative aspect-video w-full overflow-hidden rounded-xl bg-black", className)}>
        <video src={videoUrl} controls className="h-full w-full" title={title} />
        {duration && (
          <span className="absolute bottom-3 right-3 rounded bg-black/70 px-2 py-0.5 text-xs text-white pointer-events-none">
            {duration}
          </span>
        )}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => toast.info("Video URL not set yet. Admins can add one in Admin → Videos.")}
      className={cn(
        "group relative aspect-video w-full overflow-hidden rounded-xl bg-foreground",
        className,
      )}
    >
      <Image src={thumbnail} alt={title} fill className="object-cover opacity-80" unoptimized />
      <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition group-hover:bg-black/40">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-foreground shadow-lg">
          <Play className="h-8 w-8 fill-current" />
        </div>
      </div>
      {duration && (
        <span className="absolute bottom-3 right-3 rounded bg-black/70 px-2 py-0.5 text-xs text-white">
          {duration}
        </span>
      )}
      {live && (
        <span className="absolute left-3 top-3 rounded bg-zone-live px-2 py-0.5 text-xs font-medium text-white dark:text-bg-main">
          LIVE
        </span>
      )}
    </button>
  );
}

// Backward-compatible export
export const MockMediaPlayer = MediaPlayer;
