import { getDisciplineColors } from "@/lib/discipline-colors";
import { cn } from "@/lib/utils";

type ProfilePassportPhotoProps = {
  name: string;
  discipline?: string;
  src?: string | null;
  className?: string;
};

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/** Fills the card photo area and shows the full image without cropping. */
export function ProfilePassportPhoto({
  name,
  discipline,
  src,
  className,
}: ProfilePassportPhotoProps) {
  const colors = discipline ? getDisciplineColors(discipline) : null;

  return (
    <div className={cn("relative h-full w-full overflow-hidden bg-muted", className)}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          className="h-full w-full object-contain object-center"
        />
      ) : (
        <div
          className={cn(
            "flex h-full w-full items-center justify-center text-2xl font-semibold sm:text-3xl",
            colors?.bg ?? "bg-muted",
            colors?.text ?? "text-foreground",
          )}
          aria-hidden
        >
          {initials(name)}
        </div>
      )}
    </div>
  );
}
