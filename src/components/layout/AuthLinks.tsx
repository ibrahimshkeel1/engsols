import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { signOut } from "@/actions";

export async function AuthLinks() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <>
        <Link href="/login" className="hidden rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted sm:inline-flex">
          Log in
        </Link>
        <Link href="/mentors" className="inline-flex rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/25 hover:brightness-110">
          Get started
        </Link>
      </>
    );
  }

  const panelHref = user.role === "admin" ? "/admin" : user.role === "mentor" ? "/mentor" : "/portfolios/build";

  return (
    <>
      <Link href={panelHref} className="hidden rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted sm:inline-flex">
        Dashboard
      </Link>
      <form action={signOut}>
        <button type="submit" className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted">
          Sign out
        </button>
      </form>
    </>
  );
}
