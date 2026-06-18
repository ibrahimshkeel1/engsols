"use client";

import { useTransition } from "react";
import { signInWithGoogle } from "@/actions";
import { Button } from "@/components/ui/button";

export function GoogleSignInButton({ nextPath }: { nextPath?: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      disabled={pending}
      onClick={() => startTransition(() => signInWithGoogle(nextPath))}
    >
      {pending ? "Redirecting..." : "Continue with Google"}
    </Button>
  );
}
