import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { BookingRequest } from "./bookings";

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

export async function getSavedMentorSlugs(userId: string): Promise<string[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase.from("saved_mentors").select("mentor_slug").eq("user_id", userId);
  return (data ?? []).map((r) => r.mentor_slug);
}

export async function getSessionNotes(userId: string) {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("session_notes")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });
  return data ?? [];
}
