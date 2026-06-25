import Image from "next/image";
import { resolvePortraitUrl } from "@/lib/mentor-portrait";
import { cn } from "@/lib/utils";

type MentorPortraitProps = {
  name: string;
  src?: string | null;
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
        className={cn("object-cover object-top", imageClassName)}
      />
    </div>
  );
}
