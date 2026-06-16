import { createClient } from "@/lib/supabase/server";

const LIMITS: Record<string, { max: number; windowMinutes: number }> = {
  booking: { max: 5, windowMinutes: 60 },
  forum_post: { max: 10, windowMinutes: 60 },
  forum_reply: { max: 30, windowMinutes: 60 },
  report: { max: 10, windowMinutes: 60 },
};

export async function checkRateLimit(userId: string, action: keyof typeof LIMITS) {
  const config = LIMITS[action];
  if (!config) return { ok: true as const };

  const supabase = await createClient();
  const since = new Date(Date.now() - config.windowMinutes * 60 * 1000).toISOString();

  const { count, error } = await supabase
    .from("rate_limit_events")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("action", action)
    .gte("created_at", since);

  if (error) return { ok: true as const };

  if ((count ?? 0) >= config.max) {
    return { ok: false as const, error: `Too many requests. Try again in ${config.windowMinutes} minutes.` };
  }

  await supabase.from("rate_limit_events").insert({ user_id: userId, action });
  return { ok: true as const };
}
