import { Skeleton } from "@/components/ui/skeleton";

export function ForumSkeletonList({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-4 overflow-hidden rounded-2xl border border-border p-5">
          <Skeleton className="hidden h-12 w-12 shrink-0 rounded-full sm:block" />
          <div className="min-w-0 flex-1 space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-3/4 max-w-md" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
