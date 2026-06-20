import { PageHeaderSkeleton } from "@/components/ui/DirectorySkeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function NewsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
      <div className="border-b border-border py-12">
        <PageHeaderSkeleton lines={2} />
      </div>
      <div className="mt-6 h-12 animate-pulse rounded-xl bg-muted" />
      <div className="mt-8 space-y-6">
        <Skeleton className="aspect-[21/9] w-full rounded-2xl" />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-72 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
