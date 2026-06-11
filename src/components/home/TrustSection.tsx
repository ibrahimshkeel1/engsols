import { trustTestimonial } from "@/data/testimonials";

export function TrustSection() {
  return (
    <section className="bg-amber-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              No strings attached, free trial, fully vetted
            </h2>
            <p className="mt-4 text-slate-600">
              Try your first call for free with every mentor you meet. Cancel anytime, no questions asked.
            </p>
          </div>
          <blockquote className="rounded-xl border border-amber-200 bg-white p-6 shadow-sm">
            <p className="text-slate-700">&ldquo;{trustTestimonial.quote}&rdquo;</p>
            <footer className="mt-4 text-sm text-slate-500">
              — {trustTestimonial.menteeName}, {trustTestimonial.menteeRole} at{" "}
              {trustTestimonial.menteeCompany}
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
