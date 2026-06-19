"use client";

import { useState } from "react";
import { signIn } from "@/actions";
import { FormField } from "@/components/ui/FormField";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Input } from "@/components/ui/input";

type FieldErrors = {
  email?: string;
  password?: string;
};

type Props = {
  next?: string | null;
};

function validate(fields: { email: string; password: string }): FieldErrors {
  const errors: FieldErrors = {};
  if (!fields.email.trim()) {
    errors.email = "Enter your email or username";
  }
  if (!fields.password) {
    errors.password = "Enter your password";
  } else if (fields.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }
  return errors;
}

export function LoginForm({ next }: Props) {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  function validateField(name: keyof FieldErrors, all: { email: string; password: string }) {
    const nextErrors = validate(all);
    setErrors((prev) => ({ ...prev, [name]: nextErrors[name] }));
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    const form = e.currentTarget.form;
    if (!form) return;
    const { name } = e.target;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name as keyof FieldErrors, { email, password });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    const nextErrors = validate({ email, password });
    setErrors(nextErrors);
    setTouched({ email: true, password: true });
    if (Object.keys(nextErrors).length > 0) {
      e.preventDefault();
    }
  }

  return (
    <form action={signIn} onSubmit={handleSubmit} className="space-y-4">
      {next && <input type="hidden" name="next" value={next} />}
      <FormField label="Email or username" id="login-email" error={touched.email ? errors.email : undefined}>
        <Input
          name="email"
          required
          type="text"
          placeholder="you@example.com"
          autoComplete="username"
          invalid={Boolean(touched.email && errors.email)}
          onBlur={handleBlur}
        />
      </FormField>
      <FormField label="Password" id="login-password" error={touched.password ? errors.password : undefined}>
        <Input
          name="password"
          required
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          invalid={Boolean(touched.password && errors.password)}
          onBlur={handleBlur}
        />
      </FormField>
      <SubmitButton variant="accent" className="w-full" pendingLabel="Signing in...">
        Log in
      </SubmitButton>
    </form>
  );
}
