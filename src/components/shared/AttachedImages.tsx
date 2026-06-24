import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  urls: string[];
  className?: string;
};

export function AttachedImages({ urls, className }: Props) {
  if (!urls.length) return null;

  return (
    <div className={cn("mt-4 flex flex-wrap gap-3", className)}>
      {urls.map((url, index) => (
        <a
          key={url}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="relative block h-48 w-72 overflow-hidden rounded-xl border border-border bg-muted"
        >
          <Image
            src={url}
            alt={`Attached image ${index + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 288px"
            unoptimized
          />
        </a>
      ))}
    </div>
  );
}
