import Link from "next/link";
export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-xl font-bold text-slate-900">
          Eng<span className="text-amber-500">Sols</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/mentors" className="text-sm text-slate-600 hover:text-slate-900">
            Find mentors
          </Link>
          <Link href="/#how-it-works" className="text-sm text-slate-600 hover:text-slate-900">
            How it works
          </Link>
          <Link href="/apply" className="text-sm text-slate-600 hover:text-slate-900">
            Become a mentor
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="inline-flex h-8 items-center rounded-lg px-3 text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            Log in
          </Link>
          <Link
            href="/mentors"
            className="inline-flex h-8 items-center rounded-lg bg-amber-500 px-3 text-xs font-medium text-slate-900 hover:bg-amber-400"
          >
            Find my mentor
          </Link>
        </div>
      </div>
    </header>
  );
}
