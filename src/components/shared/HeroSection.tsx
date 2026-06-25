import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type HeroSectionProps = {
  children: ReactNode;
  className?: string;
};

/** Flat page hero — speckle from page shell shows through. */
export function HeroSection({ children, className }: HeroSectionProps) {
  return (
    <section className={cn("page-hero relative overflow-hidden bg-bg-main", className)}>
      <div className="page-hero__content relative">{children}</div>
    </section>
  );
}
