import { BENTO_GRID_CLASS, getBentoSpanClass } from "@/lib/bento-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function ProfileCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "grid h-full min-h-0 grid-rows-[minmax(0,1fr)_auto] overflow-hidden rounded-2xl border border-border bg-surface shadow-premium-card",
        className,
      )}
      aria-hidden
    >
      <Skeleton className="h-full w-full rounded-none" />
      <div className="space-y-2 border-t border-border/60 px-3 py-3">
        <Skeleton className="mx-auto h-4 w-3/5" />
        <Skeleton className="mx-auto h-3 w-full" />
        <Skeleton className="mx-auto h-3 w-2/5" />
      </div>
    </div>
  );
}

export function BentoDirectorySkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className={BENTO_GRID_CLASS}>
      {Array.from({ length: count }).map((_, i) => (
        <ProfileCardSkeleton
          key={i}
          className={cn("h-full", getBentoSpanClass(i), i === 0 && "min-h-[16rem]")}
        />
      ))}
    </div>
  );
}

export function FilterBarSkeleton({ selects = 2 }: { selects?: number }) {
  return (
    <div className="flex flex-wrap gap-3" aria-hidden>
      <Skeleton className="h-10 w-full max-w-xs rounded-xl" />
      {Array.from({ length: selects }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-36 rounded-xl" />
      ))}
    </div>
  );
}

export function HeroActionSkeleton({ count = 1 }: { count?: number }) {
  return (
    <div className="flex shrink-0 flex-wrap gap-3" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-11 w-36 rounded-xl" />
      ))}
    </div>
  );
}

export function CompanyCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-premium-card" aria-hidden>
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

export function JobCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-5 shadow-premium-card" aria-hidden>
      <Skeleton className="absolute left-0 top-0 h-full w-1 rounded-none" />
      <div className="space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function JobListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <JobCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function CertificationCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-premium-card" aria-hidden>
      <Skeleton className="h-5 w-20 rounded-full" />
      <Skeleton className="mt-3 h-5 w-16" />
      <Skeleton className="mt-2 h-4 w-full" />
      <Skeleton className="mt-2 h-3 w-full" />
      <Skeleton className="mt-2 h-3 w-5/6" />
      <Skeleton className="mt-3 h-3 w-2/5" />
      <Skeleton className="mt-1 h-3 w-1/3" />
    </div>
  );
}

export function CertificationGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <CertificationCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function VideoCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-premium-card" aria-hidden>
      <Skeleton className="aspect-video w-full rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-5 w-3/4" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}

export function VideoGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <VideoCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ForumThreadCardSkeleton() {
  return (
    <div className="relative flex overflow-hidden rounded-2xl border border-border bg-surface shadow-premium-card" aria-hidden>
      <Skeleton className="w-1 shrink-0 rounded-none" />
      <div className="flex min-w-0 flex-1 gap-4 p-5 ps-4">
        <Skeleton className="hidden h-12 w-12 shrink-0 rounded-full sm:block" />
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-6 w-3/4 max-w-md" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex flex-wrap gap-2 pt-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ForumThreadListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <ForumThreadCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function MentorFiltersSidebarSkeleton() {
  return (
    <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start" aria-hidden>
      <div className="flex flex-col gap-4 rounded-2xl border border-border-custom bg-bg-surface p-5 shadow-premium-card">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-[42px] w-full rounded-xl" />
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-2xl border border-border-custom bg-bg-surface p-5 shadow-premium-card">
        <Skeleton className="h-4 w-28" />
        <div className="mt-3 flex flex-wrap gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-16 rounded-full" />
          ))}
        </div>
      </div>
      <Skeleton className="mt-4 hidden h-4 w-40 lg:block" />
    </aside>
  );
}

export function MentorsDirectorySkeleton() {
  return (
    <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-10">
      <MentorFiltersSidebarSkeleton />
      <div>
        <Skeleton className="mb-6 h-4 w-32 lg:hidden" />
        <BentoDirectorySkeletonGrid count={8} />
      </div>
    </div>
  );
}

export function LiveTabSkeleton() {
  return (
    <div className="flex flex-wrap gap-2" aria-hidden>
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-11 w-24 rounded-xl" />
      ))}
    </div>
  );
}

export function NewsHeroBannerSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-premium-card" aria-hidden>
      <Skeleton className="aspect-[21/9] w-full rounded-none" />
      <div className="space-y-4 p-6 sm:p-10">
        <div className="flex gap-3">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-10 w-full max-w-2xl sm:h-12" />
        <Skeleton className="h-4 w-full max-w-xl" />
        <Skeleton className="h-4 w-5/6 max-w-lg" />
        <div className="flex gap-4 pt-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  );
}

export function NewsArticleCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface" aria-hidden>
      <Skeleton className="aspect-video w-full rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-2/5" />
      </div>
    </div>
  );
}

export function NewsArticleGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <NewsArticleCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function NewsDisciplineFilterSkeleton() {
  return (
    <div
      className="sticky top-16 z-20 -mx-4 border-b border-border-custom bg-bg-main/90 px-4 py-3 sm:-mx-6 sm:px-6 lg:top-20"
      aria-hidden
    >
      <div className="flex gap-2 overflow-x-auto">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-24 shrink-0 rounded-full" />
        ))}
      </div>
    </div>
  );
}

export function ListingCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-premium-card" aria-hidden>
      <Skeleton className="aspect-[16/10] w-full rounded-none" />
      <div className="space-y-2 p-5">
        <Skeleton className="h-5 w-20 rounded-md" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-4 w-2/5" />
      </div>
    </div>
  );
}

export function ListingGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <ListingCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function TalentCardSkeleton() {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-surface p-5 shadow-premium-card" aria-hidden>
      <div className="flex items-start gap-4">
        <Skeleton className="h-14 w-14 shrink-0 rounded-xl" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
      <Skeleton className="mt-4 h-3 w-full" />
      <Skeleton className="mt-2 h-3 w-5/6" />
      <div className="mt-4 flex flex-wrap gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-16 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export function TalentPipelineSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6" aria-hidden>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-9 w-72 max-w-full" />
          <Skeleton className="h-4 w-full max-w-2xl" />
        </div>
        <Skeleton className="h-10 w-40 rounded-xl" />
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-surface p-5 lg:p-6">
        <Skeleton className="h-4 w-32" />
        <div className="mt-4 flex flex-wrap gap-3">
          <Skeleton className="h-9 w-40 rounded-lg" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-lg" />
          ))}
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-3 w-24" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 4 }).map((_, j) => (
                  <Skeleton key={j} className="h-7 w-16 rounded-lg" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Skeleton className="mt-6 h-4 w-48" />
      <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <TalentCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function RoadmapDashboardSkeleton() {
  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,340px)_1fr]" aria-hidden>
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-premium-card">
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
          <div key={i} className="rounded-2xl border border-border bg-surface p-5 shadow-premium-card">
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

/** @deprecated Use page-level skeletons from PageSkeletons instead. */
export function PageHeaderSkeleton({ lines = 2 }: { lines?: number }) {
  return (
    <div className="space-y-3" aria-hidden>
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-9 w-64 max-w-full" />
      {lines > 1 && <Skeleton className="h-4 w-96 max-w-full" />}
    </div>
  );
}

export function DirectoryCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex min-h-[9rem] overflow-hidden rounded-xl border border-border bg-surface p-4 ps-5 shadow-premium-card sm:p-5 sm:ps-6",
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
