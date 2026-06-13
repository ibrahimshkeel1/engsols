import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

export default async function OnboardingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/onboarding");

  if (user.role === "mentor") redirect("/onboarding/mentor");
  if (user.role === "admin") redirect("/admin");
  redirect("/onboarding/student");
}
