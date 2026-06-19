import { BENTO_GRID_CLASS, getBentoSpanClass } from "@/lib/bento-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function BentoSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className={BENTO_GRID_CLASS}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={cn("min-h-[9rem] overflow-hidden rounded-xl border border-border", getBentoSpanClass(i), i === 0 && "min-h-[16rem]")}>
          <Skeleton className="h-full w-full rounded-xl" />
        </div>
      ))}
    </div>
  );
}
