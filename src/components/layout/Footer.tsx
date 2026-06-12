import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <p className="text-xl font-bold text-slate-900">
              Eng<span className="text-amber-500">Sols</span>
            </p>
            <p className="mt-2 max-w-sm text-sm text-slate-600">
              The engineering platform for mentorship, careers, community, and industry.
            </p>
          </div>
          <div>
            <p className="font-semibold text-slate-900">Mentorship</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li><Link href="/mentors" className="hover:text-slate-900">Find mentors</Link></li>
              <li><Link href="/apply" className="hover:text-slate-900">Become a mentor</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-slate-900">Careers</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li><Link href="/portfolios" className="hover:text-slate-900">Portfolios</Link></li>
              <li><Link href="/jobs" className="hover:text-slate-900">Jobs</Link></li>
              <li><Link href="/companies" className="hover:text-slate-900">Companies</Link></li>
              <li><Link href="/certifications" className="hover:text-slate-900">Certifications</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-slate-900">Platform</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li><Link href="/forum" className="hover:text-slate-900">Forum</Link></li>
              <li><Link href="/live" className="hover:text-slate-900">Live</Link></li>
              <li><Link href="/videos" className="hover:text-slate-900">Videos</Link></li>
              <li><Link href="/marketplace" className="hover:text-slate-900">Marketplace</Link></li>
            </ul>
          </div>
        </div>
        <p className="mt-10 border-t border-slate-200 pt-8 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} EngSols. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
