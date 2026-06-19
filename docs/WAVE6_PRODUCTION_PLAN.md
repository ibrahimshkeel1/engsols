# Wave 6 — Production ops & deferred platform

> **Goal:** Document what remains after Wave 5 code completion — mostly ops, product decisions, and optional depth work.
>
> **Context:** Wave 5 closed all implementable frontend polish in code. Lint, build, and unit tests pass with 0 errors. E2E smoke expanded (17 tests).
>
> *Created: 2026-06-19 · After Wave 5 implementation pass.*

---

## Wave 5 completion summary

| Bucket | Status |
|--------|--------|
| **5A** Trust & correctness | 5/6 code items done — **5A.1 migrations** still manual on Supabase |
| **5B** Finish partial Wave 4 | **Done in code** — compare bar, disciplines hub, share/OG, thumbnails, skeletons, reveals, empty states, admin mentor fields |
| **5C** i18n & SEO | **Core done** — outcome heroes, SSR `lang`/`dir`, sitemap, metadata, alt text, hreflang alternates. Full Arabic UI (~95% English) deferred below |
| **5D** Platform | **Feasible parts done** — search expansion, login placeholder removed, client session reminders. Stripe/blocked items deferred |

---

## What you must do manually (blocks full production)

### 6.1 Apply Supabase migrations 010–012

Run in Supabase SQL editor (in order):

1. `supabase/migrations/010_platform_completion.sql`
2. `supabase/migrations/011_wave2_engagement.sql`
3. `supabase/migrations/012_wave4_polish.sql`

Without these: intro video, availability badges, video thumbnails, notifications, and some booking fields will not persist.

### 6.2 Production environment

Copy `.env.example` → production env (Vercel/host). Required:

- `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL` (fixes OG image URLs in production)
- Google OAuth enabled in Supabase dashboard

Recommended:

- `RESEND_API_KEY` — booking/application emails
- `VAPID_*` — web push
- `LIVEKIT_*` — live video rooms
- `OPENAI_API_KEY` — AI `/assist` (rule-based fallback exists)
- `E2E_TEST_EMAIL` / `E2E_TEST_PASSWORD` — CI auth smoke test

### 6.3 Verify CI green

Push and confirm GitHub Actions: `lint` → `build` → `e2e` all pass.

---

## Deferred by product choice (do not build until decided)

| Item | Why deferred |
|------|----------------|
| **6.4 Stripe Connect** | Payments / mentor earnings — product decision |
| **6.5 Admin seed rotation** | Per PLATFORM_ROADMAP — security ops, not frontend |
| **6.6 Server-scheduled session reminders** | Needs cron/edge job + push infra; client `Notification` at `scheduledAt` ships as interim |

---

## Optional depth (nice-to-have, not blocking launch)

### i18n depth (5C.4 remainder)

- Wire `t()` / `LocalizedText` on forms, booking, compare, settings labels
- Full Arabic copy pass (~95% of UI still English strings)
- `LocaleSwitcher` in navbar (today: footer only)

### RTL depth (5C.3 remainder)

- `FormField`, `MentorBookingCard`, modals, carousels — replace remaining `left`/`right`/`pl`/`pr`
- Arrow icons: `rtl:rotate-180` on chevrons site-wide

### Search FTS migration

- `search_platform_fts` RPC only indexes mentor/forum/portfolio/job
- Fallback ilike search now includes videos, live, certifications, marketplace
- Optional: new migration to extend FTS materialized view

### Mobile UX polish

- Extra `pb` on mentor profile (bottom nav + book bar + Sonner)
- Hide community bottom nav on homepage (Home not a tab)
- PWA prompt z-index coordination with book bar

### Performance

- Lazy-load Framer Motion on below-fold-only routes if bundle size matters
- Happening-now Realtime (polling is acceptable today)

### E2E depth

- Arabic locale toggle → `dir=rtl` on `<html>` (manual or cookie in test)
- Authenticated flows with `E2E_TEST_*` secrets in CI

---

## Explicitly out of scope

- Stripe / payments UI
- Major visual rebrand
- Heavy parallax / gimmick animations
- Re-building Waves 1–4 features that already work

---

## Suggested launch checklist

1. [ ] Run migrations 010–012 on Supabase
2. [ ] Set production env vars (especially `NEXT_PUBLIC_SITE_URL`)
3. [ ] Enable Google OAuth in Supabase
4. [ ] Push → verify CI green
5. [ ] Smoke test: login, book mentor (logged in), save mentor, compare, `/for-you`, `/disciplines`
6. [ ] Optional: set `E2E_TEST_*` in GitHub secrets for auth e2e

---

## Related docs

- [WAVE5_POLISH_PLAN.md](./WAVE5_POLISH_PLAN.md) — completed items
- [FRONTEND_ENGAGEMENT_PLAN.md](./FRONTEND_ENGAGEMENT_PLAN.md) — Waves 1–4
- [PLATFORM_ROADMAP.md](./PLATFORM_ROADMAP.md) — backend & Stripe gap
