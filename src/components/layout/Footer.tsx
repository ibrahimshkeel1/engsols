import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="text-xl font-bold text-slate-900">
              Eng<span className="text-amber-500">Sols</span>
            </p>
            <p className="mt-2 max-w-md text-sm text-slate-600">
              Connecting engineers and mentees across oil & gas, drilling, reservoir,
              civil, mechanical, and applied engineering fields.
            </p>
          </div>
          <div>
            <p className="font-semibold text-slate-900">For mentees</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li><Link href="/mentors" className="hover:text-slate-900">Find mentors</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-slate-900">How it works</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-slate-900">For mentors</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li><Link href="/apply" className="hover:text-slate-900">Become a mentor</Link></li>
              <li><Link href="/login" className="hover:text-slate-900">Log in</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 sm:flex-row">
          <p className="text-sm text-slate-500">© {new Date().getFullYear()} EngSols. All rights reserved.</p>
          <div className="flex gap-3">
            <Link
              href="/mentors"
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              Find my mentor
            </Link>
            <Link
              href="/apply"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-white"
            >
              Become a mentor
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
