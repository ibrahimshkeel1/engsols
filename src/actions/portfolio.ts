"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { portfolioExperienceSchema, portfolioProjectSchema } from "@/lib/validation";

export async function savePortfolioProject(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in" };

  const { data: portfolio } = await supabase
    .from("portfolios")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!portfolio) return { error: "Create your portfolio first" };

  const parsed = portfolioProjectSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    tags: (formData.get("tags") as string || "").split(",").map((s) => s.trim()).filter(Boolean),
    year: parseInt(formData.get("year") as string, 10) || new Date().getFullYear(),
  });

  if (!parsed.success) return { error: parsed.error.issues[0]?.message || "Invalid project" };

  const projectId = formData.get("projectId") as string | null;
  const payload = {
    portfolio_id: portfolio.id,
    title: parsed.data.title,
    description: parsed.data.description,
    tags: parsed.data.tags,
    year: parsed.data.year,
  };

  const { error } = projectId
    ? await supabase.from("portfolio_projects").update(payload).eq("id", projectId)
    : await supabase.from("portfolio_projects").insert(payload);

  if (error) return { error: error.message };
  revalidatePath("/portfolios/build");
  revalidatePath("/portfolios");
  return { success: true };
}

export async function deletePortfolioProject(projectId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: project } = await supabase
    .from("portfolio_projects")
    .select("portfolio_id, portfolios(user_id)")
    .eq("id", projectId)
    .single();

  const ownerId = (project?.portfolios as { user_id?: string } | null)?.user_id;
  if (ownerId !== user.id) return { error: "Unauthorized" };

  await supabase.from("portfolio_projects").delete().eq("id", projectId);
  revalidatePath("/portfolios/build");
  return { success: true };
}

export async function savePortfolioExperience(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in" };

  const { data: portfolio } = await supabase
    .from("portfolios")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!portfolio) return { error: "Create your portfolio first" };

  const parsed = portfolioExperienceSchema.safeParse({
    role: formData.get("role"),
    company: formData.get("company"),
    duration: formData.get("duration"),
    description: formData.get("description"),
  });

  if (!parsed.success) return { error: parsed.error.issues[0]?.message || "Invalid experience" };

  const experienceId = formData.get("experienceId") as string | null;
  const payload = {
    portfolio_id: portfolio.id,
    role: parsed.data.role,
    company: parsed.data.company,
    duration: parsed.data.duration,
    description: parsed.data.description,
  };

  const { error } = experienceId
    ? await supabase.from("portfolio_experience").update(payload).eq("id", experienceId)
    : await supabase.from("portfolio_experience").insert(payload);

  if (error) return { error: error.message };
  revalidatePath("/portfolios/build");
  return { success: true };
}

export async function deletePortfolioExperience(experienceId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: exp } = await supabase
    .from("portfolio_experience")
    .select("portfolio_id, portfolios(user_id)")
    .eq("id", experienceId)
    .single();

  const ownerId = (exp?.portfolios as { user_id?: string } | null)?.user_id;
  if (ownerId !== user.id) return { error: "Unauthorized" };

  await supabase.from("portfolio_experience").delete().eq("id", experienceId);
  revalidatePath("/portfolios/build");
  return { success: true };
}
