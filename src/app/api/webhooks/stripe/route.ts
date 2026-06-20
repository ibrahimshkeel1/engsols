import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { closeMentorshipSubscription, markMentorshipBookingPaid } from "@/lib/booking-payments";
import { recordExamPurchase } from "@/lib/exam-purchases";
import {
  resolveStripeCustomerIdFromSubscription,
} from "@/lib/stripe-customers";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

function extractCustomerId(
  customer: Stripe.Checkout.Session["customer"] | Stripe.Subscription["customer"],
): string | null {
  if (!customer) return null;
  return typeof customer === "string" ? customer : customer.id;
}

function extractSubscriptionId(
  subscription: Stripe.Checkout.Session["subscription"] | string | null,
): string | null {
  if (!subscription) return null;
  return typeof subscription === "string" ? subscription : subscription.id;
}

function subscriptionShouldClose(status: Stripe.Subscription.Status): boolean {
  return (
    status === "canceled" ||
    status === "unpaid" ||
    status === "incomplete_expired" ||
    status === "past_due" ||
    status === "incomplete"
  );
}

function isBillingFailureStatus(status: Stripe.Subscription.Status): boolean {
  return status === "past_due" || status === "unpaid" || status === "incomplete";
}

export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Stripe webhook is not configured" }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata ?? {};
    const userId = metadata.user_id;
    const customerId = extractCustomerId(session.customer);
    const subscriptionId = extractSubscriptionId(session.subscription);

    if (!userId || !session.id) {
      return NextResponse.json({ error: "Missing checkout metadata" }, { status: 400 });
    }

    if (metadata.exam_id) {
      const result = await recordExamPurchase(userId, metadata.exam_id, session.id, customerId);
      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }
    } else if (metadata.booking_request_id) {
      const result = await markMentorshipBookingPaid(metadata.booking_request_id, userId, {
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
      });
      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = extractCustomerId(subscription.customer);
    const result = await closeMentorshipSubscription(subscription.id, customerId, {
      reason: isBillingFailureStatus(subscription.status) ? "billing_failed" : "canceled",
    });
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
  }

  if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object as Stripe.Subscription;
    if (!subscriptionShouldClose(subscription.status)) {
      return NextResponse.json({ received: true });
    }

    const customerId =
      extractCustomerId(subscription.customer) ??
      (await resolveStripeCustomerIdFromSubscription(subscription.id));

    const result = await closeMentorshipSubscription(subscription.id, customerId, {
      reason: isBillingFailureStatus(subscription.status) ? "billing_failed" : "canceled",
    });
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
