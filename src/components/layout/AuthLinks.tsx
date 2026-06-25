import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getUnreadNotificationCount } from "@/lib/notifications";
import { signOut } from "@/actions";
import { NotificationBell } from "@/components/layout/NotificationBell";

const headerLinkClass =
  "rounded-lg px-3 py-2 text-sm font-medium text-white/75 transition-colors hover:bg-white/8 hover:text-white";

const menuOverlayLinkClass =
  "flex w-full items-center justify-center rounded-lg bg-oil-gas-navy px-4 py-2.5 text-sm font-medium text-oil-gas-white transition-colors hover:bg-oil-gas-orange";

const menuOverlayCtaClass =
  "flex w-full items-center justify-center rounded-lg bg-oil-gas-orange px-4 py-2.5 text-sm font-semibold text-oil-gas-white transition-colors hover:bg-oil-gas-navy";

export async function AuthLinks({ variant = "header" }: { variant?: "header" | "menuOverlay" }) {
  const user = await getCurrentUser();
  const isMenu = variant === "menuOverlay";

  if (!user) {
    return (
      <>
        <Link href="/login" className={isMenu ? menuOverlayLinkClass : headerLinkClass}>
          Log in
        </Link>
        <Link href="/signup" className={isMenu ? menuOverlayCtaClass : "nav-cta"}>
          Get started
        </Link>
      </>
    );
  }

  const panelHref = user.role === "admin" ? "/admin" : user.role === "mentor" ? "/mentor" : "/portfolios/build";
  const unread = await getUnreadNotificationCount(user.id);

  return (
    <>
      <Link
        href="/for-you"
        className={
          isMenu
            ? menuOverlayLinkClass
            : "rounded-lg px-3 py-2 text-sm font-medium text-oil-gas-orange transition-colors hover:bg-white/8 hover:text-oil-gas-orange"
        }
      >
        For you
      </Link>
      <NotificationBell
        initialCount={unread}
        className={
          isMenu
            ? "relative flex h-11 w-full items-center justify-center rounded-lg bg-oil-gas-navy text-oil-gas-white transition-colors hover:bg-oil-gas-orange"
            : undefined
        }
      />
      <Link href="/bookings" className={isMenu ? menuOverlayLinkClass : headerLinkClass}>
        Bookings
      </Link>
      <Link href="/settings" className={isMenu ? menuOverlayLinkClass : headerLinkClass}>
        Settings
      </Link>
      <Link href={panelHref} className={isMenu ? menuOverlayLinkClass : headerLinkClass}>
        Dashboard
      </Link>
      <form action={signOut} className={isMenu ? "w-full" : undefined}>
        <button type="submit" className={isMenu ? menuOverlayLinkClass : headerLinkClass}>
          Sign out
        </button>
      </form>
    </>
  );
}
