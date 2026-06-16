# EngSols

Engineering mentorship platform — mentors, forum, live video, portfolios, jobs, and more.

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

2. Copy environment variables (create `.env.local`):

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional — live video
LIVEKIT_URL=
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=

# Optional — email notifications (Resend)
RESEND_API_KEY=
EMAIL_FROM=EngSols <notifications@engsols.com>

# Optional — analytics
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=
NEXT_PUBLIC_GA_ID=

# Optional — web push (generate VAPID keys)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
```

3. Run Supabase migrations in order (`supabase/migrations/001` through `008`).

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

## Progress tracking

See [`docs/PLATFORM_ROADMAP.md`](docs/PLATFORM_ROADMAP.md) for what's done and what's next.

## CI

GitHub Actions runs lint + build on push to `main` (`.github/workflows/ci.yml`).
