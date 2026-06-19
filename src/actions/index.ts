"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";
import { isLiveKitConfigured } from "@/lib/livekit/config";
import { isSupabaseConfigured, getSupabaseConfigError } from "@/lib/supabase/config";
import { ensureUserProfile } from "@/lib/supabase/profile";
import { requireRole } from "@/lib/auth";
import { getSafeNextPath } from "@/lib/safe-next";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

function isNextRedirect(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof (error as { digest: unknown }).digest === "string" &&
    (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  );
}

async function redirectAfterSignIn(
  supabase: Awaited<ReturnType<typeof createClient>>,
  user: User,
  nextPath?: string | null,
) {
  let profile;
  try {
    profile = await ensureUserProfile(supabase, user);
  } catch {
    redirect(
      "/login?error=" +
        encodeURIComponent("Could not load your profile. Run supabase/migrations/003_profile_trigger.sql, then try again."),
    );
  }

  revalidatePath("/", "layout");

  const safeNext = getSafeNextPath(nextPath ?? undefined);
  if (safeNext) redirect(safeNext);

  if (profile.role === "admin") redirect("/admin");

  if (profile.role === "mentor") {
    const { data: mentorProfile } = await supabase
      .from("mentor_profiles")
      .select("status")
      .eq("user_id", user.id)
      .maybeSingle();
    if (!mentorProfile) redirect("/onboarding/mentor");
    if (mentorProfile.status === "approved") redirect("/mentor");
    redirect("/apply");
  }

  const { data: portfolio } = await supabase
    .from("portfolios")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!portfolio) redirect("/onboarding/student");
  redirect("/");
}

export async function signUp(formData: FormData) {
  const configError = getSupabaseConfigError();
  if (configError) {
    redirect("/signup?error=" + encodeURIComponent(configError));
  }

  try {
    const supabase = await createClient();
    const email = ((formData.get("email") as string | null) ?? "").trim();
    const password = (formData.get("password") as string | null) ?? "";
    const fullName = ((formData.get("fullName") as string | null) ?? "").trim();
    const role = (formData.get("role") as string | null) ?? "student";

    if (!email || !password || !fullName) {
      redirect("/signup?error=" + encodeURIComponent("Fill in all required fields"));
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role },
        emailRedirectTo: `${siteUrl}/auth/callback`,
      },
    });

    if (error) redirect(`/signup?error=${encodeURIComponent(error.message)}`);

    if (data.user && data.session) {
      await ensureUserProfile(supabase, data.user);
      revalidatePath("/", "layout");

      if (role === "mentor") redirect("/onboarding/mentor");
      redirect("/onboarding/student");
    }

    redirect(
      "/login?message=" +
        encodeURIComponent(
          "Account created. Check your email to confirm, then log in. (Or disable email confirmation in Supabase → Authentication → Providers → Email.)",
        ),
    );
  } catch (error) {
    if (isNextRedirect(error)) throw error;
    const message = error instanceof Error ? error.message : "Sign-up failed";
    redirect(`/signup?error=${encodeURIComponent(message)}`);
  }
}

export async function signIn(formData: FormData) {
  const configError = getSupabaseConfigError();
  if (configError) {
    redirect("/login?error=" + encodeURIComponent(configError));
  }

  try {
    const supabase = await createClient();
    const emailInput = ((formData.get("email") as string | null) ?? "").trim();
    const password = (formData.get("password") as string | null) ?? "";
    const nextPath = (formData.get("next") as string | null) ?? null;

    if (!emailInput || !password) {
      redirect("/login?error=" + encodeURIComponent("Enter username and password"));
    }

    const email = emailInput.includes("@") ? emailInput : `${emailInput}@engsols.com`;

    const { data: signInData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      const message =
        authError.message.includes("Invalid path specified in request URL")
          ? "Supabase URL is misconfigured. In Vercel, set NEXT_PUBLIC_SUPABASE_URL to https://YOUR-PROJECT.supabase.co (no /rest/v1)."
          : authError.message;
      redirect(`/login?error=${encodeURIComponent(message)}`);
    }

    const user = signInData.user;
    if (!user) {
      redirect("/login?error=" + encodeURIComponent("Sign-in failed. Try again."));
    }

    if (process.env.ENFORCE_EMAIL_VERIFICATION === "true" && !user.email_confirmed_at) {
      await supabase.auth.signOut();
      redirect(
        "/login?error=" +
          encodeURIComponent("Please confirm your email before signing in. Check your inbox for the verification link."),
      );
    }

    await redirectAfterSignIn(supabase, user, nextPath);
  } catch (error) {
    if (isNextRedirect(error)) throw error;
    const message = error instanceof Error ? error.message : "Sign-in failed";
    redirect(`/login?error=${encodeURIComponent(message)}`);
  }
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function signInWithGoogle(nextPath?: string) {
  const configError = getSupabaseConfigError();
  if (configError) {
    redirect("/login?error=" + encodeURIComponent(configError));
  }

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const safeNext = getSafeNextPath(nextPath);
  const redirectTo = safeNext
    ? `${siteUrl}/auth/callback?next=${encodeURIComponent(safeNext)}`
    : `${siteUrl}/auth/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });

  if (error || !data.url) {
    redirect("/login?error=" + encodeURIComponent(error?.message ?? "Google sign-in failed"));
  }

  redirect(data.url);
}

export async function updateProfileAvatar(avatarUrl: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in" };

  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: avatarUrl })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  revalidatePath("/mentors");
  revalidatePath("/portfolios");
  revalidatePath("/settings");
  return { success: true };
}

export async function updateProfileName(fullName: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in" };

  const trimmed = fullName.trim();
  if (!trimmed) return { error: "Name is required" };

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: trimmed })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  revalidatePath("/settings");
  return { success: true };
}

function parseImageUrls(raw: FormDataEntryValue | null): string[] {
  if (!raw || typeof raw !== "string" || !raw.trim()) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((u): u is string => typeof u === "string") : [];
  } catch {
    return [];
  }
}

export async function createForumPost(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/forum/new");

  const title = formData.get("title") as string;
  const body = formData.get("body") as string;
  const discipline = formData.get("discipline") as string;
  const imageUrls = parseImageUrls(formData.get("imageUrls"));
  const slug = `${slugify(title)}-${Date.now().toString(36)}`;

  const { error } = await supabase.from("forum_posts").insert({
    slug,
    author_id: user.id,
    title,
    body,
    discipline,
    tags: [],
    image_urls: imageUrls,
  });

  if (error) redirect(`/forum/new?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/forum");
  redirect(`/forum/${slug}`);
}

export async function createForumReply(postId: string, body: string, imageUrls: string[] = []) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in" };

  const { data: post } = await supabase
    .from("forum_posts")
    .select("author_id, title, slug")
    .eq("id", postId)
    .single();

  const { error } = await supabase.from("forum_replies").insert({
    post_id: postId,
    author_id: user.id,
    body,
    image_urls: imageUrls,
  });

  if (error) return { error: error.message };

  if (post?.author_id && post.author_id !== user.id) {
    const { data: replier } = await supabase.from("profiles").select("full_name").eq("id", user.id).single();
    const { data: author } = await supabase.from("profiles").select("email").eq("id", post.author_id).single();

    if (author?.email) {
      const { forumReplyEmail, sendEmail } = await import("@/lib/email");
      const mail = forumReplyEmail({
        postTitle: post.title,
        replierName: replier?.full_name ?? "Someone",
        postSlug: post.slug,
      });
      await sendEmail({ to: author.email, ...mail });
    }

    const { createNotification } = await import("@/lib/notifications");
    await createNotification({
      userId: post.author_id,
      title: "New forum reply",
      body: `${replier?.full_name ?? "Someone"} replied to "${post.title}".`,
      url: `/forum/${post.slug}`,
    });

    const { sendPushToUser } = await import("@/lib/push");
    await sendPushToUser({
      userId: post.author_id,
      title: "New forum reply",
      body: `Someone replied to your thread.`,
      url: `/forum/${post.slug}`,
    });
  }

  revalidatePath("/forum");
  return { success: true };
}

export async function savePortfolio(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/portfolios/build");

  const headline = formData.get("headline") as string;
  const university = formData.get("university") as string;
  const discipline = formData.get("discipline") as string;
  const bio = formData.get("bio") as string;
  const skills = (formData.get("skills") as string).split(",").map((s) => s.trim()).filter(Boolean);
  const publish = formData.get("publish") === "true";

  const { data: existing } = await supabase
    .from("portfolios")
    .select("id, slug")
    .eq("user_id", user.id)
    .single();

  const slug = existing?.slug ?? `${slugify(headline || user.id)}-${user.id.slice(0, 8)}`;

  const payload = {
    user_id: user.id,
    slug,
    headline,
    university,
    discipline,
    bio,
    skills,
    published: publish,
    open_to_work: true,
    seeking: "full-time",
    location: "",
    credentials: [],
  };

  const { error } = existing
    ? await supabase.from("portfolios").update(payload).eq("user_id", user.id)
    : await supabase.from("portfolios").insert(payload);

  if (error) redirect(`/portfolios/build?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/portfolios");
  redirect(`/portfolios/${slug}`);
}

export async function submitMentorApplication(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/apply");

  await supabase.from("profiles").update({ role: "mentor" }).eq("id", user.id);

  const headline = formData.get("headline") as string;
  const company = formData.get("company") as string;
  const discipline = formData.get("discipline") as string;
  const bio = formData.get("bio") as string;
  const years = parseInt(formData.get("yearsExperience") as string, 10) || 0;
  const monthlyRate = parseInt(formData.get("monthlyRate") as string, 10) || 150;
  const slug = `${slugify(headline || user.id)}-${user.id.slice(0, 8)}`;

  const { data: existing } = await supabase
    .from("mentor_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  const payload = {
    user_id: user.id,
    slug,
    headline,
    company,
    discipline,
    bio,
    years_experience: years,
    monthly_rate: monthlyRate,
    status: "pending" as const,
    sub_fields: [],
    skills: (formData.get("skills") as string || "").split(",").map((s) => s.trim()).filter(Boolean),
    goals: formData.getAll("goals").map(String).filter(Boolean),
    credentials: [],
  };

  const { error } = existing
    ? await supabase.from("mentor_profiles").update(payload).eq("user_id", user.id)
    : await supabase.from("mentor_profiles").insert(payload);

  if (error) redirect(`/apply?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin");
  redirect("/mentor?message=Application submitted for review");
}

async function updateMentorStatus(mentorId: string, status: "approved" | "rejected") {
  const admin = await requireRole(["admin"]);
  if (!admin) return;

  const supabase = await createClient();
  await supabase.from("mentor_profiles").update({ status }).eq("id", mentorId);
  revalidatePath("/admin");
  revalidatePath("/mentors");
}

export async function approveMentor(formData: FormData) {
  const id = formData.get("id") as string;
  await updateMentorStatus(id, "approved");
}

export async function rejectMentor(formData: FormData) {
  const id = formData.get("id") as string;
  await updateMentorStatus(id, "rejected");
  revalidatePath("/admin/mentors");
}

export async function updateBookingStatus(bookingId: string, status: "pending" | "contacted" | "closed") {
  const admin = await requireRole(["admin"]);
  if (!admin) return { error: "Unauthorized" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("booking_requests")
    .update({ status })
    .eq("id", bookingId);

  if (error) return { error: error.message };
  revalidatePath("/admin/bookings");
  return { success: true };
}

export async function createLiveSession(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const nextPath = (formData.get("next") as string) || "/live/new";
  if (!user) redirect(`/login?next=${encodeURIComponent(nextPath)}`);

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const discipline = formData.get("discipline") as string;
  const scheduledAtInput = formData.get("scheduledAt") as string;
  const startNow = formData.get("startNow") === "true";
  const callType = (formData.get("callType") as string) || "scheduled";
  const forumPostId = formData.get("forumPostId") as string | null;
  const maxParticipants = parseInt(formData.get("maxParticipants") as string, 10) || 50;
  const slug = `${slugify(title)}-${Date.now().toString(36)}`;
  const roomName = slug;

  if (!startNow && !scheduledAtInput) {
    redirect(`${nextPath}?error=${encodeURIComponent("Please set a date and time, or use Go live now")}`);
  }

  const scheduledAt = startNow
    ? new Date().toISOString()
    : scheduledAtInput || new Date().toISOString();

  const { data: mentor } = await supabase
    .from("mentor_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (isLiveKitConfigured()) {
    const { ensureLiveKitRoom } = await import("@/lib/livekit/server");
    await ensureLiveKitRoom(roomName, maxParticipants);
  }

  const { error } = await supabase.from("live_sessions").insert({
    slug,
    host_id: user.id,
    mentor_profile_id: mentor?.id ?? null,
    title,
    description,
    discipline,
    scheduled_at: scheduledAt,
    status: startNow ? "live" : "upcoming",
    room_name: roomName,
    call_type: callType,
    forum_post_id: forumPostId || null,
    max_participants: maxParticipants,
    access_mode: callType === "mentorship_1on1" ? "invite_only" : "authenticated",
  });

  if (error) redirect(`${nextPath}?error=${encodeURIComponent(error.message)}`);

  revalidatePath("/live");
  revalidatePath("/calls");
  revalidatePath("/forum");

  if (startNow) redirect(`/live/${slug}/room`);
  redirect(`/live/${slug}`);
}

export async function goLiveFromForum(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const postId = formData.get("postId") as string;
  const postSlug = formData.get("postSlug") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const discipline = formData.get("discipline") as string;

  if (!user) redirect(`/login?next=/forum/${postSlug}`);

  const slug = `${slugify(title)}-${Date.now().toString(36)}`;
  const roomName = slug;

  const { data: mentor } = await supabase
    .from("mentor_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (isLiveKitConfigured()) {
    const { ensureLiveKitRoom } = await import("@/lib/livekit/server");
    await ensureLiveKitRoom(roomName, 50);
  }

  const { error } = await supabase.from("live_sessions").insert({
    slug,
    host_id: user.id,
    mentor_profile_id: mentor?.id ?? null,
    title,
    description,
    discipline,
    scheduled_at: new Date().toISOString(),
    status: "live",
    room_name: roomName,
    call_type: "forum_instant",
    forum_post_id: postId,
    max_participants: 50,
    access_mode: "authenticated",
  });

  if (error) redirect(`/forum/${postSlug}?error=${encodeURIComponent(error.message)}`);

  const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single();
  const name = profile?.full_name || "Someone";

  await supabase.from("forum_replies").insert({
    post_id: postId,
    author_id: user.id,
    body: `${name} started a live video discussion on this topic. Join at /live/${slug}/room`,
  });

  revalidatePath("/live");
  revalidatePath(`/forum/${postSlug}`);
  redirect(`/live/${slug}/room`);
}

export async function startLiveSession(slug: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/live/${slug}`);

  const { data: session } = await supabase
    .from("live_sessions")
    .select("host_id, room_name, slug, max_participants")
    .eq("slug", slug)
    .single();

  if (!session || session.host_id !== user.id) return;

  const roomName = session.room_name || session.slug;
  if (isLiveKitConfigured()) {
    const { ensureLiveKitRoom } = await import("@/lib/livekit/server");
    await ensureLiveKitRoom(roomName, session.max_participants ?? 50);
  }

  await supabase
    .from("live_sessions")
    .update({ status: "live", scheduled_at: new Date().toISOString() })
    .eq("slug", slug);

  revalidatePath("/live");
  revalidatePath(`/live/${slug}`);
  revalidatePath("/forum");
}

export async function endLiveSession(slug: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role === "admin";

  const { data: session } = await supabase
    .from("live_sessions")
    .select("host_id, room_name, slug, status")
    .eq("slug", slug)
    .single();

  if (!session) return;
  if (session.host_id !== user.id && !isAdmin) return;
  if (session.status === "ended") return;

  const roomName = session.room_name || session.slug;
  if (isLiveKitConfigured()) {
    const { deleteLiveKitRoom } = await import("@/lib/livekit/server");
    await deleteLiveKitRoom(roomName);
  }

  await supabase
    .from("live_sessions")
    .update({ status: "ended", ended_at: new Date().toISOString() })
    .eq("slug", slug);

  revalidatePath("/live");
  revalidatePath(`/live/${slug}`);
  revalidatePath("/calls");
  revalidatePath("/forum");
  revalidatePath("/admin");
  revalidatePath("/admin/live");
}

export async function createNewsArticle(formData: FormData) {
  const admin = await requireRole(["admin"]);
  if (!admin) redirect("/login?next=/admin/news/new");

  const supabase = await createClient();
  const title = formData.get("title") as string;
  const excerpt = formData.get("excerpt") as string;
  const body = formData.get("body") as string;
  const category = formData.get("category") as string;
  const publish = formData.get("publish") === "true";
  const coverImageUrl = (formData.get("coverImageUrl") as string | null)?.trim() || null;
  const slug = slugify(title);

  const { error } = await supabase.from("news_articles").insert({
    slug,
    title,
    excerpt,
    body,
    category,
    author_id: admin.id,
    published: publish,
    published_at: publish ? new Date().toISOString() : null,
    featured: false,
    cover_image_url: coverImageUrl,
  });

  if (error) redirect(`/admin/news/new?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/news");
  revalidatePath("/admin");
  redirect("/admin/news");
}

async function insertContactRequest(fields: {
  refSlug: string;
  refName: string;
  requesterName: string;
  requesterEmail: string;
  message: string;
  requestType: string;
}) {
  if (!isSupabaseConfigured()) return { error: "Database not configured" };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in to submit a request" };

  const { checkRateLimit } = await import("@/lib/rate-limit");
  const limited = await checkRateLimit(user.id, "booking");
  if (!limited.ok) return { error: limited.error };

  const { contactSchema } = await import("@/lib/validation");
  const parsed = contactSchema.safeParse({
    name: fields.requesterName,
    email: fields.requesterEmail,
    message: fields.message,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid input" };
  }

  let mentorUserId: string | null = null;
  let mentorEmail: string | null = null;
  let sellerSlug: string | null = null;
  let listingSlug: string | null = null;
  const mentorTypes = ["intro", "monthly", "study-plan", "interview-prep"];

  if (mentorTypes.includes(fields.requestType)) {
    const { data: mp } = await supabase
      .from("mentor_profiles")
      .select("user_id")
      .eq("slug", fields.refSlug)
      .maybeSingle();
    mentorUserId = mp?.user_id ?? null;
    if (mentorUserId) {
      const { data: prof } = await supabase.from("profiles").select("email").eq("id", mentorUserId).single();
      mentorEmail = prof?.email ?? null;
    }
  }

  if (fields.requestType.startsWith("marketplace_")) {
    listingSlug = fields.refSlug;
    const { data: listing } = await supabase
      .from("marketplace_listings")
      .select("seller_slug")
      .eq("slug", listingSlug)
      .maybeSingle();
    if (listing?.seller_slug) {
      sellerSlug = listing.seller_slug;
      const { data: seller } = await supabase
        .from("sellers")
        .select("owner_id, name")
        .eq("slug", sellerSlug)
        .maybeSingle();
      if (seller?.owner_id) {
        mentorUserId = seller.owner_id;
        const { data: prof } = await supabase.from("profiles").select("email").eq("id", seller.owner_id).single();
        mentorEmail = prof?.email ?? null;
      }
    }
  }

  const { error } = await supabase.from("booking_requests").insert({
    mentor_slug: fields.refSlug,
    mentor_name: fields.refName,
    requester_name: parsed.data.name,
    requester_email: parsed.data.email,
    message: parsed.data.message,
    request_type: fields.requestType,
    user_id: user.id,
    mentor_user_id: mentorUserId,
    seller_slug: sellerSlug,
    listing_slug: listingSlug,
  });

  if (error) return { error: error.message };

  if (mentorEmail && mentorTypes.includes(fields.requestType)) {
    const { notifyMentorOfBooking } = await import("@/actions/mentor");
    await notifyMentorOfBooking({
      mentorEmail,
      mentorName: fields.refName,
      requesterName: parsed.data.name,
      requesterEmail: parsed.data.email,
      message: parsed.data.message,
      type: fields.requestType,
    });
    if (mentorUserId) {
      const { createNotification } = await import("@/lib/notifications");
      await createNotification({
        userId: mentorUserId,
        title: "New booking request",
        body: `${parsed.data.name} requested a ${fields.requestType.replace(/-/g, " ")} session.`,
        url: "/mentor/bookings",
      });
      const { sendPushToUser } = await import("@/lib/push");
      await sendPushToUser({
        userId: mentorUserId,
        title: "New booking request",
        body: `${parsed.data.name} sent a request.`,
        url: "/mentor/bookings",
      });
    }
  }

  if (fields.requestType.startsWith("marketplace_") && mentorUserId && mentorEmail) {
    const { marketplaceInquiryEmail, sendEmail } = await import("@/lib/email");
    const mail = marketplaceInquiryEmail({
      sellerName: fields.refName,
      listingTitle: fields.refName,
      requesterName: parsed.data.name,
      requesterEmail: parsed.data.email,
      message: parsed.data.message,
    });
    await sendEmail({ to: mentorEmail, ...mail });
    const { createNotification } = await import("@/lib/notifications");
    await createNotification({
      userId: mentorUserId,
      title: "New marketplace inquiry",
      body: `${parsed.data.name} inquired about ${fields.refName}.`,
      url: "/marketplace/seller",
    });
    const { sendPushToUser } = await import("@/lib/push");
    await sendPushToUser({
      userId: mentorUserId,
      title: "New marketplace inquiry",
      body: `${parsed.data.name} sent an inquiry.`,
      url: "/marketplace/seller",
    });
  }

  if (fields.requestType === "portfolio") {
    const { data: portfolio } = await supabase
      .from("portfolios")
      .select("user_id, profiles(full_name)")
      .eq("slug", fields.refSlug)
      .maybeSingle();
    if (portfolio?.user_id) {
      const studentName = (portfolio.profiles as { full_name?: string } | null)?.full_name ?? fields.refName;
      const { data: prof } = await supabase.from("profiles").select("email").eq("id", portfolio.user_id).single();
      if (prof?.email) {
        const { portfolioContactEmail, sendEmail } = await import("@/lib/email");
        const mail = portfolioContactEmail({
          studentName,
          requesterName: parsed.data.name,
          requesterEmail: parsed.data.email,
          message: parsed.data.message,
        });
        await sendEmail({ to: prof.email, ...mail });
      }
      const { createNotification } = await import("@/lib/notifications");
      await createNotification({
        userId: portfolio.user_id,
        title: "Portfolio contact",
        body: `${parsed.data.name} reached out via your portfolio.`,
        url: `/portfolios/${fields.refSlug}`,
      });
    }
  }

  return { success: true };
}

export async function submitBookingRequest(formData: FormData) {
  const result = await insertContactRequest({
    refSlug: formData.get("mentorSlug") as string,
    refName: formData.get("mentorName") as string,
    requesterName: formData.get("name") as string,
    requesterEmail: formData.get("email") as string,
    message: formData.get("message") as string,
    requestType: formData.get("type") as string,
  });
  if (result?.error) throw new Error(result.error);
  return { success: true };
}

export async function submitPortfolioContact(formData: FormData) {
  const result = await insertContactRequest({
    refSlug: formData.get("portfolioSlug") as string,
    refName: formData.get("studentName") as string,
    requesterName: formData.get("name") as string,
    requesterEmail: formData.get("email") as string,
    message: formData.get("message") as string,
    requestType: "portfolio",
  });
  if (result?.error) throw new Error(result.error);
  return { success: true };
}

export async function submitJobApplication(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in" };

  const { checkRateLimit } = await import("@/lib/rate-limit");
  const limited = await checkRateLimit(user.id, "job_application");
  if (!limited.ok) return { error: limited.error };

  const jobSlug = formData.get("jobSlug") as string;
  const { data: job } = await supabase.from("jobs").select("id, title").eq("slug", jobSlug).single();
  if (!job) return { error: "Job not found" };

  const name = (formData.get("name") as string).trim();
  const email = (formData.get("email") as string).trim();
  const message = (formData.get("message") as string).trim();

  const { error } = await supabase.from("job_applications").insert({
    job_id: job.id,
    job_slug: jobSlug,
    applicant_id: user.id,
    applicant_name: name,
    applicant_email: email,
    message,
  });

  if (error) return { error: error.message };

  const { sendEmail, jobApplicationEmail, jobApplicationConfirmationEmail } = await import("@/lib/email");
  const confirmMail = jobApplicationConfirmationEmail({ applicantName: name, jobTitle: job.title });
  await sendEmail({ to: email, ...confirmMail });

  const { createNotification } = await import("@/lib/notifications");
  await createNotification({
    userId: user.id,
    title: "Application submitted",
    body: `You applied to ${job.title}.`,
    url: "/settings",
  });

  if (job.id) {
    const { data: poster } = await supabase.from("jobs").select("posted_by").eq("id", job.id).single();
    if (poster?.posted_by) {
      const { data: prof } = await supabase.from("profiles").select("email").eq("id", poster.posted_by).single();
      if (prof?.email) {
        const mail = jobApplicationEmail({ jobTitle: job.title, applicantName: name, applicantEmail: email, message });
        await sendEmail({ to: prof.email, ...mail });
      }
      const { sendPushToUser } = await import("@/lib/push");
      await sendPushToUser({
        userId: poster.posted_by,
        title: "New job application",
        body: `${name} applied to ${job.title}`,
        url: "/jobs/inbox",
      });
    }
  }

  revalidatePath("/jobs/inbox");
  revalidatePath("/admin/applications");
  return { success: true };
}

export async function submitMarketplaceInquiry(formData: FormData) {
  const listingTitle = formData.get("listingTitle") as string;
  const result = await insertContactRequest({
    refSlug: formData.get("listingSlug") as string,
    refName: listingTitle,
    requesterName: formData.get("name") as string,
    requesterEmail: formData.get("email") as string,
    message: formData.get("message") as string,
    requestType: formData.get("type") as string === "contact" ? "marketplace_contact" : "marketplace_quote",
  });
  if (result?.error) throw new Error(result.error);
  return { success: true };
}

export async function completeStudentOnboarding(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/onboarding/student");

  try {
    await ensureUserProfile(supabase, user);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create profile";
    redirect(`/onboarding/student?error=${encodeURIComponent(message)}`);
  }

  const discipline = formData.get("discipline") as string;
  const goal = formData.get("goal") as string;
  const university = formData.get("university") as string;

  await supabase.from("profiles").update({
    full_name: formData.get("fullName") as string || undefined,
    career_goals: [goal],
  }).eq("id", user.id);

  const headline = formData.get("headline") as string;
  const slug = `${slugify(headline || user.id)}-${user.id.slice(0, 8)}`;

  const { data: existing } = await supabase
    .from("portfolios")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  const payload = {
    user_id: user.id,
    slug,
    headline: headline || goal,
    university: university || "",
    discipline,
    bio: `Looking for mentorship in ${discipline}. Goal: ${goal}.`,
    skills: [] as string[],
    published: false,
    open_to_work: true,
    seeking: "full-time",
    location: "",
    credentials: [] as string[],
  };

  const { error } = existing
    ? await supabase.from("portfolios").update(payload).eq("user_id", user.id)
    : await supabase.from("portfolios").insert(payload);

  if (error) {
    redirect(`/onboarding/student?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/portfolios/build");
}

export async function completeMentorOnboarding() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/onboarding/mentor");

  await supabase.from("profiles").update({ role: "mentor" }).eq("id", user.id);
  redirect("/apply");
}
