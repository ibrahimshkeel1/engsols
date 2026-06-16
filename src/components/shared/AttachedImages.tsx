import { cn } from "@/lib/utils";

type Props = {
  urls: string[];
  className?: string;
};

export function AttachedImages({ urls, className }: Props) {
  if (!urls.length) return null;

  return (
    <div className={cn("mt-4 flex flex-wrap gap-3", className)}>
      {urls.map((url) => (
        <a
          key={url}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="block overflow-hidden rounded-xl border border-border bg-muted"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="" className="max-h-64 max-w-full object-cover" />
        </a>
      ))}
    </div>
  );
}
