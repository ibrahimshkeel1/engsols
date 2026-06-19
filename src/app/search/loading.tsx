import { Skeleton } from "@/components/ui/skeleton";

export default function SearchLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Skeleton className="h-10 w-full rounded-xl" />
      <div className="mt-8 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-4">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="mt-3 h-3 w-full" />
            <Skeleton className="mt-2 h-3 w-4/5" />
          </div>
        ))}
      </div>
    </div>
  );
}
