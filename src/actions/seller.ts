"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 60);
}

export async function createSellerProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/marketplace/seller/new");

  const name = (formData.get("name") as string).trim();
  if (!name) redirect("/marketplace/seller/new?error=" + encodeURIComponent("Business name is required"));

  const slug = `${slugify(name)}-${user.id.slice(0, 8)}`;

  const { data: existing } = await supabase
    .from("sellers")
    .select("slug")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (existing) {
    redirect("/marketplace/sell?message=" + encodeURIComponent("You already have a seller profile."));
  }

  const { error } = await supabase.from("sellers").insert({
    slug,
    name,
    type: (formData.get("type") as string) || "distributor",
    location: (formData.get("location") as string) || "",
    country: (formData.get("country") as string) || "",
    description: (formData.get("description") as string) || "",
    owner_id: user.id,
    verified: false,
    published: false,
  });

  if (error) redirect("/marketplace/seller/new?error=" + encodeURIComponent(error.message));

  revalidatePath("/marketplace/sell");
  redirect("/marketplace/sell?message=" + encodeURIComponent("Seller profile submitted. An admin will review before it goes live."));
}
