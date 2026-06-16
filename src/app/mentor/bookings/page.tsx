import { getCurrentUser } from "@/lib/auth";
import { getBookingRequestsForMentor } from "@/lib/data/bookings-mentor";
import { MentorBookingsList } from "@/components/mentor/MentorBookingsList";

export default async function MentorBookingsPage() {
  const user = await getCurrentUser();
  const bookings = user ? await getBookingRequestsForMentor(user.id) : [];

  return (
    <div>
      <h1 className="text-2xl font-bold">Booking inbox</h1>
      <p className="mt-1 text-muted-foreground">Intro calls and mentorship requests from students.</p>
      <div className="mt-8">
        <MentorBookingsList bookings={bookings} />
      </div>
    </div>
  );
}
