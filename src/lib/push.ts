import { createClient } from "@/lib/supabase/server";

type PushPayload = {
  userId: string;
  title: string;
  body: string;
  url?: string;
};

export async function sendPushToUser({ userId, title, body, url }: PushPayload) {
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (!privateKey || !publicKey) return { skipped: true };

  const supabase = await createClient();
  const { data: subs } = await supabase
    .from("push_subscriptions")
    .select("subscription")
    .eq("user_id", userId);

  if (!subs?.length) return { sent: 0 };

  let webpush: typeof import("web-push");
  try {
    webpush = await import("web-push");
  } catch {
    return { skipped: true };
  }

  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || "mailto:notifications@engsols.com",
    publicKey,
    privateKey,
  );

  let sent = 0;
  for (const row of subs) {
    try {
      await webpush.sendNotification(
        row.subscription as import("web-push").PushSubscription,
        JSON.stringify({ title, body, url: url ?? "/" }),
      );
      sent++;
    } catch {
      // subscription may be expired
    }
  }
  return { sent };
}
