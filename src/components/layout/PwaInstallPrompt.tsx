"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ENGAGEMENT_EVENT, getEngagementMet } from "@/lib/engagement";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function subscribePwaDismissed(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener(ENGAGEMENT_EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(ENGAGEMENT_EVENT, cb);
  };
}

function getPwaDismissed() {
  return localStorage.getItem("engsols-pwa-dismissed") === "1";
}

function subscribeEngagement(cb: () => void) {
  window.addEventListener(ENGAGEMENT_EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(ENGAGEMENT_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

export function PwaInstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [userDismissed, setUserDismissed] = useState(false);
  const [delayToken, setDelayToken] = useState(0);

  const storedDismissed = useSyncExternalStore(
    subscribePwaDismissed,
    getPwaDismissed,
    () => false,
  );

  const engagementMet = useSyncExternalStore(
    subscribeEngagement,
    getEngagementMet,
    () => false,
  );

  useEffect(() => {
    function onBeforeInstall(e: Event) {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  useEffect(() => {
    if (!engagementMet || !deferred) return;
    const timer = setTimeout(() => setDelayToken((n) => n + 1), 2500);
    return () => clearTimeout(timer);
  }, [engagementMet, deferred]);

  const dismissed = storedDismissed || userDismissed;
  const readyToShow = delayToken > 0 && engagementMet && deferred;

  if (dismissed || !deferred || !readyToShow) return null;

  async function install() {
    await deferred?.prompt();
    const { outcome } = await deferred!.userChoice;
    if (outcome === "accepted") setDeferred(null);
  }

  function dismiss() {
    localStorage.setItem("engsols-pwa-dismissed", "1");
    setUserDismissed(true);
    setDeferred(null);
  }

  return (
    <div className="fixed bottom-20 inset-x-4 z-50 mx-auto max-w-md rounded-2xl border border-border bg-card p-4 shadow-lg lg:bottom-6">
      <div className="flex items-start gap-3">
        <Download className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <div className="flex-1">
          <p className="font-semibold">Install EngSols</p>
          <p className="mt-1 text-sm text-muted-foreground">You&apos;re engaged — add EngSols to your home screen for quick mentor and forum access.</p>
          <div className="mt-3 flex gap-2">
            <Button type="button" size="sm" variant="accent" onClick={install}>Install</Button>
            <Button type="button" size="sm" variant="outline" onClick={dismiss}>Not now</Button>
          </div>
        </div>
        <button type="button" onClick={dismiss} className="text-muted-foreground hover:text-foreground" aria-label="Dismiss">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
