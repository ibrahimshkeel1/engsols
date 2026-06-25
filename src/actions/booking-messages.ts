"use server";

import { revalidatePath } from "next/cache";
import { submitBookingRequest } from "@/actions";
import { createMentorshipCheckoutSession } from "@/actions/stripe";
import { getCurrentUser } from "@/lib/auth";
import { getBookingForParticipant } from "@/lib/data/booking-messages";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const messageSchema = z.object({
  bookingId: z.string().uuid(),
  body: z.string().trim().min(1, "Message cannot be empty").max(4000),
});

export async function sendBookingMessage(bookingId: string, body: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "You must be logged in" };

  const parsed = messageSchema.safeParse({ bookingId, body });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid message" };
  }

  const booking = await getBookingForParticipant(bookingId, user.id);
  if (!booking) return { error: "Booking not found" };
  if (booking.status === "closed") return { error: "This booking is closed" };

  const supabase = await createClient();
  const { error } = await supabase.from("booking_messages").insert({
    booking_request_id: bookingId,
    sender_id: user.id,
    body: parsed.data.body,
  });

  if (error) return { error: error.message };

  const recipientId = booking.isMentor ? booking.studentUserId : booking.mentorUserId;
  if (recipientId) {
    const { createNotification } = await import("@/lib/notifications");
    await createNotification({
      userId: recipientId,
      title: "Message about your booking",
      body: `${user.full_name || "Someone"} sent a message.`,
      url: `/bookings/${bookingId}`,
    });
  }

  revalidatePath(`/bookings/${bookingId}`);
  revalidatePath("/bookings");
  revalidatePath("/mentor/bookings");
  return { success: true };
}

export async function startMonthlyMentorshipCheckout(
  mentorSlug: string,
  mentorName: string,
  message: string,
): Promise<{ error: string } | { success: true; url: string }> {
  const user = await getCurrentUser();
  if (!user) return { error: "You must be logged in" };

  const trimmed = message.trim();
  if (!trimmed) return { error: "Tell the mentor about your goals" };

  const form = new FormData();
  form.set("mentorSlug", mentorSlug);
  form.set("mentorName", mentorName);
  form.set("name", user.full_name || "Student");
  form.set("email", user.email || "");
  form.set("message", trimmed);
  form.set("type", "monthly");

  try {
    const result = await submitBookingRequest(form);
    if (result.requiresPayment && result.bookingRequestId) {
      return createMentorshipCheckoutSession(result.bookingRequestId);
    }
    if (result.success) {
      return { success: true, url: "/bookings" };
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Could not start checkout" };
  }

  return { error: "Could not start checkout" };
}
