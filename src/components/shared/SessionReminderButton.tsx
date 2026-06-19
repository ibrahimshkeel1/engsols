"use client";

import { useSyncExternalStore, useTransition, useState } from "react";
import { Bell } from "lucide-react";
import { savePushSubscription } from "@/actions/notifications";

const REMINDER_EVENT = "engsols-reminder-change";

function reminderKey(sessionSlug: string) {
  return `engsols-reminder-${sessionSlug}`;
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(REMINDER_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(REMINDER_EVENT, onStoreChange);
  };
}

type Props = {
  sessionSlug: string;
  sessionTitle: string;
};

export function SessionReminderButton({ sessionSlug, sessionTitle }: Props) {
  const stored = useSyncExternalStore(
    subscribe,
    () => localStorage.getItem(reminderKey(sessionSlug)),
    () => null,
  );
  const [denied, setDenied] = useState(false);
  const [pending, startTransition] = useTransition();

  if (stored) {
    return <p className="text-xs text-green-600">Reminder set for &ldquo;{sessionTitle}&rdquo;</p>;
  }

  if (denied) {
    return <p className="text-xs text-muted-foreground">Enable notifications in browser settings to get reminders.</p>;
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          try {
            localStorage.setItem(reminderKey(sessionSlug), sessionTitle);
            window.dispatchEvent(new Event(REMINDER_EVENT));
            if ("Notification" in window && "serviceWorker" in navigator && "PushManager" in window) {
              const permission = await Notification.requestPermission();
              if (permission === "granted") {
                const reg = await navigator.serviceWorker.register("/sw.js");
                const sub = await reg.pushManager.subscribe({
                  userVisibleOnly: true,
                  applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
                });
                await savePushSubscription(JSON.stringify(sub.toJSON()));
              } else if (permission === "denied") {
                setDenied(true);
                return;
              }
            }
          } catch {
            /* local reminder still saved */
          }
        });
      }}
      className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-medium hover:bg-muted disabled:opacity-60"
    >
      <Bell className="h-4 w-4" />
      {pending ? "Saving..." : "Remind me"}
    </button>
  );
}
