import { createClient } from "@/lib/supabase/server";
import { getServiceSupabase, isServiceSupabaseConfigured } from "@/lib/supabase/service";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type PremiumAssetRow = {
  id: string;
  storage_path: string;
  title: string;
  exam_id: string | null;
  mime_type: string;
};

export async function getPremiumAssetById(fileId: string): Promise<PremiumAssetRow | null> {
  if (!isServiceSupabaseConfigured()) return null;

  const supabase = getServiceSupabase();
  const { data } = await supabase
    .from("premium_assets")
    .select("id, storage_path, title, exam_id, mime_type")
    .eq("id", fileId)
    .maybeSingle();

  return (data as PremiumAssetRow | null) ?? null;
}

export async function userHasPremiumAssetAccess(userId: string, examId: string | null): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const supabase = await createClient();

  if (examId) {
    const { data: purchase } = await supabase
      .from("user_purchased_exams")
      .select("id")
      .eq("user_id", userId)
      .eq("exam_id", examId)
      .maybeSingle();

    if (purchase) return true;
  }

  const { data: activeMentorship } = await supabase
    .from("booking_requests")
    .select("id")
    .eq("user_id", userId)
    .eq("request_type", "monthly")
    .eq("status", "contacted")
    .limit(1)
    .maybeSingle();

  return Boolean(activeMentorship);
}

export async function createPremiumAssetSignedUrl(storagePath: string, expiresInSeconds = 60) {
  if (!isServiceSupabaseConfigured()) return { error: "Storage is not configured" as const };

  const supabase = getServiceSupabase();
  const { data, error } = await supabase.storage
    .from("premium-assets")
    .createSignedUrl(storagePath, expiresInSeconds);

  if (error || !data?.signedUrl) {
    return { error: error?.message ?? "Could not sign asset URL" };
  }

  return { signedUrl: data.signedUrl };
}
