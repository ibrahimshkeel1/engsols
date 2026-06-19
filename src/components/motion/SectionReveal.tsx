"use client";

import { AnimateIn } from "@/components/motion/AnimateIn";

export function SectionReveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <AnimateIn className={className} delay={delay}>
      {children}
    </AnimateIn>
  );
}
