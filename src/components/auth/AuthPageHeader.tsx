"use client";

import { LocalizedText } from "@/components/i18n/LocalizedText";

export function LoginHeader() {
  return (
    <>
      <p className="text-center section-label">
        <LocalizedText messageKey="welcomeBack" />
      </p>
      <LocalizedText messageKey="signInTitle" as="h1" className="mt-2 text-center font-display text-3xl tracking-tight" />
      <LocalizedText messageKey="signInSubtitle" as="p" className="mt-2 text-center text-muted-foreground" />
    </>
  );
}

export function SignupHeader() {
  return (
    <>
      <p className="text-center section-label">
        <LocalizedText messageKey="signup" />
      </p>
      <LocalizedText messageKey="joinEngsols" as="h1" className="mt-2 text-center font-display text-3xl tracking-tight" />
      <LocalizedText messageKey="joinSubtitle" as="p" className="mt-2 text-center text-muted-foreground" />
    </>
  );
}
