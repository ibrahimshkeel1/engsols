import { cn } from "@/lib/utils";
import { speckleBackgroundStyle } from "@/lib/speckle-texture";

/**
 * Page shell with repeating speckle tile — scrolls with content (not fixed wallpaper).
 */
export function SpeckleSurface({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("speckle-surface", className)} style={speckleBackgroundStyle}>
      {children}
    </div>
  );
}
