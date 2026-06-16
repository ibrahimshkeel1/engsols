import Link from "next/link";
import { AnimateIn } from "@/components/motion/AnimateIn";

export function TestimonialCTA() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <AnimateIn>
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-xl shadow-accent/5">
            <div className="flex flex-col items-start justify-center gap-6 p-10 sm:p-14 lg:max-w-2xl">
              <div>
                <h3 className="text-2xl font-display tracking-tight sm:text-3xl">Ready to start?</h3>
                <p className="mt-3 text-muted-foreground">
                  Join engineers getting real guidance from professionals who have done the work — not generic career advice.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/mentors"
                  className="inline-flex h-12 items-center rounded-xl bg-accent px-8 text-sm font-semibold text-accent-foreground shadow-md shadow-accent/25 transition-all hover:brightness-110 active:scale-95"
                >
                  Find a mentor
                </Link>
                <Link
                  href="/apply"
                  className="inline-flex h-12 items-center rounded-xl border border-border bg-card px-8 text-sm font-semibold transition-all hover:bg-muted active:scale-95"
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
