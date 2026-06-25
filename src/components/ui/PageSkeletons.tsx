import type { ReactElement } from "react";
import { HeroSection } from "@/components/shared/HeroSection";
import {
  BentoDirectorySkeletonGrid,
  CertificationGridSkeleton,
  CompanyGridSkeleton,
  FilterBarSkeleton,
  ForumThreadListSkeleton,
  HeroActionSkeleton,
  JobListSkeleton,
  LiveTabSkeleton,
  MentorsDirectorySkeleton,
  NewsArticleGridSkeleton,
  NewsHeroBannerSkeleton,
  VideoGridSkeleton,
  ListingGridSkeleton,
} from "@/components/ui/DirectorySkeletons";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type HeroVariant = "default" | "forum" | "live" | "editorial";

export function PageHeroSkeleton({
  variant = "default",
  actionCount = 0,
}: {
  variant?: HeroVariant;
  actionCount?: number;
}) {
  const action = actionCount > 0 ? <HeroActionSkeleton count={actionCount} /> : null;

  if (variant === "live") {
    return (
      <HeroSection className="border-b border-border">
        <div className="page-container-wide flex flex-col justify-between gap-6 py-20 sm:flex-row sm:items-end">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-2 w-2 rounded-full" />
              <Skeleton className="h-3 w-28" />
            </div>
            <Skeleton className="h-10 w-72 max-w-full sm:h-12" />
            <Skeleton className="h-4 w-full max-w-2xl" />
          </div>
          {action}
        </div>
      </HeroSection>
    );
  }

  if (variant === "forum") {
    return (
      <HeroSection className="border-b border-border">
        <div className="page-container-wide py-20">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-2 h-10 w-80 max-w-full sm:h-12" />
          <Skeleton className="mt-4 h-4 w-full max-w-2xl" />
          {action && <div className="mt-8">{action}</div>}
        </div>
      </HeroSection>
    );
  }

  if (variant === "editorial") {
    return (
      <HeroSection className="border-b border-border">
        <div className="page-container-wide py-20">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="mt-2 h-10 w-96 max-w-full sm:h-12" />
          <Skeleton className="mt-5 h-4 w-full max-w-2xl" />
        </div>
      </HeroSection>
    );
  }

  return (
    <HeroSection className="border-b border-border">
      <div className="page-container-wide flex flex-col justify-between gap-6 py-20 sm:flex-row sm:items-end">
        <div className="space-y-3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-10 w-80 max-w-full sm:h-12" />
          <Skeleton className="h-4 w-full max-w-2xl" />
        </div>
        {action}
      </div>
    </HeroSection>
  );
}

export function ListPageSkeleton({
  heroVariant = "default",
  actionCount = 0,
  filterSelects = 2,
  children,
  className,
}: {
  heroVariant?: HeroVariant;
  actionCount?: number;
  filterSelects?: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <>
      <PageHeroSkeleton variant={heroVariant} actionCount={actionCount} />
      <div className={cn("page-container-wide bg-background py-12 pb-24 lg:pb-12", className)}>
        <FilterBarSkeleton selects={filterSelects} />
        <div className="mt-8">{children}</div>
      </div>
    </>
  );
}

export function HomePageSkeleton() {
  return (
    <>
      <section className="hero-dark relative overflow-hidden border-b border-border/60">
        <div className="page-container-wide py-24 sm:py-28 lg:py-36">
          <div className="mx-auto max-w-2xl space-y-6 text-center">
            <Skeleton className="mx-auto h-12 w-full max-w-lg" />
            <Skeleton className="mx-auto h-5 w-full max-w-xl" />
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Skeleton className="h-12 w-full max-w-[12rem] rounded-xl" />
              <Skeleton className="h-12 w-full max-w-[12rem] rounded-xl" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border/60">
        <div className="page-container-wide py-5">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 sm:gap-x-12">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-24" />
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border/60 bg-bg-main/80 py-20 lg:py-28">
        <div className="page-container mx-auto max-w-2xl space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </section>

      <section className="border-b border-border/60 bg-bg-main/60 py-20 lg:py-28">
        <div className="page-container-wide mx-auto max-w-4xl">
          <Skeleton className="h-8 w-40" />
          <div className="mt-8 grid gap-8 md:grid-cols-2 md:gap-12">
            <div className="space-y-3">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Skeleton className="h-12 w-44 rounded-xl" />
            <Skeleton className="h-4 w-56" />
          </div>
        </div>
      </section>

      <section className="border-b border-border/60 bg-muted/25 py-20 lg:py-28">
        <div className="page-container-wide">
          <div className="mx-auto max-w-2xl space-y-3 text-center">
            <Skeleton className="mx-auto h-9 w-56" />
            <Skeleton className="mx-auto h-4 w-full max-w-lg" />
          </div>
          <div className="mx-auto mt-10 max-w-7xl">
            <BentoDirectorySkeletonGrid count={6} />
          </div>
          <div className="mt-10 flex justify-center">
            <Skeleton className="h-12 w-44 rounded-xl" />
          </div>
        </div>
      </section>

      <section className="border-b border-border/60 py-10 lg:py-12">
        <div className="page-container-wide">
          <Skeleton className="h-3 w-28" />
          <div className="mt-4 divide-y divide-border/60">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-48" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export function MentorsPageSkeleton() {
  return (
    <>
      <PageHeroSkeleton variant="default" />
      <div className="mx-auto max-w-7xl bg-background px-4 py-12 sm:px-6">
        <MentorsDirectorySkeleton />
      </div>
    </>
  );
}

export function PortfoliosPageSkeleton() {
  return (
    <ListPageSkeleton actionCount={1}>
      <BentoDirectorySkeletonGrid count={6} />
    </ListPageSkeleton>
  );
}

export function JobsPageSkeleton() {
  return (
    <ListPageSkeleton actionCount={2} filterSelects={3}>
      <JobListSkeleton count={6} />
    </ListPageSkeleton>
  );
}

export function ForumPageSkeleton() {
  return (
    <>
      <PageHeroSkeleton variant="forum" actionCount={1} />
      <div className="page-container-wide bg-background py-12">
        <FilterBarSkeleton selects={2} />
        <div className="mt-8">
          <ForumThreadListSkeleton count={5} />
        </div>
      </div>
    </>
  );
}

export function LivePageSkeleton() {
  return (
    <>
      <PageHeroSkeleton variant="live" actionCount={1} />
      <div className="page-container-wide bg-background py-12">
        <LiveTabSkeleton />
        <div className="mt-8">
          <VideoGridSkeleton count={6} />
        </div>
      </div>
    </>
  );
}

export function NewsPageSkeleton() {
  return (
    <>
      <PageHeroSkeleton variant="editorial" />
      <div className="mx-auto max-w-7xl bg-background px-4 pb-16 sm:px-6">
        <Skeleton className="h-12 w-full rounded-xl" />
        <div className="mt-8 space-y-10">
          <NewsHeroBannerSkeleton />
          <div>
            <Skeleton className="h-6 w-36" />
            <Skeleton className="mt-2 h-4 w-56" />
            <div className="mt-6">
              <NewsArticleGridSkeleton count={6} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function CompaniesPageSkeleton() {
  return (
    <ListPageSkeleton actionCount={1} filterSelects={1}>
      <CompanyGridSkeleton count={6} />
    </ListPageSkeleton>
  );
}

export function CertificationsPageSkeleton() {
  return (
    <ListPageSkeleton>
      <CertificationGridSkeleton count={6} />
    </ListPageSkeleton>
  );
}

export function VideosPageSkeleton() {
  return (
    <ListPageSkeleton filterSelects={1}>
      <VideoGridSkeleton count={6} />
    </ListPageSkeleton>
  );
}

export function MarketplacePageSkeleton() {
  return (
    <>
      <PageHeroSkeleton actionCount={1} />
      <div className="page-container-wide bg-background py-12 pb-24 lg:pb-12">
        <div className="flex flex-wrap gap-2" aria-hidden>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-xl" />
          ))}
        </div>
        <div className="mt-4">
          <FilterBarSkeleton selects={1} />
        </div>
        <div className="mt-8">
          <ListingGridSkeleton count={6} />
        </div>
      </div>
    </>
  );
}

export function ForYouPageSkeleton() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <Skeleton className="h-3 w-32" />
      <Skeleton className="mt-2 h-9 w-48" />
      <Skeleton className="mt-2 h-4 w-72 max-w-full" />

      {[
        { title: "w-44", body: "h-32" },
        { title: "w-36", body: "grid-cols-3" },
        { title: "w-40", body: "list" },
        { title: "w-32", body: "list" },
        { title: "w-36", body: "list" },
        { title: "w-32", body: "grid-cols-3" },
      ].map((section, i) => (
        <section key={i} className="mt-10">
          <Skeleton className={cn("h-5", section.title)} />
          <Skeleton className="mt-2 h-4 w-64 max-w-full" />
          {section.body === "h-32" ? (
            <Skeleton className="mt-4 h-32 w-full rounded-2xl" />
          ) : section.body === "grid-cols-3" ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, j) => (
                <Skeleton key={j} className="h-28 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {Array.from({ length: 2 }).map((_, j) => (
                <Skeleton key={j} className="h-20 rounded-xl" />
              ))}
            </div>
          )}
        </section>
      ))}

      <Skeleton className="mt-12 h-32 w-full rounded-2xl" />
    </div>
  );
}

export function SearchPageSkeleton() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Skeleton className="h-9 w-56" />
      <Skeleton className="mt-2 h-4 w-full max-w-md" />
      <Skeleton className="mt-8 h-12 w-full rounded-xl" />
      <div className="mt-8 space-y-8">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="h-4 w-24" />
            <div className="mt-3 space-y-3">
              {Array.from({ length: 2 }).map((_, j) => (
                <div key={j} className="rounded-xl border border-border bg-surface p-4 shadow-premium-card">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="mt-3 h-3 w-full" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SettingsPageSkeleton() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6" aria-hidden>
      <Skeleton className="h-9 w-56" />
      <Skeleton className="mt-2 h-4 w-80 max-w-full" />

      {[
        { sections: 3, border: "border-zone-recruiter/15" },
        { sections: 1, border: "" },
        { sections: 1, border: "border-zone-mentorship/15" },
        { sections: 1, border: "" },
        { sections: 1, border: "" },
        { sections: 1, border: "" },
        { sections: 1, border: "" },
      ].map((card, i) => (
        <div
          key={i}
          className={cn(
            "mt-8 rounded-2xl border border-border bg-surface p-6 shadow-premium-card",
            card.border,
          )}
        >
          <Skeleton className="h-5 w-40" />
          <Skeleton className="mt-2 h-4 w-full max-w-sm" />
          <div className="mt-4 space-y-4">
            {Array.from({ length: card.sections }).map((_, j) => (
              <Skeleton key={j} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function MentorDashboardSkeleton() {
  return (
    <div aria-hidden>
      <Skeleton className="h-3 w-28" />
      <Skeleton className="mt-3 h-8 w-52" />
      <Skeleton className="mt-2 h-4 w-72 max-w-full" />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-zone-mentorship/15 bg-surface p-6 shadow-premium-card">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-4 h-8 w-16" />
            <Skeleton className="mt-2 h-3 w-28" />
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-premium-card">
          <Skeleton className="h-5 w-32" />
          <div className="mt-4 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full max-w-xs" />
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-primary/30 bg-surface p-6 shadow-premium-card">
          <Skeleton className="h-5 w-44" />
          <Skeleton className="mt-2 h-4 w-full" />
          <Skeleton className="mt-4 h-4 w-36" />
        </div>
      </div>
    </div>
  );
}

export function GenericPageSkeleton() {
  return (
    <>
      <PageHeroSkeleton />
      <div className="page-container-wide bg-background py-12 pb-24 lg:pb-12">
        <FilterBarSkeleton selects={2} />
        <div className="mt-8">
          <BentoDirectorySkeletonGrid count={6} />
        </div>
      </div>
    </>
  );
}

export function DisciplinesPageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6" aria-hidden>
      <Skeleton className="h-3 w-28" />
      <Skeleton className="mt-2 h-9 w-80 max-w-full" />
      <Skeleton className="mt-3 h-4 w-full max-w-2xl" />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-border bg-surface p-5 shadow-premium-card">
            <Skeleton className="h-1 w-full rounded-none" />
            <Skeleton className="mt-4 h-5 w-3/4" />
            <Skeleton className="mt-2 h-4 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function AssistPageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6" aria-hidden>
      <Skeleton className="h-9 w-56" />
      <Skeleton className="mt-2 h-4 w-full max-w-2xl" />
      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-premium-card">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="mt-4 h-24 w-full rounded-xl" />
          </div>
          <BentoDirectorySkeletonGrid count={4} />
        </div>
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-premium-card">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="mt-4 h-64 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function HowItWorksPageSkeleton() {
  return (
    <>
      <PageHeroSkeleton />
      <div className="page-container-wide py-16 lg:py-20">
        <div className="space-y-16">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "grid items-center gap-10 lg:grid-cols-2",
                i % 2 === 1 && "lg:[&>*:first-child]:order-2",
              )}
            >
              <div className="space-y-4">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-8 w-full max-w-md" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export function PrivacyPageSkeleton() {
  return (
    <>
      <PageHeroSkeleton />
      <div className="page-container-wide py-16 lg:py-20">
        <Skeleton className="h-4 w-40" />
        <div className="mt-10 max-w-3xl space-y-12">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function DetailSectionSkeleton({ lines = 4 }: { lines?: number }) {
  return (
    <section className="space-y-4">
      <Skeleton className="h-7 w-40" />
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
    </section>
  );
}

function SidebarCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-premium-card">
      <Skeleton className="h-5 w-36" />
      <Skeleton className="mt-2 h-4 w-full" />
      <Skeleton className="mt-4 h-32 w-full rounded-xl" />
    </div>
  );
}

export function MentorProfilePageSkeleton() {
  return (
    <div className="pb-24 lg:pb-12" aria-hidden>
      <section className="border-b border-border/60 bg-background">
        <div className="page-container-wide py-8 sm:py-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0 flex-1 space-y-3">
              <Skeleton className="h-10 w-64 max-w-full sm:h-12" />
              <Skeleton className="h-5 w-80 max-w-full" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-56" />
            </div>
            <div className="flex flex-col items-center gap-4 lg:items-end">
              <Skeleton className="h-32 w-32 rounded-2xl" />
              <Skeleton className="h-12 w-full rounded-xl sm:w-56" />
              <Skeleton className="h-12 w-full rounded-xl sm:w-56" />
            </div>
          </div>
        </div>
      </section>
      <div className="page-container-wide mx-auto max-w-3xl space-y-16 py-12 sm:space-y-20 sm:py-16">
        <DetailSectionSkeleton lines={4} />
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-premium-card">
          <Skeleton className="h-6 w-44" />
          <Skeleton className="mt-4 h-40 w-full rounded-xl" />
        </div>
        <DetailSectionSkeleton lines={4} />
        <DetailSectionSkeleton lines={3} />
        <DetailSectionSkeleton lines={3} />
        <Skeleton className="h-14 w-full rounded-lg" />
        <div className="border-t border-border/60 pt-12 text-center">
          <Skeleton className="mx-auto h-8 w-72 max-w-full" />
          <Skeleton className="mx-auto mt-6 h-12 w-44 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function PortfolioProfilePageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 pb-24 sm:px-6 lg:pb-12" aria-hidden>
      <div className="grid gap-10 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <div className="flex items-start gap-6 sm:gap-8">
            <Skeleton className="h-28 w-28 shrink-0 rounded-2xl sm:h-32 sm:w-32" />
            <div className="min-w-0 flex-1 space-y-3">
              <div className="flex gap-2">
                <Skeleton className="h-5 w-24 rounded-md" />
                <Skeleton className="h-5 w-28 rounded-md" />
              </div>
              <Skeleton className="h-9 w-64 max-w-full sm:h-10" />
              <Skeleton className="h-5 w-80 max-w-full" />
              <Skeleton className="h-4 w-56" />
              <div className="flex gap-2 pt-1">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-md" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-16 rounded-md" />
            ))}
          </div>
          <div>
            <Skeleton className="h-7 w-28" />
            <div className="mt-4 space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-border bg-surface p-5 shadow-premium-card">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="mt-2 h-4 w-full" />
                  <Skeleton className="mt-3 h-4 w-3/4" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <div className="sticky top-24 rounded-2xl border border-border bg-surface p-6 shadow-premium-card">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="mt-2 h-4 w-full" />
            <Skeleton className="mt-4 h-48 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ForumThreadPageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6" aria-hidden>
      <div className="grid gap-10 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="flex gap-2">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <Skeleton className="h-9 w-full max-w-2xl" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-16 rounded-full" />
            ))}
          </div>
          <div className="space-y-3 pt-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-border bg-surface p-5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="mt-3 h-4 w-full" />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <SidebarCardSkeleton />
          <SidebarCardSkeleton />
        </div>
      </div>
    </div>
  );
}

export function JobDetailPageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 pb-24 sm:px-6 lg:pb-12" aria-hidden>
      <div className="grid gap-10 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-20 rounded-md" />
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-md" />
          </div>
          <Skeleton className="h-9 w-full max-w-xl" />
          <Skeleton className="h-5 w-64" />
          <Skeleton className="h-6 w-40" />
          <div className="space-y-2 pt-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
          <DetailSectionSkeleton lines={4} />
        </div>
        <div className="space-y-6">
          <SidebarCardSkeleton />
          <SidebarCardSkeleton />
        </div>
      </div>
    </div>
  );
}

export function NewsArticleDetailPageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl bg-bg-main px-4 py-0 sm:px-6" aria-hidden>
      <div className="grid gap-10 lg:grid-cols-3 lg:gap-12">
        <article className="lg:col-span-2">
          <Skeleton className="aspect-[21/9] w-full rounded-2xl" />
          <div className="space-y-4 border-b border-border-custom py-12 sm:py-16">
            <Skeleton className="h-4 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <Skeleton className="h-10 w-full max-w-3xl sm:h-12" />
            <Skeleton className="h-5 w-full max-w-2xl" />
            <div className="flex gap-4">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="space-y-3 py-12">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </article>
        <div className="py-8 lg:sticky lg:top-24 lg:self-start lg:py-12">
          <SidebarCardSkeleton />
        </div>
      </div>
    </div>
  );
}

export function LiveSessionDetailPageSkeleton() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 pb-24 sm:px-6 lg:pb-12" aria-hidden>
      <Skeleton className="aspect-video w-full rounded-2xl" />
      <div className="mt-8 space-y-4">
        <div className="flex gap-2">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-md" />
        </div>
        <Skeleton className="h-9 w-full max-w-2xl" />
        <Skeleton className="h-4 w-32" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-32 rounded-xl" />
          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>
        <div className="mt-4 rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
        </div>
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </div>
  );
}

export function DisciplineHubPageSkeleton() {
  return (
    <div aria-hidden>
      <section className="hero-dark relative overflow-hidden border-b border-border/60">
        <Skeleton className="absolute inset-x-0 top-0 h-1 w-full rounded-none" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="mt-2 h-10 w-64 max-w-full" />
          <Skeleton className="mt-3 h-4 w-full max-w-2xl" />
          <div className="mt-6 flex flex-wrap gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-32 rounded-full" />
            ))}
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="space-y-12 lg:col-span-2">
            <div>
              <Skeleton className="h-6 w-24" />
              <div className="mt-6">
                <BentoDirectorySkeletonGrid count={4} />
              </div>
            </div>
            <div>
              <Skeleton className="h-6 w-20" />
              <div className="mt-4 space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-xl" />
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <SidebarCardSkeleton />
            <SidebarCardSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CompanyDetailPageSkeleton() {
  return (
    <div className="py-12" aria-hidden>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-start gap-6">
          <Skeleton className="h-20 w-20 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-28 rounded-full" />
            <Skeleton className="h-9 w-64 max-w-full" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-56" />
          </div>
        </div>
        <div className="mt-6 space-y-2">
          <Skeleton className="h-4 w-full max-w-3xl" />
          <Skeleton className="h-4 w-5/6 max-w-2xl" />
        </div>
        <div className="mt-4 flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-20 rounded-full" />
          ))}
        </div>
        <Skeleton className="mt-10 h-7 w-40" />
        <div className="mt-4 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function CertificationDetailPageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 pb-24 sm:px-6 lg:pb-12" aria-hidden>
      <div className="grid gap-10 lg:grid-cols-3 lg:items-start">
        <div className="space-y-8 lg:col-span-2">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-9 w-full max-w-xl" />
          <Skeleton className="h-5 w-64" />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
          <Skeleton className="h-7 w-40" />
          <BentoDirectorySkeletonGrid count={3} />
        </div>
        <div className="space-y-6">
          <SidebarCardSkeleton />
          <SidebarCardSkeleton />
        </div>
      </div>
    </div>
  );
}

export function MarketplaceListingDetailPageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 pb-24 sm:px-6 lg:pb-12" aria-hidden>
      <div className="grid gap-10 lg:grid-cols-2">
        <Skeleton className="aspect-[16/10] w-full rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-24 rounded-md" />
          <Skeleton className="h-9 w-full max-w-lg" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-48" />
          <div className="space-y-2 pt-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
          <Skeleton className="mt-4 h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function VideoDetailPageSkeleton() {
  return (
    <div className="py-12" aria-hidden>
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Skeleton className="aspect-video w-full rounded-2xl" />
        <div className="mt-8 space-y-4">
          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-16 rounded-full" />
            ))}
          </div>
          <Skeleton className="h-9 w-full max-w-2xl" />
          <Skeleton className="h-4 w-32" />
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
        <div className="mt-12">
          <Skeleton className="h-6 w-32" />
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="aspect-video rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function renderSkeletonForPath(pathname: string): ReactElement {
  if (pathname === "/") return <HomePageSkeleton />;
  if (pathname === "/mentors") return <MentorsPageSkeleton />;
  if (pathname === "/portfolios") return <PortfoliosPageSkeleton />;
  if (pathname === "/jobs") return <JobsPageSkeleton />;
  if (pathname === "/forum") return <ForumPageSkeleton />;
  if (pathname === "/live") return <LivePageSkeleton />;
  if (pathname === "/news") return <NewsPageSkeleton />;
  if (pathname === "/companies") return <CompaniesPageSkeleton />;
  if (pathname === "/certifications") return <CertificationsPageSkeleton />;
  if (pathname === "/videos") return <VideosPageSkeleton />;
  if (pathname === "/for-you") return <ForYouPageSkeleton />;
  if (pathname === "/search") return <SearchPageSkeleton />;
  if (pathname === "/settings") return <SettingsPageSkeleton />;
  if (pathname === "/marketplace") return <MarketplacePageSkeleton />;
  if (pathname === "/disciplines") return <DisciplinesPageSkeleton />;
  if (pathname === "/assist") return <AssistPageSkeleton />;
  if (pathname === "/how-it-works") return <HowItWorksPageSkeleton />;
  if (pathname === "/privacy") return <PrivacyPageSkeleton />;

  if (pathname.startsWith("/mentors/") && pathname !== "/mentors/compare") {
    return <MentorProfilePageSkeleton />;
  }
  if (pathname.startsWith("/portfolios/")) return <PortfolioProfilePageSkeleton />;
  if (pathname.startsWith("/forum/")) return <ForumThreadPageSkeleton />;
  if (pathname.startsWith("/jobs/")) return <JobDetailPageSkeleton />;
  if (pathname.startsWith("/news/")) return <NewsArticleDetailPageSkeleton />;
  if (pathname.startsWith("/live/") && !pathname.endsWith("/room")) {
    return <LiveSessionDetailPageSkeleton />;
  }
  if (pathname.startsWith("/disciplines/")) return <DisciplineHubPageSkeleton />;
  if (pathname.startsWith("/companies/")) return <CompanyDetailPageSkeleton />;
  if (pathname.startsWith("/certifications/")) return <CertificationDetailPageSkeleton />;
  if (pathname.startsWith("/marketplace/")) return <MarketplaceListingDetailPageSkeleton />;
  if (pathname.startsWith("/videos/")) return <VideoDetailPageSkeleton />;
  if (pathname.startsWith("/mentor/")) return <MentorDashboardSkeleton />;
  if (pathname.startsWith("/settings/")) return <SettingsPageSkeleton />;

  return <GenericPageSkeleton />;
}
