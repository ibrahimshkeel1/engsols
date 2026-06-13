"use client";

import { Play } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type MockMediaPlayerProps = {
  thumbnail: string;
  title: string;
  duration?: string;
  live?: boolean;
  className?: string;
};

export function MockMediaPlayer({
  thumbnail,
  title,
  duration,
  live,
  className,
}: MockMediaPlayerProps) {
  return (
    <button
      type="button"
      onClick={() => toast.info("Playback is coming soon!")}
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
        <span className="absolute left-3 top-3 rounded bg-red-600 px-2 py-0.5 text-xs font-medium text-white">
          LIVE
        </span>
      )}
    </button>
  );
}
