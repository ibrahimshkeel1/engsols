import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getMentorEarningsData } from "@/lib/data/analytics";
import { getMentorProfileByUserId } from "@/lib/data/mentors";
import { MentorEarningsDashboard } from "@/components/mentor/MentorEarningsDashboard";

export default async function MentorEarningsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/mentor/earnings");

  const profile = await getMentorProfileByUserId(user.id);
  if (!profile) redirect("/apply");

  const earnings = (await getMentorEarningsData(user.id)) ?? {
    mentorMonthlyRateCents: 0,
    totalLifetimeEarningsCents: 0,
    monthlyRecurringRevenueCents: 0,
    activePaidMentees: 0,
    activeRoster: [],
  };

  return (
    <div>
      <p className="section-label text-zone-mentorship">Mentor analytics</p>
      <h1 className="mt-1 text-2xl font-bold">Earnings & revenue</h1>
      <p className="mt-1 text-muted-foreground">
        Track paid mentorship performance for <span className="font-medium text-foreground">{profile.headline}</span>.
      </p>
      <div className="mt-8">
        <MentorEarningsDashboard earnings={earnings} />
      </div>
    </div>
  );
}
