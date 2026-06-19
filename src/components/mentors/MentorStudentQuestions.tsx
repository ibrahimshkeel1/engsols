import type { Mentor } from "@/types";

function goalLabel(goal: string): string {
  return goal.replace(/-/g, " ");
}

export function buildMentorStudentQuestions(mentor: Mentor): { question: string; answer: string }[] {
  const fromGoals = mentor.goals.slice(0, 3).map((goal) => ({
    question: `How do I make progress on ${goalLabel(goal)}?`,
    answer: `${mentor.name} mentors students on ${goalLabel(goal)} with a practical roadmap — from where you are today to your next milestone.`,
  }));

  const fromSkills = mentor.subFields.slice(0, 2).map((field) => ({
    question: `What should I know about ${field}?`,
    answer: `With ${mentor.yearsExperience} years at ${mentor.company}, ${mentor.name} breaks down ${field} concepts and how they apply in real projects.`,
  }));

  return [...fromGoals, ...fromSkills].slice(0, 5);
}

type Props = {
  mentor: Mentor;
};

export function MentorStudentQuestions({ mentor }: Props) {
  const questions = buildMentorStudentQuestions(mentor);
  if (!questions.length) return null;

  return (
    <section id="what-students-ask">
      <h2 className="text-xl font-semibold">What students ask</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Common topics {mentor.name.split(" ")[0]} covers in intro calls and mentorship.
      </p>
      <dl className="mt-6 space-y-4">
        {questions.map((item) => (
          <div key={item.question} className="rounded-xl border border-border bg-card p-5">
            <dt className="font-medium">{item.question}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
