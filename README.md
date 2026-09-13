# EngSols

[![Live Demo](https://img.shields.io/badge/demo-engsols.vercel.app-38B2AC?style=flat-square)](https://engsols.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com)

Engineering mentorship platform — mentors, forum, live video, portfolios, jobs, mock exams, Stripe billing, and marketplace.

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

3. Run Supabase migrations in order (`supabase/migrations/001` through `023`).

4. Create an admin account — see [docs/ADMIN_SETUP.md](docs/ADMIN_SETUP.md).

5. Start dev server:

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

## Security

- Never commit `.env.local` or API keys
- No default admin password — see [docs/ADMIN_SETUP.md](docs/ADMIN_SETUP.md)
- Stripe test keys in docs use placeholders only
