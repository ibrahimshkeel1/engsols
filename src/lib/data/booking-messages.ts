import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type BookingMessage = {
  id: string;
  bookingRequestId: string;
  senderId: string;
  senderName: string;
  body: string;
  createdAt: string;
};

export type StudentBooking = {
  id: string;
  mentorSlug: string;
  mentorName: string;
  mentorUserId: string | null;
  requesterName: string;
  requesterEmail: string;
  message: string;
  requestType: string;
  status: string;
  createdAt: string;
};

export async function getStudentBookingsDetailed(userId: string): Promise<StudentBooking[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("booking_requests")
    .select("id, mentor_slug, mentor_name, mentor_user_id, requester_name, requester_email, message, request_type, status, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  return (data ?? []).map((b) => ({
    id: b.id,
    mentorSlug: b.mentor_slug,
    mentorName: b.mentor_name,
    mentorUserId: b.mentor_user_id,
    requesterName: b.requester_name,
    requesterEmail: b.requester_email,
    message: b.message,
    requestType: b.request_type,
    status: b.status,
    createdAt: b.created_at,
  }));
}

export async function getBookingForParticipant(bookingId: string, userId: string) {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("booking_requests")
    .select("id, mentor_slug, mentor_name, mentor_user_id, user_id, requester_name, request_type, status, created_at")
    .eq("id", bookingId)
    .maybeSingle();

  if (!data) return null;
  if (data.user_id !== userId && data.mentor_user_id !== userId) return null;

  return {
    id: data.id,
    mentorSlug: data.mentor_slug,
    mentorName: data.mentor_name,
    mentorUserId: data.mentor_user_id,
    studentUserId: data.user_id,
    requesterName: data.requester_name,
    requestType: data.request_type,
    status: data.status,
    createdAt: data.created_at,
    isMentor: data.mentor_user_id === userId,
  };
}

export async function getBookingMessages(bookingId: string, userId: string): Promise<BookingMessage[]> {
  const booking = await getBookingForParticipant(bookingId, userId);
  if (!booking) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("booking_messages")
    .select("id, booking_request_id, sender_id, body, created_at, profiles(full_name)")
    .eq("booking_request_id", bookingId)
    .order("created_at", { ascending: true });

  return (data ?? []).map((row) => ({
    id: row.id,
    bookingRequestId: row.booking_request_id,
    senderId: row.sender_id,
    senderName: (row.profiles as { full_name?: string } | null)?.full_name ?? "User",
    body: row.body,
    createdAt: row.created_at,
  }));
}

export async function getReviewedMentorSlugsForUser(userId: string): Promise<Set<string>> {
  if (!isSupabaseConfigured()) return new Set();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("mentor_reviews")
    .select("mentor_profile_id, mentor_profiles(slug)")
    .eq("author_id", userId);

  if (error) return new Set();

  const slugs = new Set<string>();
  for (const row of data ?? []) {
    const mp = row.mentor_profiles as { slug?: string } | { slug?: string }[] | null;
    const slug = Array.isArray(mp) ? mp[0]?.slug : mp?.slug;
    if (slug) slugs.add(slug);
  }
  return slugs;
}
