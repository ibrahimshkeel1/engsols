import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type BookingRequest = {
  id: string;
  mentorSlug: string;
  mentorName: string;
  requesterName: string;
  requesterEmail: string;
  message: string;
  requestType: string;
  status: string;
  createdAt: string;
};

export async function getBookingRequestsForAdmin(): Promise<BookingRequest[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("booking_requests")
    .select("*")
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
