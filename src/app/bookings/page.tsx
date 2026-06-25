import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getStudentBookings } from "@/lib/data/student-activity";
import { StudentBookingsSection } from "@/components/settings/StudentBookingsSection";
import { ButtonLink } from "@/components/ui/button";

export const metadata = {
  title: "My bookings | EngSols",
  description: "Track mentorship and session requests you've sent to mentors.",
};

export default async function BookingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/bookings");

  const bookings = await getStudentBookings(user.id);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <p className="text-caption font-medium text-zone-mentorship">Mentorship</p>
      <h1 className="mt-1 font-display text-3xl tracking-tight">My bookings</h1>
      <p className="mt-2 text-muted-foreground">
        Track intro calls, one-off sessions, and monthly mentorship requests.
      </p>

      <div className="mt-8 rounded-xl border border-border bg-card p-6">
        <StudentBookingsSection bookings={bookings} />
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/mentors" variant="secondary">
          Find more mentors
        </ButtonLink>
        <Link href="/settings#my-bookings" className="text-sm text-muted-foreground hover:text-foreground hover:underline">
          Account settings →
        </Link>
      </div>
    </div>
  );
}
