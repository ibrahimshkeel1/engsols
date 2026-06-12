import { Suspense } from "react";

export default function JobsLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div className="py-12 text-center text-slate-500">Loading jobs...</div>}>{children}</Suspense>;
}
