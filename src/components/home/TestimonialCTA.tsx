import Link from "next/link";
import { AnimateIn } from "@/components/motion/AnimateIn";

export function TestimonialCTA() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <AnimateIn>
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="flex flex-col items-start justify-center gap-6 bg-primary/5 p-10 sm:p-14 lg:max-w-2xl">
              <div>
                <h3 className="font-display text-2xl sm:text-3xl">Ready to start?</h3>
                <p className="mt-3 text-muted-foreground">
                  Join engineers getting real guidance from professionals who have done the work — not generic career advice.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/mentors"
                  className="inline-flex h-11 items-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Find a mentor
                </Link>
                <Link
                  href="/apply"
                  className="inline-flex h-11 items-center rounded-lg border border-border bg-card px-6 text-sm font-medium transition-colors hover:bg-muted"
                >
                  Become a mentor
                </Link>
              </div>
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
