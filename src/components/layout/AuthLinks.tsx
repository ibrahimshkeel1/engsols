import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { signOut } from "@/actions";

export async function AuthLinks() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <>
        <Link href="/login" className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
          Log in
        </Link>
        <Link href="/signup" className="rounded-lg px-3 py-2 text-sm font-medium text-primary hover:underline">
          Sign up
        </Link>
      </>
    );
  }

  const panelHref = user.role === "admin" ? "/admin" : user.role === "mentor" ? "/mentor" : "/portfolios/build";

  return (
    <>
      <Link href="/settings" className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
        Settings
      </Link>
      <Link href={panelHref} className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
        Dashboard
      </Link>
      <form action={signOut}>
        <button type="submit" className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
          Sign out
        </button>
      </form>
    </>
  );
}
