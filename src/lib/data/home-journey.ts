import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSavedMentors } from "@/lib/data/saved-mentors";
import { getPortfolioByUserId } from "@/lib/data/portfolios";
import { getStudentJobApplications } from "@/lib/data/student-activity";
import { getUnreadNotificationCount } from "@/lib/notifications";
import type { Mentor } from "@/types";

export type HomeJourneyState = {
  savedMentors: Mentor[];
  savedCount: number;
  portfolioIncomplete: boolean;
  portfolioHref: string;
  pendingJobApplications: number;
  unreadNotifications: number;
  pendingBookings: number;
};

export async function getHomeJourneyState(userId: string): Promise<HomeJourneyState> {
  const empty: HomeJourneyState = {
    savedMentors: [],
    savedCount: 0,
    portfolioIncomplete: false,
    portfolioHref: "/portfolios/build",
    pendingJobApplications: 0,
    unreadNotifications: 0,
    pendingBookings: 0,
  };

  if (!isSupabaseConfigured()) return empty;

  const [savedMentors, portfolio, jobApps, unreadCount, bookingsCount] = await Promise.all([
    getSavedMentors(userId),
    getPortfolioByUserId(userId),
    getStudentJobApplications(userId),
    getUnreadNotificationCount(userId),
    getPendingBookingsCount(userId),
  ]);

  const portfolioIncomplete = !portfolio || !portfolio.published || !(portfolio.headline as string)?.trim();
  const portfolioHref = portfolio?.slug ? `/portfolios/build` : "/portfolios/build";

  const pendingJobApplications = jobApps.filter((a) => a.status === "pending").length;

  return {
    savedMentors: savedMentors.slice(0, 3),
    savedCount: savedMentors.length,
    portfolioIncomplete,
    portfolioHref,
    pendingJobApplications,
    unreadNotifications: unreadCount,
    pendingBookings: bookingsCount,
  };
}

async function getPendingBookingsCount(userId: string): Promise<number> {
  const supabase = await createClient();
  const { count } = await supabase
    .from("booking_requests")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("status", "pending");
  return count ?? 0;
}
