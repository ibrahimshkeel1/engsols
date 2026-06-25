"use server";

import { revalidatePath } from "next/cache";
import { hasUserPurchasedExam, recordExamPurchase } from "@/lib/exam-purchases";
import { getMockExamMetaBySlug } from "@/lib/data/exams";
import { getSiteUrl, getStripe } from "@/lib/stripe";
import { resolveStripeCustomerId } from "@/lib/stripe-customers";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function createExamCheckoutSession(
  examSlug: string,
): Promise<{ error: string } | { success: true; url: string }> {
  const user = await getCurrentUser();
  if (!user) return { error: "You must be logged in to purchase this exam" };

  const stripe = getStripe();
  if (!stripe) return { error: "Stripe is not configured" };

  const exam = await getMockExamMetaBySlug(examSlug);
  if (!exam) return { error: "Exam not found" };
  if (!exam.isPremium || exam.priceCents <= 0) {
    return { error: "This exam does not require a purchase" };
  }

  const alreadyOwned = await hasUserPurchasedExam(user.id, exam.id);
  if (alreadyOwned) return { error: "You already own this exam" };

  const baseUrl = getSiteUrl();
  const successUrl = `${baseUrl}/certifications/exams/${exam.slug}?success=true&session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${baseUrl}/certifications/exams/${exam.slug}?canceled=true`;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: exam.priceCents,
          product_data: {
            name: exam.title,
            description: exam.description.slice(0, 200) || `${exam.examType} practice exam`,
          },
        },
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    client_reference_id: user.id,
    metadata: {
      user_id: user.id,
      exam_id: exam.id,
      exam_slug: exam.slug,
    },
  });

  if (!session.url) return { error: "Could not create checkout session" };

  return { success: true, url: session.url };
}

export async function fulfillExamCheckoutSession(
  sessionId: string,
  expectedUserId: string,
): Promise<{ error: string } | { success: true }> {
  const stripe = getStripe();
  if (!stripe) return { error: "Stripe is not configured" };

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid" && session.status !== "complete") {
    return { error: "Payment not completed yet" };
  }

  const userId = session.metadata?.user_id;
  const examId = session.metadata?.exam_id;

  if (!userId || !examId) return { error: "Invalid checkout session metadata" };
  if (userId !== expectedUserId) return { error: "Checkout session does not belong to this user" };

  const result = await recordExamPurchase(
    userId,
    examId,
    session.id,
    typeof session.customer === "string" ? session.customer : session.customer?.id ?? null,
  );
  if (result.error) return { error: result.error };

  revalidatePath(`/certifications/exams/${session.metadata?.exam_slug ?? ""}`);
  return { success: true };
}

export async function createMentorshipCheckoutSession(
  bookingRequestId: string,
): Promise<{ error: string } | { success: true; url: string }> {
  const user = await getCurrentUser();
  if (!user) return { error: "You must be logged in to complete this purchase" };

  const stripe = getStripe();
  if (!stripe) return { error: "Stripe is not configured" };

  const supabase = await createClient();
  const { data: booking } = await supabase
    .from("booking_requests")
    .select("id, user_id, mentor_slug, mentor_name, request_type, status")
    .eq("id", bookingRequestId)
    .maybeSingle();

  if (!booking) return { error: "Booking request not found" };
  if (booking.user_id !== user.id) return { error: "Unauthorized booking request" };
  if (booking.request_type !== "monthly") return { error: "This booking does not require mentorship payment" };
  if (booking.status !== "pending") return { error: "This booking has already been processed" };

  const { data: mentor } = await supabase
    .from("mentor_profiles")
    .select("user_id, monthly_rate")
    .eq("slug", booking.mentor_slug)
    .maybeSingle();

  if (!mentor?.user_id) return { error: "Mentor profile not found" };

  const priceCents = Math.round((mentor.monthly_rate ?? 0) * 100);
  if (priceCents <= 0) return { error: "This mentor does not require a paid booking" };

  const baseUrl = getSiteUrl();
  const successUrl = `${baseUrl}/bookings?mentorship_success=true`;
  const cancelUrl = `${baseUrl}/mentors/${booking.mentor_slug}?session=monthly&canceled=true#booking-options`;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: user.email ?? undefined,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: priceCents,
          recurring: { interval: "month" },
          product_data: {
            name: `Monthly mentorship — ${booking.mentor_name}`,
            description: "Recurring engineering mentorship on EngSols",
          },
        },
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    client_reference_id: user.id,
    metadata: {
      user_id: user.id,
      booking_request_id: bookingRequestId,
      mentor_user_id: mentor.user_id,
    },
  });

  if (!session.url) return { error: "Could not create checkout session" };

  return { success: true, url: session.url };
}

export async function createBillingPortalSession(): Promise<
  { error: string } | { success: true; url: string }
> {
  const user = await getCurrentUser();
  if (!user) return { error: "You must be logged in to manage billing" };

  const stripe = getStripe();
  if (!stripe) return { error: "Stripe is not configured" };

  const customerId = await resolveStripeCustomerId(user.id, user.email ?? "");
  if (!customerId) {
    return {
      error: "No billing history found yet. Complete a mentorship subscription or exam purchase first.",
    };
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${getSiteUrl()}/settings`,
  });

  if (!session.url) return { error: "Could not open billing portal" };

  return { success: true, url: session.url };
}
