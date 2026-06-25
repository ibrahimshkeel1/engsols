import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import {
  getReviewedMentorSlugsForUser,
  getStudentBookingsDetailed,
} from "@/lib/data/booking-messages";
import { StudentBookingsSection } from "@/components/settings/StudentBookingsSection";
import { ButtonLink } from "@/components/ui/button";

type Props = { searchParams: Promise<{ mentorship_success?: string }> };

export const metadata = {
  title: "My bookings | EngSols",
  description: "Track mentorship and session requests you've sent to mentors.",
};

export default async function BookingsPage({ searchParams }: Props) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=" + encodeURIComponent("/bookings"));

  const params = await searchParams;
  const [bookings, reviewedSlugs] = await Promise.all([
    getStudentBookingsDetailed(user.id),
    getReviewedMentorSlugsForUser(user.id),
  ]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <p className="text-caption font-medium text-oil-gas-orange">Mentorship</p>
      <h1 className="hero-dot-text mt-1 text-balance text-oil-gas-navy">My bookings</h1>
      <p className="mt-2 text-oil-gas-navy-muted">
        Track intro calls, one-off sessions, and monthly mentorship requests.
      </p>

      {params.mentorship_success && (
        <div className="mt-6 rounded-xl border border-oil-gas-orange/30 bg-oil-gas-orange/10 px-4 py-3 text-sm text-oil-gas-navy">
          Payment successful — your monthly mentorship is active. Message your mentor below or wait for their reply.
        </div>
      )}

      <div className="mt-8 rounded-xl border border-border bg-card p-6">
        <StudentBookingsSection
          bookings={bookings}
          reviewedMentorSlugs={[...reviewedSlugs]}
        />
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/mentors" variant="secondary">
          Find more mentors
        </ButtonLink>
        <Link href="/settings#my-bookings" className="text-sm text-oil-gas-navy-muted hover:text-oil-gas-navy hover:underline">
          Account settings →
        </Link>
      </div>
    </div>
  );
}
