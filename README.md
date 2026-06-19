# EngSols

Engineering mentorship platform — mentors, forum, live video, portfolios, jobs, mock exams, Stripe billing, and more.

**New here?** Read [`ARCHITECTURAL_MANIFESTO.md`](ARCHITECTURAL_MANIFESTO.md) first — env vars, database schema, Stripe webhooks, and local verification checklist.

## Stack

- **Next.js 16** (App Router)
- **Supabase** (auth, Postgres, storage, RLS)
- **LiveKit** (live video)
- **Tailwind CSS 4**

## Setup

1. Clone and install:

```bash
npm install
```

2. Copy environment variables into `.env.local` — see the full template in [`ARCHITECTURAL_MANIFESTO.md`](ARCHITECTURAL_MANIFESTO.md#1-required-environment-variables).

3. Run Supabase migrations in order (`supabase/migrations/001` through `017`).

4. Start dev server:

```bash
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run test:unit` | Vitest unit tests |
| `npm run test:e2e` | Playwright smoke tests (requires `npm run build && npm run start`) |

## Key routes

| Area | Path |
|------|------|
| Mentors | `/mentors` |
| Mentor panel | `/mentor` (bookings, profile, live) |
| Forum | `/forum` |
| Live | `/live` |
| Admin | `/admin` |
| Search | `/search` |
| Career assist | `/assist` |
| Job applications inbox | `/jobs/inbox` |
| Admin sellers / marketplace | `/admin/sellers`, `/admin/marketplace` |

## Progress tracking

See [`docs/PLATFORM_ROADMAP.md`](docs/PLATFORM_ROADMAP.md) for what's done and what's next.

## CI

GitHub Actions runs lint + build on push to `main` (`.github/workflows/ci.yml`).
