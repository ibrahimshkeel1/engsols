import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSavedMentors } from "@/lib/data/saved-mentors";
import { getPortfolioByUserId } from "@/lib/data/portfolios";
import { getStudentJobApplications } from "@/lib/data/student-activity";
import { getUnreadNotificationCount } from "@/lib/notifications";
import { goals as defaultGoals } from "@/data/goals";
import type { Mentor } from "@/types";

export type SuggestedAction = {
  href: string;
  label: string;
  description: string;
};

export type HomeJourneyState = {
  savedMentors: Mentor[];
  savedCount: number;
  portfolioIncomplete: boolean;
  portfolioHref: string;
  pendingJobApplications: number;
  unreadNotifications: number;
  pendingBookings: number;
  careerGoals: string[];
  goalsCompleted: string[];
  discipline: string;
  suggestedAction: SuggestedAction;
};

function pickSuggestedAction(state: Omit<HomeJourneyState, "suggestedAction">): SuggestedAction {
  if (state.unreadNotifications > 0) {
    return {
      href: "/notifications",
      label: "Check notifications",
      description: `${state.unreadNotifications} unread update${state.unreadNotifications === 1 ? "" : "s"} waiting for you`,
    };
  }
  if (state.pendingBookings > 0) {
    return {
      href: "/settings#my-bookings",
      label: "Track booking requests",
      description: `${state.pendingBookings} mentor booking${state.pendingBookings === 1 ? "" : "s"} pending`,
    };
  }
  if (state.portfolioIncomplete) {
    return {
      href: state.portfolioHref,
      label: "Finish your portfolio",
      description: "Employers and mentors discover students with complete profiles",
    };
  }
  if (state.pendingJobApplications > 0) {
    return {
      href: "/settings#job-applications",
      label: "Follow up on applications",
      description: `${state.pendingJobApplications} application${state.pendingJobApplications === 1 ? "" : "s"} in progress`,
    };
  }
  if (state.savedCount > 0) {
    return {
      href: `/mentors/${state.savedMentors[0]?.slug ?? ""}`,
      label: "Book an intro call",
      description: `You saved ${state.savedCount} mentor${state.savedCount === 1 ? "" : "s"} — start with a free intro`,
    };
  }
  return {
    href: "/for-you",
    label: "See your weekly digest",
    description: "New mentors, threads, and live sessions picked for your discipline",
  };
}

export async function getHomeJourneyState(userId: string): Promise<HomeJourneyState> {
  const base = {
    savedMentors: [] as Mentor[],
    savedCount: 0,
    portfolioIncomplete: false,
    portfolioHref: "/portfolios/build",
    pendingJobApplications: 0,
    unreadNotifications: 0,
    pendingBookings: 0,
    careerGoals: defaultGoals.slice(0, 2).map((g) => g.label),
    goalsCompleted: [] as string[],
    discipline: "",
  };

  if (!isSupabaseConfigured()) {
    return { ...base, suggestedAction: pickSuggestedAction(base) };
  }

  const supabase = await createClient();
  const [savedMentors, portfolio, jobApps, unreadCount, bookingsCount, profile] = await Promise.all([
    getSavedMentors(userId),
    getPortfolioByUserId(userId),
    getStudentJobApplications(userId),
    getUnreadNotificationCount(userId),
    getPendingBookingsCount(userId),
    supabase.from("profiles").select("career_goals, goals_completed").eq("id", userId).single(),
  ]);

  const portfolioIncomplete = !portfolio || !portfolio.published || !(portfolio.headline as string)?.trim();
  const portfolioHref = "/portfolios/build";
  const pendingJobApplications = jobApps.filter((a) => a.status === "pending").length;
  const careerGoals = profile.data?.career_goals?.length
    ? profile.data.career_goals
    : defaultGoals.slice(0, 2).map((g) => g.label);

  const partial = {
    savedMentors: savedMentors.slice(0, 3),
    savedCount: savedMentors.length,
    portfolioIncomplete,
    portfolioHref,
    pendingJobApplications,
    unreadNotifications: unreadCount,
    pendingBookings: bookingsCount,
    careerGoals,
    goalsCompleted: profile.data?.goals_completed ?? [],
    discipline: portfolio?.discipline ?? "",
  };

  return {
    ...partial,
    suggestedAction: pickSuggestedAction(partial),
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
