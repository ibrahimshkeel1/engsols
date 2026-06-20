import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getSavedMentors } from "@/lib/data/saved-mentors";
import { createClient } from "@/lib/supabase/server";
import { goals } from "@/data/goals";
import { ProfilePhotoUpload } from "@/components/profile/ProfilePhotoUpload";
import { ProfileNameForm } from "@/components/profile/ProfileNameForm";
import { GoalsProgress } from "@/components/settings/GoalsProgress";
import { SessionNotesSection } from "@/components/settings/SessionNotesSection";
import { StudentBookingsSection } from "@/components/settings/StudentBookingsSection";
import { StudentJobApplicationsSection } from "@/components/settings/StudentJobApplicationsSection";
import { LocalizedText } from "@/components/i18n/LocalizedText";
import { getStudentBookings, getStudentJobApplications } from "@/lib/data/student-activity";
import { getRoadmapsForStudent } from "@/lib/data/roadmaps";
import { MilestoneTracker } from "@/components/dashboard/MilestoneTracker";
import { ManageBillingButton } from "@/components/settings/ManageBillingButton";
import { PushNotificationPrompt } from "@/components/settings/PushNotificationPrompt";
import { Card, CardContent } from "@/components/ui/card";
import { CompareSavedMentorsButton } from "@/components/mentors/CompareSavedMentorsButton";
import { EmptyState } from "@/components/shared/EmptyState";
import { MentorCard } from "@/components/mentors/MentorCard";
import { ProfileBentoGrid } from "@/components/ui/ProfileBentoGrid";
import { Users } from "lucide-react";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/settings");

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("career_goals, goals_completed, forum_reputation")
    .eq("id", user.id)
    .single();

  const [savedMentors, { data: notes }, bookings, jobApplications, roadmaps] = await Promise.all([
    getSavedMentors(user.id),
    supabase.from("session_notes").select("*").eq("user_id", user.id).order("updated_at", { ascending: false }).limit(20),
    getStudentBookings(user.id),
    getStudentJobApplications(user.id),
    getRoadmapsForStudent(user.id),
  ]);

  const careerGoals = profile?.career_goals?.length ? profile.career_goals : goals.map((g) => g.label);
  const completedGoals = profile?.goals_completed ?? [];

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl tracking-tight">Account settings</h1>
      <p className="mt-2 text-muted-foreground">Manage your profile, goals, and saved mentors.</p>

      <Card className="card-elevated mt-8 border-zone-recruiter/15">
        <CardContent className="space-y-8 p-6">
          <section>
            <h2 className="font-semibold">Profile photo</h2>
            <div className="mt-4">
              <ProfilePhotoUpload name={user.full_name || "User"} initialUrl={user.avatar_url} />
            </div>
          </section>
          <section className="border-t border-border pt-8">
            <h2 className="font-semibold">Display name</h2>
            <div className="mt-4">
              <ProfileNameForm initialName={user.full_name || ""} />
            </div>
          </section>
          <section className="border-t border-border pt-8">
            <h2 className="font-semibold">Account</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Email</dt>
                <dd className="font-medium">{user.email}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Role</dt>
                <dd className="font-medium capitalize">{user.role}</dd>
              </div>
              {(profile?.forum_reputation ?? 0) > 0 && (
                <div>
                  <dt className="text-muted-foreground">Forum reputation</dt>
                  <dd className="font-medium">{profile?.forum_reputation} points from helpful replies</dd>
                </div>
              )}
            </dl>
            <div className="mt-4 space-y-3">
              <Link href="/settings/password" className="inline-block text-sm text-zone-recruiter hover:underline">
                Change password →
              </Link>
              <div className="rounded-xl border border-zone-recruiter/25 bg-zone-recruiter/5 p-4">
                <p className="text-sm font-semibold text-zone-recruiter">Billing & subscriptions</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Manage mentorship plans, premium exams, and payment methods in Stripe.
                </p>
                <div className="mt-4">
                  <ManageBillingButton />
                </div>
              </div>
              <div className="rounded-xl border border-zone-exams/20 bg-zone-exams/5 p-4">
                <p className="text-sm font-semibold text-zone-exams">Premium access</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Exam prep bundles and mentorship upgrades appear in your billing portal.
                </p>
              </div>
              <div>
                <p className="mb-2 text-sm text-muted-foreground">Browser notifications</p>
                <PushNotificationPrompt />
              </div>
            </div>
          </section>
        </CardContent>
      </Card>

      <Card className="card-elevated mt-8">
        <CardContent className="p-6">
          <h2 className="font-semibold">Career goals</h2>
          <p className="mt-1 text-sm text-muted-foreground">Track progress on goals you set during onboarding.</p>
          <div className="mt-4">
            <GoalsProgress goals={careerGoals} completed={completedGoals} />
          </div>
        </CardContent>
      </Card>

      <Card className="card-elevated mt-8 border-zone-mentorship/15">
        <CardContent className="p-6">
          <h2 className="font-semibold text-zone-mentorship">Mentorship roadmaps</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Milestones your mentor sets — track deadlines and study resources.
          </p>
          <div className="mt-4">
            <MilestoneTracker
              roadmaps={roadmaps}
              viewerRole="student"
              emptyMessage="Your mentor hasn't created a roadmap yet. Book a session to get started."
            />
          </div>
        </CardContent>
      </Card>

      <Card className="card-elevated mt-8" id="saved-mentors">
        <CardContent className="p-6">
          <h2 className="font-semibold">Saved mentors</h2>
          {savedMentors.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No saved mentors"
              description="Save mentors from their profile to compare and revisit later."
              action={{ href: "/mentors", label: "Browse mentors" }}
              promptChips={[{ label: "Compare mentors", href: "/mentors/compare" }]}
            />
          ) : (
            <>
              <CompareSavedMentorsButton mentors={savedMentors} />
              <ProfileBentoGrid
              className="mt-4"
              items={savedMentors}
              getKey={(m) => m.slug}
              isFeatured={(m) => m.featured}
              animated={false}
              renderCard={(m, variant) => <MentorCard mentor={m} variant={variant} showPrice={false} />}
            />
            </>
          )}
        </CardContent>
      </Card>

      <Card className="card-elevated mt-8" id="my-bookings">
        <CardContent className="p-6">
          <LocalizedText messageKey="myBookings" as="h2" className="font-semibold" />
          <p className="mt-1 text-sm text-muted-foreground">Track mentorship and one-off session requests.</p>
          <StudentBookingsSection bookings={bookings} />
        </CardContent>
      </Card>

      <Card className="card-elevated mt-8" id="job-applications">
        <CardContent className="p-6">
          <LocalizedText messageKey="myApplications" as="h2" className="font-semibold" />
          <StudentJobApplicationsSection applications={jobApplications} />
        </CardContent>
      </Card>

      <Card className="card-elevated mt-8">
        <CardContent className="p-6">
          <SessionNotesSection notes={notes ?? []} />
        </CardContent>
      </Card>
    </div>
  );
}
