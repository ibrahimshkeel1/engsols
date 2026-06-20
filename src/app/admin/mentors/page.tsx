import { getAllMentorProfilesForAdmin } from "@/lib/data/mentors";
import { approveMentor } from "@/actions";
import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/EmptyState";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { RejectMentorButton } from "@/components/admin/RejectMentorButton";
import { FeaturedMentorToggle } from "@/components/admin/FeaturedMentorToggle";
import { VerifyMentorToggle } from "@/components/admin/VerifyMentorToggle";
import { AdminMentorExtrasForm } from "@/components/admin/AdminMentorExtrasForm";

export default async function AdminMentorsPage() {
  const mentors = await getAllMentorProfilesForAdmin();

  return (
    <div>
      <h1 className="text-2xl font-bold">Mentor applications</h1>
      <p className="mt-1 text-muted-foreground">Approve or reject mentor profiles before they appear publicly.</p>
      <div className="mt-8 space-y-4">
        {mentors.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No mentor applications yet"
            description="Profiles appear here when mentors apply through the application form."
            action={{ href: "/apply", label: "View application page" }}
          />
        ) : (
          mentors.map((m) => (
            <Card key={m.id} className="card-elevated">
              <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold">{m.profiles?.full_name || "Mentor"}</h2>
                    <Badge className={m.status === "approved" ? "bg-zone-mentorship/15 text-zone-mentorship-on" : m.status === "pending" ? "bg-primary/15 text-primary" : ""}>
                      {m.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{m.headline}</p>
                  <p className="mt-2 text-sm">{m.company} · {m.discipline} · {m.years_experience} yrs · ${m.monthly_rate}/mo</p>
                  <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{m.bio}</p>
                </div>
                {m.status === "pending" && (
                  <div className="flex shrink-0 gap-2">
                    <form action={approveMentor}>
                      <input type="hidden" name="id" value={m.id} />
                      <SubmitButton variant="accent" size="sm" pendingLabel="Approving...">
                        Approve
                      </SubmitButton>
                    </form>
                    <RejectMentorButton mentorId={m.id} />
                  </div>
                )}
                {m.status === "approved" && (
                  <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                    <FeaturedMentorToggle mentorId={m.id} featured={m.featured} />
                    <VerifyMentorToggle mentorId={m.id} verified={m.verified ?? false} />
                    <AdminMentorExtrasForm
                      mentorId={m.id}
                      respondsWithinHours={m.responds_within_hours}
                      introSlotsThisWeek={m.intro_slots_this_week}
                      introVideoUrl={m.intro_video_url}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
