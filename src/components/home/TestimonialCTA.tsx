import Link from "next/link";
import { Star } from "lucide-react";
import { AnimateIn } from "@/components/motion/AnimateIn";

export function TestimonialCTA() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <AnimateIn>
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-xl shadow-accent/5">
            <div className="grid lg:grid-cols-2">
              <div className="flex flex-col justify-center p-10 sm:p-14">
                <div className="flex gap-0.5 text-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <blockquote className="font-display mt-6 text-2xl leading-snug tracking-tight sm:text-3xl">
                  &ldquo;James helped me structure my first Eclipse model and gave honest feedback on my portfolio. I landed an internship within 2 months.&rdquo;
                </blockquote>
                <p className="mt-6 text-sm text-muted-foreground">
                  — Liam T., Graduate Engineer · now at a major operator
                </p>
              </div>
              <div className="flex flex-col items-start justify-center gap-6 bg-gradient-to-br from-muted/80 to-muted/40 p-10 sm:p-14">
                <div>
                  <h3 className="text-xl font-semibold">Ready to start?</h3>
                  <p className="mt-2 text-muted-foreground">
                    Join engineers getting real guidance — not generic career advice.
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
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
