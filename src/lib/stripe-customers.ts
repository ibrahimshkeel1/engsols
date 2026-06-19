import { createClient } from "@/lib/supabase/server";
import { getServiceSupabase, isServiceSupabaseConfigured } from "@/lib/supabase/service";
import { getStripe } from "@/lib/stripe";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function resolveStripeCustomerId(
  userId: string,
  email: string,
): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();

  const { data: booking } = await supabase
    .from("booking_requests")
    .select("stripe_customer_id")
    .eq("user_id", userId)
    .not("stripe_customer_id", "is", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (booking?.stripe_customer_id) return booking.stripe_customer_id;

  const { data: purchase } = await supabase
    .from("user_purchased_exams")
    .select("stripe_customer_id")
    .eq("user_id", userId)
    .not("stripe_customer_id", "is", null)
    .order("purchased_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (purchase?.stripe_customer_id) return purchase.stripe_customer_id;

  const stripe = getStripe();
  if (!stripe || !email) return null;

  const customers = await stripe.customers.list({ email, limit: 1 });
  return customers.data[0]?.id ?? null;
}

export async function resolveStripeCustomerIdFromSubscription(
  subscriptionId: string,
): Promise<string | null> {
  const stripe = getStripe();
  if (!stripe) return null;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  return typeof subscription.customer === "string"
    ? subscription.customer
    : subscription.customer?.id ?? null;
}

export async function findActiveBookingByStripeRefs(
  stripeSubscriptionId: string | null,
  stripeCustomerId: string | null,
) {
  if (!isServiceSupabaseConfigured()) return null;

  const supabase = getServiceSupabase();

  if (stripeSubscriptionId) {
    const { data } = await supabase
      .from("booking_requests")
      .select("*")
      .eq("stripe_subscription_id", stripeSubscriptionId)
      .maybeSingle();
    if (data) return data;
  }

  if (stripeCustomerId) {
    const { data } = await supabase
      .from("booking_requests")
      .select("*")
      .eq("stripe_customer_id", stripeCustomerId)
      .eq("request_type", "monthly")
      .eq("status", "contacted")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (data) return data;
  }

  return null;
}
