import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getBookingForParticipant, getBookingMessages } from "@/lib/data/booking-messages";
import { BookingMessageThread } from "@/components/bookings/BookingMessageThread";
import { ButtonLink } from "@/components/ui/button";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  return { title: `Booking ${id.slice(0, 8)} | EngSols` };
}

export default async function BookingDetailPage({ params }: Props) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=" + encodeURIComponent(`/bookings/${id}`));
  const booking = await getBookingForParticipant(id, user.id);
  if (!booking) notFound();

  const messages = await getBookingMessages(id, user.id);
  const messagingDisabled = booking.status === "closed";

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <p className="text-caption font-medium text-oil-gas-orange">Booking</p>
      <h1 className="mt-1 font-display text-2xl text-oil-gas-navy">{booking.mentorName}</h1>
      <p className="mt-1 text-sm capitalize text-oil-gas-navy-muted">
        {booking.requestType.replace(/-/g, " ")} · {booking.status}
      </p>

      <div className="mt-8 space-y-6 rounded-xl border border-border bg-card p-6">
        <BookingMessageThread
          bookingId={booking.id}
          currentUserId={user.id}
          initialMessages={messages}
          disabled={messagingDisabled}
        />

        {!booking.isMentor && (booking.status === "contacted" || booking.status === "closed") && (
          <div className="rounded-xl border border-oil-gas-orange/25 bg-oil-gas-orange/5 p-4">
            <p className="text-sm font-semibold text-oil-gas-navy">Had your session?</p>
            <p className="mt-1 text-xs text-oil-gas-navy-muted">
              Reviews help other engineers find the right mentor.
            </p>
            <ButtonLink
              href={`/mentors/${booking.mentorSlug}#leave-review`}
              size="sm"
              className="mt-3 bg-oil-gas-orange hover:bg-oil-gas-orange-hover"
            >
              Leave a review
            </ButtonLink>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <ButtonLink href="/bookings" variant="secondary">
          ← All bookings
        </ButtonLink>
        <Link
          href={`/mentors/${booking.mentorSlug}`}
          className="text-sm text-oil-gas-navy-muted hover:text-oil-gas-orange hover:underline"
        >
          View mentor profile
        </Link>
      </div>
    </div>
  );
}
