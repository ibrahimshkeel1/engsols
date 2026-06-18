import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type MentorBookingStats = {
  total: number;
  pending: number;
  contacted: number;
  closed: number;
  responseRate: number;
  reviewCount: number;
  avgRating: number;
};

export async function getMentorBookingStats(mentorSlug: string, mentorUserId: string): Promise<MentorBookingStats> {
  if (!isSupabaseConfigured()) {
    return { total: 0, pending: 0, contacted: 0, closed: 0, responseRate: 0, reviewCount: 0, avgRating: 0 };
  }

  const supabase = await createClient();
  const { data: bookings } = await supabase
    .from("booking_requests")
    .select("status")
    .or(`mentor_slug.eq.${mentorSlug},mentor_user_id.eq.${mentorUserId}`);

  const rows = bookings ?? [];
  const pending = rows.filter((b) => b.status === "pending").length;
  const contacted = rows.filter((b) => b.status === "contacted").length;
  const closed = rows.filter((b) => b.status === "closed").length;
  const total = rows.length;
  const responded = contacted + closed;
  const responseRate = total > 0 ? Math.round((responded / total) * 100) : 0;

  const { data: profile } = await supabase
    .from("mentor_profiles")
    .select("id, rating, review_count")
    .eq("slug", mentorSlug)
    .maybeSingle();

  return {
    total,
    pending,
    contacted,
    closed,
    responseRate,
    reviewCount: profile?.review_count ?? 0,
    avgRating: Number(profile?.rating ?? 0),
  };
}
