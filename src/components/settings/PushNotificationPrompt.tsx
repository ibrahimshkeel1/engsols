"use client";

import { useState, useTransition } from "react";
import { Bell } from "lucide-react";
import { savePushSubscription } from "@/actions/notifications";
import { Button } from "@/components/ui/button";

export function PushNotificationPrompt() {
  const [status, setStatus] = useState<"idle" | "enabled" | "denied" | "unsupported">("idle");
  const [pending, startTransition] = useTransition();

  if (typeof window !== "undefined" && !("Notification" in window)) return null;
  if (status === "enabled") {
    return <p className="text-sm text-zone-mentorship">Push notifications enabled for this device.</p>;
  }
  if (status === "denied") {
    return <p className="text-sm text-muted-foreground">Notifications blocked in browser settings.</p>;
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={pending}
      onClick={() => {
        if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
          setStatus("unsupported");
          return;
        }
        startTransition(async () => {
          const permission = await Notification.requestPermission();
          if (permission !== "granted") {
            setStatus("denied");
            return;
          }
          const reg = await navigator.serviceWorker.register("/sw.js");
          const sub = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
          });
          await savePushSubscription(JSON.stringify(sub.toJSON()));
          setStatus("enabled");
        });
      }}
    >
      <Bell className="mr-2 h-4 w-4" />
      {pending ? "Enabling..." : "Enable push notifications"}
    </Button>
  );
}
