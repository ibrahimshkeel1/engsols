import { PROFILE_GRID_CLASS } from "@/lib/bento-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function ProfileCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-surface shadow-premium-card",
        className,
      )}
      aria-hidden
    >
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="space-y-2 border-t border-border/60 p-4">
        <Skeleton className="mx-auto h-4 w-3/5" />
        <Skeleton className="mx-auto h-3 w-full" />
        <Skeleton className="mx-auto h-3 w-2/5" />
      </div>
    </div>
  );
}

export function DirectoryCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex min-h-[9rem] overflow-hidden rounded-xl border border-border bg-surface p-4 ps-5 shadow-premium-card transition-colors duration-300 sm:p-5 sm:ps-6",
        className,
      )}
      aria-hidden
    >
      <Skeleton className="absolute start-0 top-0 h-full w-1 rounded-none bg-accent/20" />
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <div className="flex items-start gap-3">
          <Skeleton className="h-12 w-12 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="h-3 w-2/5" />
          </div>
        </div>
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <div className="mt-auto flex items-center justify-between pt-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function BentoDirectorySkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className={PROFILE_GRID_CLASS}>
      {Array.from({ length: count }).map((_, i) => (
        <ProfileCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function CompanyCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-premium-card transition-colors duration-300" aria-hidden>
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 shrink-0 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="mt-4 h-3 w-full" />
      <Skeleton className="mt-2 h-3 w-5/6" />
      <Skeleton className="mt-3 h-3 w-2/5" />
    </div>
  );
}

export function CompanyGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <CompanyCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function RoadmapDashboardSkeleton() {
  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,340px)_1fr]" aria-hidden>
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-premium-card transition-colors duration-300">
        <Skeleton className="h-5 w-36" />
        <div className="mt-5 space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-5 w-32" />
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border bg-surface p-5 shadow-premium-card transition-colors duration-300">
            <div className="flex items-center justify-between gap-3">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="mt-4 h-2 w-full rounded-full" />
            <div className="mt-4 space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LiveRoomSkeleton() {
  return (
    <div className="flex h-[calc(100dvh-2rem)] min-h-0 flex-col gap-3" aria-hidden>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-7 w-48" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-28 rounded-xl" />
          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>
      </div>
      <Skeleton className="min-h-0 flex-1 rounded-2xl" />
      <Skeleton className="h-[100px] max-h-[24dvh] shrink-0 rounded-2xl lg:hidden" />
    </div>
  );
}

export function PageHeaderSkeleton({ lines = 2 }: { lines?: number }) {
  return (
    <div className="space-y-3" aria-hidden>
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-9 w-64 max-w-full" />
      {lines > 1 && <Skeleton className="h-4 w-96 max-w-full" />}
    </div>
  );
}
