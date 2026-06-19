import type { Mentor } from "@/types";
import { MentorCard } from "./MentorCard";
import { ProfileBentoGrid } from "@/components/ui/ProfileBentoGrid";

type SimilarMentorsProps = {
  mentors: Mentor[];
};

export function SimilarMentors({ mentors }: SimilarMentorsProps) {
  if (mentors.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="font-display text-2xl">Similar mentors</h2>
      <ProfileBentoGrid
        className="mt-6"
        items={mentors}
        getKey={(mentor) => mentor.slug}
        isFeatured={(mentor) => mentor.featured}
        renderCard={(mentor, variant) => <MentorCard mentor={mentor} variant={variant} />}
      />
    </section>
  );
}
