# EngSols

[![Live Demo](https://img.shields.io/badge/demo-live-38B2AC?style=flat-square)](https://engsols.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com)
[![Stripe](https://img.shields.io/badge/Stripe-Billing-635BFF?style=flat-square&logo=stripe)](https://stripe.com)

Full-stack engineering mentorship platform — connect with mentors, join live sessions, discuss in forums, apply for jobs, and access a marketplace for engineering resources.

## Features

- **Mentor marketplace** — Browse profiles, book sessions, and manage mentor panels
- **Live video** — Real-time mentorship via LiveKit
- **Community forum** — Discussions, threads, and peer learning
- **Career tools** — Job board, applications inbox, mock exams, and career assist
- **Stripe billing** — Subscriptions and marketplace payments
- **Admin panel** — Seller verification, marketplace moderation, and platform management

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router) |
| Database & Auth | Supabase (Postgres, RLS, storage) |
| Live video | LiveKit |
| Payments | Stripe |
| Styling | Tailwind CSS 4 |
| Testing | Vitest + Playwright |

## Quick start

```bash
npm install
cp .env.example .env.local   # see ARCHITECTURAL_MANIFESTO.md for full template
npm run dev
```

Open http://localhost:3000

### Setup checklist

1. Copy env vars into `.env.local` — full list in [`ARCHITECTURAL_MANIFESTO.md`](ARCHITECTURAL_MANIFESTO.md#1-required-environment-variables)
2. Run Supabase migrations in order (`supabase/migrations/001` through `023`)
3. Create an admin account — [docs/ADMIN_SETUP.md](docs/ADMIN_SETUP.md)
4. Start the dev server with `npm run dev`

## Key routes

| Area | Path |
|------|------|
| Mentors | `/mentors` |
| Mentor panel | `/mentor` |
| Forum | `/forum` |
| Live sessions | `/live` |
| Admin | `/admin` |
| Job inbox | `/jobs/inbox` |
| Marketplace | `/admin/marketplace` |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run test:unit` | Vitest unit tests |
| `npm run test:e2e` | Playwright smoke tests |

## Documentation

| Doc | Description |
|-----|-------------|
| [ARCHITECTURAL_MANIFESTO.md](ARCHITECTURAL_MANIFESTO.md) | Env vars, schema, Stripe webhooks, verification |
| [docs/ADMIN_SETUP.md](docs/ADMIN_SETUP.md) | Admin account bootstrap |
| [docs/PLATFORM_ROADMAP.md](docs/PLATFORM_ROADMAP.md) | Roadmap and progress |

## Security

- Never commit `.env.local` or API keys
- No default admin password — promote users via Supabase after signup
- Stripe keys in docs are placeholders only
- CI runs lint + build on push to `main`
