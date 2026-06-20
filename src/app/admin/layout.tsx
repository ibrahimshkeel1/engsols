import Link from "next/link";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { PanelSidebar } from "@/components/panels/PanelSidebar";
import { signOut } from "@/actions";

const adminNav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/mentors", label: "Mentors" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/revenue", label: "Revenue" },
  { href: "/admin/applications", label: "Applications" },
  { href: "/admin/jobs", label: "Jobs" },
  { href: "/admin/companies", label: "Companies" },
  { href: "/admin/sellers", label: "Sellers" },
  { href: "/admin/marketplace", label: "Marketplace" },
  { href: "/admin/inquiries", label: "Inquiries" },
  { href: "/admin/certifications", label: "Certifications" },
  { href: "/admin/exams", label: "Mock exams" },
  { href: "/admin/videos", label: "Videos" },
  { href: "/admin/news", label: "News articles" },
  { href: "/admin/forum", label: "Forum" },
  { href: "/admin/live", label: "Live sessions" },
  { href: "/admin/reports", label: "Reports" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole(["admin"]);
  if (!user) redirect("/login?next=/admin");

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col lg:flex-row">
      <PanelSidebar title="Admin" subtitle="EngSols" items={adminNav} />
      <div className="flex-1">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <p className="text-sm text-muted-foreground">
            Signed in as <span className="font-medium text-foreground">{user.full_name}</span>
          </p>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              View site
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
