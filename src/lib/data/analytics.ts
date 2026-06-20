import { createClient } from "@/lib/supabase/server";
import { getServiceSupabase, isServiceSupabaseConfigured } from "@/lib/supabase/service";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type MentorActiveMentee = {
  id: string;
  requesterName: string;
  requesterEmail: string;
  requestedAt: string;
};

export type MentorEarningsData = {
  mentorMonthlyRateCents: number;
  totalLifetimeEarningsCents: number;
  monthlyRecurringRevenueCents: number;
  activePaidMentees: number;
  activeRoster: MentorActiveMentee[];
};

export type PlatformTransaction = {
  id: string;
  type: "exam" | "mentorship";
  description: string;
  amountCents: number;
  occurredAt: string;
};

export type PlatformRevenueData = {
  totalExamRevenueCents: number;
  totalExamSales: number;
  totalMentorshipVolumeCents: number;
  activeMentorshipSubscriptions: number;
  recentTransactions: PlatformTransaction[];
};

const EMPTY_PLATFORM_REVENUE: PlatformRevenueData = {
  totalExamRevenueCents: 0,
  totalExamSales: 0,
  totalMentorshipVolumeCents: 0,
  activeMentorshipSubscriptions: 0,
  recentTransactions: [],
};

const EMPTY_MENTOR_EARNINGS: MentorEarningsData = {
  mentorMonthlyRateCents: 0,
  totalLifetimeEarningsCents: 0,
  monthlyRecurringRevenueCents: 0,
  activePaidMentees: 0,
  activeRoster: [],
};

type BookingRow = {
  id: string;
  requester_name: string;
  requester_email: string;
  status: string;
  request_type: string;
  created_at: string;
};

export function dollarsToCents(amount: number): number {
  return Math.round(Math.max(0, amount) * 100);
}

export function computeMentorEarnings(
  monthlyRate: number,
  bookings: BookingRow[],
): MentorEarningsData {
  const monthlyRateCents = dollarsToCents(monthlyRate);
  if (monthlyRateCents <= 0) return { ...EMPTY_MENTOR_EARNINGS };

  const paidMonthly = bookings.filter(
    (booking) => booking.request_type === "monthly" && ["contacted", "closed"].includes(booking.status),
  );
  const activeBookings = paidMonthly.filter((booking) => booking.status === "contacted");

  return {
    mentorMonthlyRateCents: monthlyRateCents,
    monthlyRecurringRevenueCents: activeBookings.length * monthlyRateCents,
    totalLifetimeEarningsCents: paidMonthly.length * monthlyRateCents,
    activePaidMentees: activeBookings.length,
    activeRoster: activeBookings.map((booking) => ({
      id: booking.id,
      requesterName: booking.requester_name,
      requesterEmail: booking.requester_email,
      requestedAt: booking.created_at,
    })),
  };
}

export async function getMentorEarningsData(mentorUserId: string): Promise<MentorEarningsData | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const { data: mentor } = await supabase
    .from("mentor_profiles")
    .select("slug, monthly_rate")
    .eq("user_id", mentorUserId)
    .maybeSingle();

  if (!mentor) return null;

  const { data: bookings } = await supabase
    .from("booking_requests")
    .select("id, requester_name, requester_email, status, request_type, created_at")
    .or(`mentor_slug.eq.${mentor.slug},mentor_user_id.eq.${mentorUserId}`)
    .order("created_at", { ascending: false });

  return computeMentorEarnings(mentor.monthly_rate ?? 0, (bookings ?? []) as BookingRow[]);
}

type ExamPurchaseRow = {
  id: string;
  user_id: string;
  exam_id: string;
  purchased_at: string;
  mock_exams: { title: string; price_cents: number } | null;
};

type ActiveMentorshipRow = {
  id: string;
  requester_name: string;
  mentor_name: string;
  mentor_slug: string;
  mentor_user_id: string | null;
  created_at: string;
  status: string;
  request_type: string;
};

type MentorProfileRateRow = {
  slug: string;
  user_id: string;
  monthly_rate: number;
};

export async function getPlatformRevenueData(): Promise<PlatformRevenueData> {
  if (!isServiceSupabaseConfigured()) return EMPTY_PLATFORM_REVENUE;

  const supabase = getServiceSupabase();

  const [{ data: purchases }, { data: activeMentorships }, { data: mentorProfiles }] = await Promise.all([
    supabase
      .from("user_purchased_exams")
      .select("id, user_id, exam_id, purchased_at, mock_exams(title, price_cents)")
      .order("purchased_at", { ascending: false })
      .limit(100),
    supabase
      .from("booking_requests")
      .select("id, requester_name, mentor_name, mentor_slug, mentor_user_id, created_at, status, request_type")
      .eq("request_type", "monthly")
      .eq("status", "contacted")
      .order("created_at", { ascending: false })
      .limit(100),
    supabase.from("mentor_profiles").select("slug, user_id, monthly_rate"),
  ]);

  const purchaseRows = (purchases ?? []) as unknown as ExamPurchaseRow[];
  const mentorshipRows = (activeMentorships ?? []) as ActiveMentorshipRow[];
  const mentorRateRows = (mentorProfiles ?? []) as MentorProfileRateRow[];

  const mentorRateBySlug = new Map(
    mentorRateRows.map((mentor) => [mentor.slug, dollarsToCents(mentor.monthly_rate)]),
  );
  const mentorRateByUserId = new Map(
    mentorRateRows.map((mentor) => [mentor.user_id, dollarsToCents(mentor.monthly_rate)]),
  );

  const userIds = [...new Set(purchaseRows.map((row) => row.user_id))];
  const { data: profiles } = userIds.length
    ? await supabase.from("profiles").select("id, full_name").in("id", userIds)
    : { data: [] };

  const profileNameById = new Map((profiles ?? []).map((profile) => [profile.id, profile.full_name]));

  let totalExamRevenueCents = 0;
  const examTransactions: PlatformTransaction[] = [];

  for (const purchase of purchaseRows) {
    const exam = purchase.mock_exams;
    const priceCents = exam?.price_cents ?? 0;
    totalExamRevenueCents += priceCents;

    const studentName = profileNameById.get(purchase.user_id) ?? "A student";
    examTransactions.push({
      id: purchase.id,
      type: "exam",
      description: `${studentName} unlocked ${exam?.title ?? "a practice exam"}`,
      amountCents: priceCents,
      occurredAt: purchase.purchased_at,
    });
  }

  let totalMentorshipVolumeCents = 0;
  const mentorshipTransactions: PlatformTransaction[] = [];

  for (const booking of mentorshipRows) {
    const rateCents =
      mentorRateByUserId.get(booking.mentor_user_id ?? "") ??
      mentorRateBySlug.get(booking.mentor_slug) ??
      0;
    if (rateCents <= 0) continue;

    totalMentorshipVolumeCents += rateCents;
    mentorshipTransactions.push({
      id: booking.id,
      type: "mentorship",
      description: `${booking.requester_name} subscribed to ${booking.mentor_name}`,
      amountCents: rateCents,
      occurredAt: booking.created_at,
    });
  }

  const recentTransactions = [...examTransactions, ...mentorshipTransactions]
    .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())
    .slice(0, 25);

  return {
    totalExamRevenueCents,
    totalExamSales: purchaseRows.length,
    totalMentorshipVolumeCents,
    activeMentorshipSubscriptions: mentorshipTransactions.length,
    recentTransactions,
  };
}
