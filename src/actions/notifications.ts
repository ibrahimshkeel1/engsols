"use server";

import { createClient } from "@/lib/supabase/server";

export async function savePushSubscription(subscriptionJson: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in" };

  let subscription: { endpoint?: string };
  try {
    subscription = JSON.parse(subscriptionJson);
  } catch {
    return { error: "Invalid subscription" };
  }

  if (!subscription.endpoint) return { error: "Invalid subscription" };

  const { error } = await supabase.from("push_subscriptions").upsert(
    {
      user_id: user.id,
      endpoint: subscription.endpoint,
      subscription: JSON.parse(subscriptionJson),
    },
    { onConflict: "user_id,endpoint" },
  );

  if (error) return { error: error.message };
  return { success: true };
}
