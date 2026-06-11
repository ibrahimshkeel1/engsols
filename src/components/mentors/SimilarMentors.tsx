import type { Mentor } from "@/types";
import { MentorCard } from "./MentorCard";

type SimilarMentorsProps = {
  mentors: Mentor[];
};

export function SimilarMentors({ mentors }: SimilarMentorsProps) {
  if (mentors.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="text-xl font-bold text-slate-900">Similar mentors</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {mentors.map((mentor) => (
          <MentorCard key={mentor.slug} mentor={mentor} />
        ))}
      </div>
    </section>
  );
}
