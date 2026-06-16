import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { BookingRequest } from "@/lib/data/bookings";

export async function getBookingRequestsForMentor(userId: string): Promise<BookingRequest[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data: mentor } = await supabase
    .from("mentor_profiles")
    .select("slug")
    .eq("user_id", userId)
    .maybeSingle();

  if (!mentor) return [];

  const { data } = await supabase
    .from("booking_requests")
    .select("*")
    .or(`mentor_slug.eq.${mentor.slug},mentor_user_id.eq.${userId}`)
    .order("created_at", { ascending: false })
    .limit(50);

  return (data ?? []).map((row) => ({
    id: row.id,
    mentorSlug: row.mentor_slug,
    mentorName: row.mentor_name,
    requesterName: row.requester_name,
    requesterEmail: row.requester_email,
    message: row.message,
    requestType: row.request_type,
    status: row.status,
    createdAt: row.created_at,
  }));
}
