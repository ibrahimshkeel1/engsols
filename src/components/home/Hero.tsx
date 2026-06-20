"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/motion";
import { ButtonLink } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

function MotionWrap({
  children,
  custom,
  reducedMotion,
  className,
}: {
  children: React.ReactNode;
  custom: number;
  reducedMotion: boolean;
  className?: string;
}) {
  if (reducedMotion) return <div className={className}>{children}</div>;
  return (
    <motion.div custom={custom} initial="hidden" animate="visible" variants={fadeUp} className={className}>
      {children}
    </motion.div>
  );
}

export function Hero() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section className="hero-zone-mentorship relative overflow-hidden">
      <div className="bg-grid absolute inset-0 opacity-15" />

      <div className="page-container-wide relative py-20 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:max-w-xl lg:text-start">
          <MotionWrap custom={0} reducedMotion={reducedMotion} className="section-label opacity-70">
            For engineers building serious careers
          </MotionWrap>
          <MotionWrap custom={1} reducedMotion={reducedMotion} className="text-display-xl mt-5">
            The career platform to get mentored, certified, and hired
          </MotionWrap>
          <MotionWrap custom={2} reducedMotion={reducedMotion} className="text-body-lg mx-auto mt-5 max-w-lg lg:mx-0">
            EngSols unifies mentorship, exam prep, portfolios, and community — so you move forward with clarity, not scattered tools.
          </MotionWrap>

          <MotionWrap
            custom={3}
            reducedMotion={reducedMotion}
            className="mt-10 flex flex-col items-center gap-3 sm:flex-row lg:items-start"
          >
            <ButtonLink href="/mentors" size="lg" className="group w-full sm:w-auto">
              Find a mentor
              <ArrowRight className="h-4 w-4 transition-transform duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5" />
            </ButtonLink>
            <ButtonLink href="#how-it-works" variant="ghost" size="lg" className="w-full sm:w-auto">
              How it works
            </ButtonLink>
          </MotionWrap>
        </div>
      </div>
    </section>
  );
}
