"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function subscribePwaDismissed(cb: () => void) {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
}

function getPwaDismissed() {
  return localStorage.getItem("engsols-pwa-dismissed") === "1";
}

export function PwaInstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [userDismissed, setUserDismissed] = useState(false);
  const storedDismissed = useSyncExternalStore(
    subscribePwaDismissed,
    getPwaDismissed,
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

  const dismissed = storedDismissed || userDismissed;

  if (dismissed || !deferred) return null;

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
    <div className="fixed bottom-20 left-4 right-4 z-50 mx-auto max-w-md rounded-2xl border border-border bg-card p-4 shadow-lg lg:bottom-6">
      <div className="flex items-start gap-3">
        <Download className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <div className="flex-1">
          <p className="font-semibold">Install EngSols</p>
          <p className="mt-1 text-sm text-muted-foreground">Add to your home screen for quick access to mentors and forum.</p>
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
