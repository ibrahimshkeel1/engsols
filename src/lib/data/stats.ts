import { disciplines } from "@/data/disciplines";
import { getApprovedMentors } from "@/lib/data/mentors";

export type PlatformStats = {
  mentorCount: number;
  disciplineCount: number;
  avgRating: number | null;
  totalReviews: number;
  freeIntroCount: number;
  verifiedMentorCount: number;
};

export async function getPlatformStats(): Promise<PlatformStats> {
  const mentors = await getApprovedMentors();
  const mentorDisciplines = new Set(mentors.map((m) => m.discipline));
  const withReviews = mentors.filter((m) => m.reviewCount > 0);
  const totalReviews = mentors.reduce((sum, m) => sum + m.reviewCount, 0);
  const avgRating =
    withReviews.length > 0
      ? withReviews.reduce((sum, m) => sum + m.rating, 0) / withReviews.length
      : null;

  return {
    mentorCount: mentors.length,
    disciplineCount: mentorDisciplines.size || disciplines.length,
    avgRating,
    totalReviews,
    freeIntroCount: mentors.filter((m) => m.introCallRate <= 0).length,
    verifiedMentorCount: mentors.filter((m) => m.verified).length,
  };
}
