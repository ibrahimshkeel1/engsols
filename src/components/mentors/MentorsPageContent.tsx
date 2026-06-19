import { getApprovedMentors } from "@/lib/data/mentors";
import { getCurrentUser } from "@/lib/auth";
import { getSavedMentorSlugs } from "@/lib/data/saved-mentors";
import { MentorsDirectory } from "@/components/mentors/MentorsDirectory";
import { CompareMentorsBar } from "@/components/mentors/CompareMentorsBar";

export async function MentorsPageContent() {
  const [mentors, user] = await Promise.all([getApprovedMentors(), getCurrentUser()]);
  const savedSlugs = user ? await getSavedMentorSlugs(user.id) : [];

  return (
    <>
      <MentorsDirectory mentors={mentors} savedSlugs={savedSlugs} />
      <CompareMentorsBar savedSlugs={savedSlugs} />
    </>
  );
}
