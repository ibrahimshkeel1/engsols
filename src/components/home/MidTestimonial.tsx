import { midPageTestimonial } from "@/data/testimonials";

export function MidTestimonial() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <blockquote className="text-xl leading-relaxed text-slate-700">
          &ldquo;{midPageTestimonial.quote}&rdquo;
        </blockquote>
        <footer className="mt-4 text-sm text-slate-500">
          — {midPageTestimonial.menteeName}, {midPageTestimonial.menteeRole} at{" "}
          {midPageTestimonial.menteeCompany}
        </footer>
      </div>
    </section>
  );
}
