import Link from "next/link";

const careers = [
  { href: "/portfolios", label: "Portfolios" },
  { href: "/jobs", label: "Jobs" },
  { href: "/companies", label: "Companies" },
];

const community = [
  { href: "/forum", label: "Forum" },
  { href: "/live", label: "Live" },
  { href: "/videos", label: "Videos" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="shrink-0 text-xl font-bold text-slate-900">
          Eng<span className="text-amber-500">Sols</span>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          <Link href="/mentors" className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900">
            Mentors
          </Link>
          <div className="group relative">
            <span className="cursor-default rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100">
              Careers ▾
            </span>
            <div className="invisible absolute left-0 top-full z-50 min-w-[160px] rounded-lg border border-slate-200 bg-white py-1 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100">
              {careers.map((l) => (
                <Link key={l.href} href={l.href} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
          <Link href="/certifications" className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900">
            Certifications
          </Link>
          <div className="group relative">
            <span className="cursor-default rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100">
              Community ▾
            </span>
            <div className="invisible absolute left-0 top-full z-50 min-w-[140px] rounded-lg border border-slate-200 bg-white py-1 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100">
              {community.map((l) => (
                <Link key={l.href} href={l.href} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
          <Link href="/marketplace" className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900">
            Marketplace
          </Link>
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <Link href="/login" className="hidden rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 sm:inline-flex">
            Log in
          </Link>
          <Link href="/mentors" className="inline-flex rounded-lg bg-amber-500 px-3 py-2 text-xs font-medium text-slate-900 hover:bg-amber-400">
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
