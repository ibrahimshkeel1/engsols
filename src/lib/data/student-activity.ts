import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { BookingRequest } from "@/lib/data/bookings";

export async function getStudentBookings(userId: string): Promise<BookingRequest[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("booking_requests")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  return (data ?? []).map((b) => ({
    id: b.id,
    mentorSlug: b.mentor_slug,
    mentorName: b.mentor_name,
    requesterName: b.requester_name,
    requesterEmail: b.requester_email,
    message: b.message,
    requestType: b.request_type,
    status: b.status,
    createdAt: b.created_at,
  }));
}

export async function getStudentJobApplications(userId: string) {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("job_applications")
    .select("id, job_slug, applicant_name, message, status, created_at, jobs(title)")
    .eq("applicant_id", userId)
    .order("created_at", { ascending: false })
    .limit(30);

  return (data ?? []).map((a) => {
    const jobs = a.jobs as { title: string } | { title: string }[] | null;
    const job = Array.isArray(jobs) ? jobs[0] : jobs;
    return {
      id: a.id as string,
      jobSlug: a.job_slug as string,
      jobTitle: job?.title ?? (a.job_slug as string),
      message: a.message as string,
      status: a.status as string,
      createdAt: a.created_at as string,
    };
  });
}
