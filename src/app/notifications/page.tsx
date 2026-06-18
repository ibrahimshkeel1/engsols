import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getNotificationsForUser, getUnreadNotificationCount } from "@/lib/notifications";
import { markAllNotificationsAsRead } from "@/actions/notifications-ui";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NotificationList } from "@/components/notifications/NotificationList";

export default async function NotificationsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/notifications");

  const [notifications, unread] = await Promise.all([
    getNotificationsForUser(user.id),
    getUnreadNotificationCount(user.id),
  ]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl tracking-tight">Notifications</h1>
          <p className="mt-1 text-muted-foreground">
            {unread > 0 ? `${unread} unread` : "You're all caught up"}
          </p>
        </div>
        {unread > 0 && (
          <form action={markAllNotificationsAsRead}>
            <Button type="submit" size="sm" variant="outline">Mark all read</Button>
          </form>
        )}
      </div>

      <div className="mt-8 space-y-3">
        {notifications.length === 0 ? (
          <Card className="card-elevated">
            <CardContent className="p-8 text-center text-muted-foreground">
              No notifications yet. You&apos;ll see booking updates, forum replies, and marketplace inquiries here.
            </CardContent>
          </Card>
        ) : (
          <NotificationList notifications={notifications} />
        )}
      </div>
    </div>
  );
}
