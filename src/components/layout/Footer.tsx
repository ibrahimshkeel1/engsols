import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/50">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <p className="text-xl font-bold">
              Eng<span className="text-primary">Sols</span>
            </p>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              The engineering platform for mentorship, careers, community, and industry.
            </p>
          </div>
          <div>
            <p className="font-semibold">Mentorship</p>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li><Link href="/mentors" className="hover:text-foreground">Find mentors</Link></li>
              <li><Link href="/apply" className="hover:text-foreground">Become a mentor</Link></li>
              <li><Link href="/mentor" className="hover:text-foreground">Mentor panel</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold">Careers</p>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li><Link href="/portfolios" className="hover:text-foreground">Portfolios</Link></li>
              <li><Link href="/jobs" className="hover:text-foreground">Jobs</Link></li>
              <li><Link href="/certifications" className="hover:text-foreground">Certifications</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold">Platform</p>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li><Link href="/forum" className="hover:text-foreground">Forum</Link></li>
              <li><Link href="/live" className="hover:text-foreground">Live</Link></li>
              <li><Link href="/news" className="hover:text-foreground">News</Link></li>
              <li><Link href="/admin" className="hover:text-foreground">Admin</Link></li>
            </ul>
          </div>
        </div>
        <p className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} EngSols. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
