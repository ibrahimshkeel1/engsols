import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";

type ProfilePassportPhotoProps = {
  name: string;
  discipline?: string;
  src?: string | null;
  className?: string;
};

/** 35×45mm passport-style portrait (7:9 ratio). */
export function ProfilePassportPhoto({
  name,
  discipline,
  src,
  className,
}: ProfilePassportPhotoProps) {
  return (
    <div
      className={cn(
        "relative aspect-[35/45] w-[5.625rem] shrink-0 overflow-hidden rounded-md border border-border-custom bg-muted shadow-sm sm:w-24",
        className,
      )}
    >
      <Avatar
        name={name}
        discipline={discipline}
        size="xl"
        src={src}
        className="h-full w-full rounded-none object-cover ring-0"
      />
    </div>
  );
}
