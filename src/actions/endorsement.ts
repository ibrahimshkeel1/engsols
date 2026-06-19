"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";

const endorseSchema = z.object({
  projectId: z.string().uuid(),
  portfolioId: z.string().uuid(),
  text: z.string().trim().max(2000).optional().default(""),
});

export async function endorseProject(projectId: string, portfolioId: string, text?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in" };

  const parsed = endorseSchema.safeParse({ projectId, portfolioId, text });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid input" };
  }

  const { data: mentor } = await supabase
    .from("mentor_profiles")
    .select("id, status, user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!mentor || mentor.status !== "approved") {
    return { error: "Only approved mentors can endorse student projects" };
  }

  const { data: portfolio } = await supabase
    .from("portfolios")
    .select("id, user_id, slug, published")
    .eq("id", parsed.data.portfolioId)
    .maybeSingle();

  if (!portfolio?.published) return { error: "Portfolio not found or not published" };
  if (portfolio.user_id === user.id) return { error: "You cannot endorse your own portfolio" };

  const { data: project } = await supabase
    .from("portfolio_projects")
    .select("id, portfolio_id")
    .eq("id", parsed.data.projectId)
    .maybeSingle();

  if (!project || project.portfolio_id !== parsed.data.portfolioId) {
    return { error: "Project does not belong to this portfolio" };
  }

  const { error } = await supabase.from("project_endorsements").upsert(
    {
      mentor_profile_id: mentor.id,
      portfolio_id: parsed.data.portfolioId,
      portfolio_project_id: parsed.data.projectId,
      mentor_user_id: user.id,
      endorsement_text: parsed.data.text,
    },
    { onConflict: "mentor_profile_id,portfolio_project_id" },
  );

  if (error) return { error: error.message };

  revalidatePath(`/portfolios/${portfolio.slug}`);
  revalidatePath("/portfolios");
  revalidatePath("/companies/talent");
  return { success: true };
}

export async function removeEndorsement(projectId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in" };

  const projectIdParsed = z.string().uuid().safeParse(projectId);
  if (!projectIdParsed.success) return { error: "Invalid project ID" };

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  const isAdmin = profile?.role === "admin";

  const { data: mentor } = await supabase
    .from("mentor_profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!isAdmin && !mentor) return { error: "Unauthorized" };

  let deleteQuery = supabase
    .from("project_endorsements")
    .delete()
    .eq("portfolio_project_id", projectIdParsed.data);

  if (!isAdmin && mentor) {
    deleteQuery = deleteQuery.eq("mentor_profile_id", mentor.id);
  }

  const { data: deleted, error } = await deleteQuery.select("id, portfolios(slug)");

  if (error) return { error: error.message };
  if (!deleted?.length) return { error: "Endorsement not found" };

  const portfolioSlug = (deleted[0].portfolios as { slug?: string } | null)?.slug;
  if (portfolioSlug) revalidatePath(`/portfolios/${portfolioSlug}`);
  revalidatePath("/portfolios");
  revalidatePath("/companies/talent");
  return { success: true };
}

export async function removeEndorsementAsAdmin(projectId: string) {
  await requireRole(["admin"]);
  return removeEndorsement(projectId);
}
