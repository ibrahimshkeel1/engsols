import { createClient } from "@/lib/supabase/server";
import { getServiceSupabase, isServiceSupabaseConfigured } from "@/lib/supabase/service";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function hasUserPurchasedExam(userId: string, examId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const supabase = await createClient();
  const { data } = await supabase
    .from("user_purchased_exams")
    .select("id")
    .eq("user_id", userId)
    .eq("exam_id", examId)
    .maybeSingle();

  return Boolean(data);
}

export async function recordExamPurchase(
  userId: string,
  examId: string,
  stripeSessionId: string,
  stripeCustomerId?: string | null,
): Promise<{ error?: string }> {
  if (!isServiceSupabaseConfigured()) {
    return { error: "Purchase recording is not configured" };
  }

  const supabase = getServiceSupabase();
  const { error } = await supabase.from("user_purchased_exams").upsert(
    {
      user_id: userId,
      exam_id: examId,
      stripe_session_id: stripeSessionId,
      stripe_customer_id: stripeCustomerId ?? null,
    },
    { onConflict: "user_id,exam_id" },
  );

  if (error) return { error: error.message };
  return {};
}
