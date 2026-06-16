import { Star } from "lucide-react";

type Props = {
  rating: number;
  reviewCount: number;
  size?: "sm" | "md";
};

export function MentorRating({ rating, reviewCount, size = "md" }: Props) {
  if (reviewCount === 0) {
    return <span className="text-xs text-muted-foreground">No reviews yet</span>;
  }

  const starClass = size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5";
  const textClass = size === "sm" ? "text-xs" : "text-sm";

  return (
    <div className={`flex items-center gap-1.5 text-accent ${textClass}`}>
      <Star className={`${starClass} fill-current`} />
      <span className="font-semibold">{rating.toFixed(1)}</span>
      <span className="text-muted-foreground">({reviewCount})</span>
    </div>
  );
}
