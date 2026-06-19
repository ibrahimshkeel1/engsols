import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getUnreadNotificationCount } from "@/lib/notifications";
import { signOut } from "@/actions";
import { NotificationBell } from "@/components/layout/NotificationBell";

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
  const unread = await getUnreadNotificationCount(user.id);

  return (
    <>
      <Link href="/for-you" className="rounded-lg px-3 py-2 text-sm font-medium text-primary hover:bg-muted hover:underline">
        For you
      </Link>
      <NotificationBell initialCount={unread} />
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
