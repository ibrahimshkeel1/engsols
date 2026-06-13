import { Suspense } from "react";

export default function JobsLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div className="py-12 text-center text-muted-foreground">Loading jobs...</div>}>{children}</Suspense>;
}
