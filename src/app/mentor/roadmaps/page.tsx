import { getCurrentUser } from "@/lib/auth";
import {
  getMentorRoadmapStudentOptions,
  getRoadmapsForMentor,
} from "@/lib/data/roadmaps";
import { CreateRoadmapForm } from "@/components/dashboard/CreateRoadmapForm";
import { MilestoneTracker } from "@/components/dashboard/MilestoneTracker";

export default async function MentorRoadmapsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [roadmaps, students] = await Promise.all([
    getRoadmapsForMentor(user.id),
    getMentorRoadmapStudentOptions(user.id),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold">Mentorship roadmaps</h1>
      <p className="mt-1 text-muted-foreground">
        Track milestone progress with students across your active mentorships.
      </p>

      <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,340px)_1fr]">
        <CreateRoadmapForm students={students} />
        <div>
          <h2 className="mb-4 font-semibold">Active roadmaps</h2>
          <MilestoneTracker
            roadmaps={roadmaps}
            viewerRole="mentor"
            emptyMessage="Create a roadmap for a student from your booking inbox."
          />
        </div>
      </div>
    </div>
  );
}
