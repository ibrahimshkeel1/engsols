import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  url: string | null;
  read: boolean;
  createdAt: string;
};

export async function createNotification(opts: {
  userId: string;
  title: string;
  body: string;
  url?: string;
}) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("create_notification", {
    p_user_id: opts.userId,
    p_title: opts.title,
    p_body: opts.body,
    p_url: opts.url ?? null,
  });
  if (error) logger.error("notifications", error.message);
}

export async function getNotificationsForUser(userId: string, limit = 30): Promise<AppNotification[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("notifications")
    .select("id, title, body, url, read, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? []).map((n) => ({
    id: n.id,
    title: n.title,
    body: n.body,
    url: n.url,
    read: n.read,
    createdAt: n.created_at,
  }));
}

export async function getUnreadNotificationCount(userId: string): Promise<number> {
  const supabase = await createClient();
  const { count } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("read", false);
  return count ?? 0;
}

export async function markNotificationRead(notificationId: string, userId: string) {
  const supabase = await createClient();
  await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", notificationId)
    .eq("user_id", userId);
}

export async function markAllNotificationsRead(userId: string) {
  const supabase = await createClient();
  await supabase.from("notifications").update({ read: true }).eq("user_id", userId).eq("read", false);
}
