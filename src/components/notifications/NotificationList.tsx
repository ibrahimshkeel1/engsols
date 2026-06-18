"use client";

import Link from "next/link";
import { format } from "date-fns";
import { useTransition } from "react";
import { markNotificationAsRead } from "@/actions/notifications-ui";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { AppNotification } from "@/lib/notifications";

export function NotificationList({ notifications }: { notifications: AppNotification[] }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-3">
      {notifications.map((n) => (
        <Card key={n.id} className={n.read ? "card-elevated opacity-80" : "card-elevated border-primary/30"}>
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{n.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {format(new Date(n.createdAt), "MMM d, yyyy h:mm a")}
                </p>
                {n.url && (
                  <Link href={n.url} className="mt-2 inline-block text-sm text-primary hover:underline">
                    View →
                  </Link>
                )}
              </div>
              {!n.read && (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  disabled={pending}
                  onClick={() => startTransition(() => markNotificationAsRead(n.id))}
                >
                  Mark read
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
