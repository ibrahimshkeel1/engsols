import Image from "next/image";
import { resolvePortraitUrl } from "@/lib/mentor-portrait";
import { portraitObjectPositionStyle } from "@/lib/portrait-position";
import { cn } from "@/lib/utils";

type MentorPortraitProps = {
  name: string;
  src?: string | null;
  focusY?: number | null;
  alt?: string;
  variant?: "mentor" | "mentee";
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  sizes?: string;
};

export function MentorPortrait({
  name,
  src,
  focusY,
  alt,
  variant = "mentor",
  priority = false,
  className,
  imageClassName,
  sizes = "(max-width: 768px) 50vw, 240px",
}: MentorPortraitProps) {
  const url = resolvePortraitUrl(name, src, variant);

  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      <Image
        src={url}
        alt={alt ?? name}
        fill
        priority={priority}
        sizes={sizes}
        className={cn("object-cover", imageClassName)}
        style={portraitObjectPositionStyle(focusY)}
      />
    </div>
  );
}
