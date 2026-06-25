import type { Mentor } from "@/types";
import { MentorCard } from "@/components/mentors/MentorCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ProfileBentoGrid } from "@/components/ui/ProfileBentoGrid";
import { ButtonLink } from "@/components/ui/button";
import { Users } from "lucide-react";

type FeaturedMentorsProps = {
  mentors: Mentor[];
};

function pickShowcaseMentors(mentors: Mentor[], limit = 6) {
  const featured = mentors.filter((mentor) => mentor.featured);
  const rest = mentors.filter((mentor) => !mentor.featured);
  return [...featured, ...rest].slice(0, limit);
}

export function FeaturedMentors({ mentors }: FeaturedMentorsProps) {
  const showcase = pickShowcaseMentors(mentors);

  return (
    <section id="find-mentor" className="border-b border-border/60 bg-muted/25 py-20 lg:py-28">
      <div className="page-container-wide">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-display-lg">Featured mentors</h2>
          <p className="text-body-lg mx-auto mt-3 max-w-lg">
            Vetted engineers open to mentorship — book a free intro to see if it is the right fit.
          </p>
        </div>

        {showcase.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              icon={Users}
              title="No mentors yet"
              description="Be among the first mentors on EngSols."
              action={{ href: "/apply", label: "Become a mentor" }}
            />
          </div>
        ) : (
          <div className="mx-auto mt-10 max-w-7xl">
            <ProfileBentoGrid
              items={showcase}
              getKey={(mentor) => mentor.slug}
              isFeatured={(mentor) => mentor.featured}
              renderCard={(mentor) => <MentorCard mentor={mentor} />}
            />
          </div>
        )}

        <div className="mt-10 text-center">
          <ButtonLink href="/mentors" size="lg">
            Browse all mentors
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
