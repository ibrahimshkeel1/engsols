import { getServiceSupabase, isServiceSupabaseConfigured } from "@/lib/supabase/service";

type MentorshipPaymentRefs = {
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
};

export async function markMentorshipBookingPaid(
  bookingRequestId: string,
  userId: string,
  refs: MentorshipPaymentRefs = {},
): Promise<{ error?: string }> {
  if (!isServiceSupabaseConfigured()) {
    return { error: "Booking payment recording is not configured" };
  }

  const supabase = getServiceSupabase();

  const { data: booking, error: fetchError } = await supabase
    .from("booking_requests")
    .select(
      "id, user_id, status, request_type, mentor_slug, mentor_name, mentor_user_id, requester_name, requester_email, message",
    )
    .eq("id", bookingRequestId)
    .maybeSingle();

  if (fetchError || !booking) return { error: "Booking not found" };
  if (booking.user_id !== userId) return { error: "Booking does not belong to this user" };
  if (booking.status !== "pending") {
    if (refs.stripeCustomerId || refs.stripeSubscriptionId) {
      await supabase
        .from("booking_requests")
        .update({
          stripe_customer_id: refs.stripeCustomerId ?? undefined,
          stripe_subscription_id: refs.stripeSubscriptionId ?? undefined,
        })
        .eq("id", bookingRequestId);
    }
    return {};
  }

  const { error } = await supabase
    .from("booking_requests")
    .update({
      status: "contacted",
      stripe_customer_id: refs.stripeCustomerId ?? null,
      stripe_subscription_id: refs.stripeSubscriptionId ?? null,
    })
    .eq("id", bookingRequestId)
    .eq("user_id", userId)
    .eq("status", "pending");

  if (error) return { error: error.message };

  if (booking.mentor_user_id) {
    const { data: mentorProfile } = await supabase
      .from("profiles")
      .select("email")
      .eq("id", booking.mentor_user_id)
      .maybeSingle();

    if (mentorProfile?.email) {
      const { notifyMentorOfBooking } = await import("@/actions/mentor");
      await notifyMentorOfBooking({
        mentorEmail: mentorProfile.email,
        mentorName: booking.mentor_name,
        requesterName: booking.requester_name,
        requesterEmail: booking.requester_email,
        message: booking.message,
        type: booking.request_type,
      });
    }

    const { createNotification } = await import("@/lib/notifications");
    await createNotification({
      userId: booking.mentor_user_id,
      title: "Paid mentorship request",
      body: `${booking.requester_name} paid for monthly mentorship.`,
      url: "/mentor/bookings",
    });

    const { sendPushToUser } = await import("@/lib/push");
    await sendPushToUser({
      userId: booking.mentor_user_id,
      title: "Paid mentorship request",
      body: `${booking.requester_name} completed payment.`,
      url: "/mentor/bookings",
    });
  }

  return {};
}

export async function closeMentorshipSubscription(
  stripeSubscriptionId: string | null,
  stripeCustomerId: string | null,
): Promise<{ error?: string }> {
  if (!isServiceSupabaseConfigured()) {
    return { error: "Booking payment recording is not configured" };
  }

  const supabase = getServiceSupabase();

  let bookingQuery = supabase
    .from("booking_requests")
    .select(
      "id, user_id, mentor_user_id, mentor_name, requester_name, requester_email, request_type, status",
    )
    .eq("request_type", "monthly")
    .eq("status", "contacted");

  if (stripeSubscriptionId) {
    bookingQuery = bookingQuery.eq("stripe_subscription_id", stripeSubscriptionId);
  } else if (stripeCustomerId) {
    bookingQuery = bookingQuery.eq("stripe_customer_id", stripeCustomerId);
  } else {
    return { error: "Missing Stripe subscription reference" };
  }

  const { data: booking, error: fetchError } = await bookingQuery.maybeSingle();
  if (fetchError) return { error: fetchError.message };
  if (!booking) return {};

  const { error } = await supabase
    .from("booking_requests")
    .update({ status: "closed" })
    .eq("id", booking.id)
    .eq("status", "contacted");

  if (error) return { error: error.message };

  await supabase
    .from("mentorship_roadmaps")
    .update({ status: "archived", updated_at: new Date().toISOString() })
    .eq("booking_request_id", booking.id)
    .eq("status", "active");

  if (booking.mentor_user_id && booking.user_id) {
    await supabase
      .from("mentorship_roadmaps")
      .update({ status: "archived", updated_at: new Date().toISOString() })
      .eq("mentor_user_id", booking.mentor_user_id)
      .eq("student_user_id", booking.user_id)
      .eq("status", "active");
  }

  if (booking.mentor_user_id) {
    const { data: mentorProfile } = await supabase
      .from("profiles")
      .select("email")
      .eq("id", booking.mentor_user_id)
      .maybeSingle();

    if (mentorProfile?.email) {
      const { sendEmail } = await import("@/lib/email");
      await sendEmail({
        to: mentorProfile.email,
        subject: `Mentorship billing ended — ${booking.requester_name}`,
        html: `<p>Hi ${booking.mentor_name},</p><p>${booking.requester_name} has ended their monthly mentorship billing cycle. Any active roadmap for this student has been archived in your mentor dashboard.</p><p><a href="${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/mentor/roadmaps">View roadmaps</a></p>`,
      });
    }

    const { createNotification } = await import("@/lib/notifications");
    await createNotification({
      userId: booking.mentor_user_id,
      title: "Mentorship subscription ended",
      body: `${booking.requester_name}'s monthly billing cycle has ended. Their roadmap was archived.`,
      url: "/mentor/roadmaps",
    });

    const { sendPushToUser } = await import("@/lib/push");
    await sendPushToUser({
      userId: booking.mentor_user_id,
      title: "Mentorship subscription ended",
      body: `${booking.requester_name}'s subscription was canceled.`,
      url: "/mentor/roadmaps",
    });
  }

  return {};
}
