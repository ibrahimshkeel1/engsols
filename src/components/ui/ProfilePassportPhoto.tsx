import { getDisciplineColors } from "@/lib/discipline-colors";
import { resolvePortraitUrl } from "@/lib/mentor-portrait";
import { cn } from "@/lib/utils";

import { portraitObjectPositionStyle } from "@/lib/portrait-position";

type ProfilePassportPhotoProps = {
  name: string;
  discipline?: string;
  src?: string | null;
  focusY?: number | null;
  className?: string;
};

/** MentorCruise-style portrait — face-forward crop, always shows a photo. */
export function ProfilePassportPhoto({
  name,
  discipline,
  src,
  focusY,
  className,
}: ProfilePassportPhotoProps) {
  const colors = discipline ? getDisciplineColors(discipline) : null;
  const photo = resolvePortraitUrl(name, src, "mentor", 640);

  return (
    <div className={cn("relative min-h-[12rem] w-full overflow-hidden bg-muted sm:min-h-[14rem]", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo}
        alt={name}
        className="h-full w-full object-cover"
        style={portraitObjectPositionStyle(focusY)}
        loading="lazy"
      />
      {!src && colors && (
        <div
          className={cn("pointer-events-none absolute inset-x-0 bottom-0 h-1", colors.bg)}
          aria-hidden
        />
      )}
    </div>
  );
}
