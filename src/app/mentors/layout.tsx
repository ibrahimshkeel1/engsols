import { Suspense } from "react";

import { MentorsDirectorySkeleton } from "@/components/ui/DirectorySkeletons";

export default function MentorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl bg-background px-4 py-12 sm:px-6">
          <MentorsDirectorySkeleton />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
