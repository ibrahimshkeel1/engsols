import Link from "next/link";
import { format } from "date-fns";
import { Inbox } from "lucide-react";
import { getBookingRequestsForAdmin } from "@/lib/data/bookings";
import { EmptyState } from "@/components/shared/EmptyState";
import { AdminBookingActions } from "@/components/admin/AdminBookingActions";
import { Card, CardContent } from "@/components/ui/card";

export default async function AdminBookingsPage() {
  const bookings = await getBookingRequestsForAdmin();

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Booking & contact requests</h1>
          <p className="mt-1 text-muted-foreground">Mentorship intros, job applications, portfolio outreach, and marketplace inquiries.</p>
        </div>
        <Link href="/admin" className="text-sm text-primary hover:underline">← Dashboard</Link>
      </div>
      {bookings.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            icon={Inbox}
            title="No requests yet"
            description="Booking and contact requests appear here when users submit forms on the site."
          />
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {bookings.map((b) => (
            <Card key={b.id} className="card-elevated">
              <CardContent className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium capitalize">{b.requestType.replace(/_/g, " ")}</span>
                    <p className="mt-2 font-semibold">{b.requesterName} → {b.mentorName}</p>
                    <p className="text-sm text-muted-foreground">{b.requesterEmail}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{format(new Date(b.createdAt), "MMM d, yyyy h:mm a")}</p>
                </div>
                <p className="mt-3 text-sm text-foreground/90">{b.message}</p>
                <p className="mt-2 text-xs text-muted-foreground">Ref: {b.mentorSlug}</p>
                <AdminBookingActions bookingId={b.id} status={b.status} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
