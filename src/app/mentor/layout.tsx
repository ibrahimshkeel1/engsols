import Link from "next/link";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { PanelSidebar } from "@/components/panels/PanelSidebar";
import { signOut } from "@/actions";

const mentorNav = [
  { href: "/mentor", label: "Overview" },
  { href: "/mentor/bookings", label: "Bookings" },
  { href: "/mentor/earnings", label: "Earnings" },
  { href: "/mentor/roadmaps", label: "Roadmaps" },
  { href: "/mentor/profile", label: "My profile" },
  { href: "/mentor/live", label: "Live sessions" },
  { href: "/apply", label: "Application" },
];

export default async function MentorLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole(["mentor", "admin"]);
  if (!user) redirect("/login?next=/mentor");

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col lg:flex-row">
      <PanelSidebar title="Mentor" subtitle="EngSols" items={mentorNav} />
      <div className="flex-1">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <p className="text-sm text-muted-foreground">
            Signed in as <span className="font-medium text-foreground">{user.full_name}</span>
          </p>
          <div className="flex items-center gap-3">
            <Link href="/mentors" className="text-sm text-muted-foreground hover:text-foreground">
              Public profile
            </Link>
            <form action={signOut}>
              <button type="submit" className="text-sm font-medium text-primary hover:underline">
                Sign out
              </button>
            </form>
          </div>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
