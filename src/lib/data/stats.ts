import { disciplines } from "@/data/disciplines";
import { getApprovedMentors } from "@/lib/data/mentors";

export async function getPlatformStats() {
  const mentors = await getApprovedMentors();
  const mentorDisciplines = new Set(mentors.map((m) => m.discipline));
  const avgRating =
    mentors.length > 0
      ? mentors.reduce((sum, m) => sum + m.rating, 0) / mentors.length
      : null;

  return {
    mentorCount: mentors.length,
    disciplineCount: mentorDisciplines.size || disciplines.length,
    avgRating,
  };
}
