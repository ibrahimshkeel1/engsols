import Link from "next/link";

export function Footer() {
  return (
    <footer className="hero-dark border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <p className="text-2xl font-bold text-white">
              Eng<span className="text-primary">Sols</span>
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/50">
              The engineering platform for mentorship, careers, community, and industry — built for oil & gas and applied engineers.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Mentorship</p>
            <ul className="mt-4 space-y-3 text-sm text-white/60">
              <li><Link href="/mentors" className="hover:text-white">Find mentors</Link></li>
              <li><Link href="/apply" className="hover:text-white">Become a mentor</Link></li>
              <li><Link href="/mentor" className="hover:text-white">Mentor panel</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Careers</p>
            <ul className="mt-4 space-y-3 text-sm text-white/60">
              <li><Link href="/portfolios" className="hover:text-white">Portfolios</Link></li>
              <li><Link href="/jobs" className="hover:text-white">Jobs</Link></li>
              <li><Link href="/certifications" className="hover:text-white">Certifications</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Community</p>
            <ul className="mt-4 space-y-3 text-sm text-white/60">
              <li><Link href="/forum" className="hover:text-white">Forum</Link></li>
              <li><Link href="/live" className="hover:text-white">Live</Link></li>
              <li><Link href="/news" className="hover:text-white">News</Link></li>
            </ul>
          </div>
        </div>
        <p className="mt-14 border-t border-white/10 pt-8 text-center text-sm text-white/40">
          © {new Date().getFullYear()} EngSols. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
