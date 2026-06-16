import type { Certification } from "@/types";

const defaultSteps = [
  { phase: "Assess", description: "Review eligibility requirements and your experience gap against the exam blueprint." },
  { phase: "Study", description: "Follow structured resources and practice problems for 2–4 hours per week." },
  { phase: "Practice", description: "Take timed practice exams under real conditions and review weak areas." },
  { phase: "Mentor", description: "Book sessions with mentors who have passed this certification." },
  { phase: "Exam", description: "Schedule your exam window and finalize logistics." },
];

type Props = {
  cert: Certification;
};

export function CertificationPrepPath({ cert }: Props) {
  const months = cert.avgPrepMonths;
  const steps = defaultSteps.map((step, i) => ({
    ...step,
    week: Math.ceil(((i + 1) / defaultSteps.length) * months * 4),
  }));

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold">Prep path</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Suggested {months}-month roadmap for {cert.shortName || cert.name}
      </p>
      <ol className="mt-6 space-y-4">
        {steps.map((step, i) => (
          <li key={step.phase} className="relative flex gap-4 rounded-2xl border border-border bg-card p-5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
              {i + 1}
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold">{step.phase}</h3>
                <span className="text-xs text-muted-foreground">~Week {step.week}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
