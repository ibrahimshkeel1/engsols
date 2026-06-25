import { cn } from "@/lib/utils";
import { resolvePortraitUrl } from "@/lib/mentor-portrait";

type AvatarProps = {
  name: string;
  discipline?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  src?: string | null;
  className?: string;
  variant?: "mentor" | "mentee";
};

const sizes = {
  sm: "h-9 w-9 text-xs",
  md: "h-12 w-12 text-sm",
  lg: "h-16 w-16 text-lg",
  xl: "h-24 w-24 text-2xl",
  "2xl": "h-32 w-32 text-3xl",
};

export function Avatar({
  name,
  discipline,
  size = "md",
  src,
  className,
  variant = "mentor",
}: AvatarProps) {
  const photo = resolvePortraitUrl(name, src, variant, size === "2xl" ? 512 : 256);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={photo}
      alt={name}
      className={cn("shrink-0 rounded-xl object-cover object-top ring-2 ring-border", sizes[size], className)}
    />
  );
}
