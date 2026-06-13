import { cn } from "@/lib/utils";
import { getDisciplineColors } from "@/lib/discipline-colors";

type AvatarProps = {
  name: string;
  discipline?: string;
  size?: "sm" | "md" | "lg" | "xl";
  src?: string | null;
  className?: string;
};

const sizes = {
  sm: "h-9 w-9 text-xs",
  md: "h-12 w-12 text-sm",
  lg: "h-16 w-16 text-lg",
  xl: "h-24 w-24 text-2xl",
};

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Avatar({ name, discipline, size = "md", src, className }: AvatarProps) {
  const colors = discipline ? getDisciplineColors(discipline) : null;

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        className={cn("rounded-xl object-cover ring-2 ring-border", sizes[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl font-semibold ring-2 ring-border",
        colors?.bg ?? "bg-muted",
        colors?.text ?? "text-foreground",
        sizes[size],
        className,
      )}
      aria-hidden
    >
      {initials(name)}
    </div>
  );
}
