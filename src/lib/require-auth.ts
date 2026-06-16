import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export async function requireUser(returnPath: string) {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?next=${encodeURIComponent(returnPath)}`);
  }
  return user;
}
