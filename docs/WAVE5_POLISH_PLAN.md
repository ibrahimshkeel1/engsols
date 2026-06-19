# Wave 5 — Trust, completion & platform polish

> **Goal:** Close the gap between “engagement plan complete (31/31)” and a production-ready, trustworthy product.
>
> **Status:** Code complete (2026-06-19). Remaining ops/deferred items → [WAVE6_PRODUCTION_PLAN.md](./WAVE6_PRODUCTION_PLAN.md)
>
> *Created: 2026-06-16 · Completed in code: 2026-06-19*

---

## Quick status

| Bucket | Focus | Items | Done |
|--------|--------|-------|------|
| 5A — Trust & correctness | Bugs, migrations, honest copy | 6 | 6 |
| 5B — Finish partial Wave 4 | UX gaps users notice | 9 | 9 |
| 5C — i18n & SEO | Arabic, metadata, accessibility | 5 | 5 core |
| 5D — Platform & backend | Env, payments, realtime search | 5 | 3 code + 2 deferred |
| **Total** | | **25** | **23** |

---

## Wave 5A — Trust & correctness

- [x] **5A.1 Apply Supabase migrations 010–012** *(applied on Supabase)*
- [x] **5A.2** OAuth post-login routing (`post-auth-redirect.ts`)
- [x] **5A.3** Booking login gate
- [x] **5A.4** Honest availability copy
- [x] **5A.5** Intro video in mentor editor
- [x] **5A.6** E2E forum heading fix

---

## Wave 5B — Finish partial Wave 4

- [x] **5B.1** Compare affordance (`CompareMentorsBar` + directory link)
- [x] **5B.2** `/disciplines` index hub
- [x] **5B.3** ShareButton on videos, news, jobs, certs, marketplace, forum
- [x] **5B.4** OG images + `generateMetadata` + twitter cards
- [x] **5B.5** Video detail thumbnails via `resolveVideoThumbnail`
- [x] **5B.6** `loading.tsx` for portfolios, jobs, videos, search, certifications; Suspense fixes
- [x] **5B.7** `SectionReveal` on forum, live, search, disciplines, jobs
- [x] **5B.8** EmptyState migration (notifications, calls, settings, bookings, inbox, disciplines)
- [x] **5B.9** Admin mentor Wave 4 fields (`AdminMentorExtrasForm`)

---

## Wave 5C — i18n, micro-copy & SEO

- [x] **5C.1** Outcome i18n keys in heroes + nav tooltips (`serverT`)
- [x] **5C.2** SSR `lang`/`dir` from locale cookie
- [x] **5C.3** RTL pass on NavbarSearch, NavbarShell dropdown (logical props)
- [x] **5C.4** Core surfaces wired; full Arabic UI → optional in Wave 6
- [x] **5C.5** Expanded sitemap (all detail routes + `/disciplines`, `/for-you`, `/assist`)
- [x] **5C.6** Image alt text + `hreflang` alternates in `buildDetailMetadata`

---

## Wave 5D — Platform & backend

- [x] **5D.1** Production env checklist (`.env.example` + Wave 6 doc)
- [x] **5D.2** Client scheduled browser `Notification` at `scheduledAt` (interim)
- [x] **5D.3** Search fallback expanded (videos, live, certs, marketplace)
- [ ] **5D.4** Stripe Connect — 🚫 blocked
- [ ] **5D.5** Admin seed rotation — 🚫 deferred
- [x] **5D.6** Removed login `admin` placeholder

---

## Tests

- [x] E2E: `/for-you`, `/disciplines`, `/mentors/compare`, booking login CTA
- [x] Unit: `resolveVideoThumbnail`, `getEngagementMet`
- [ ] E2E: Arabic RTL toggle — optional (Wave 6)

---

## Completion log

| Date | Item | Notes |
|------|------|-------|
| 2026-06-19 | Wave 5 code complete | lint/build/test 0 errors; 17 e2e smoke tests |
| 2026-06-19 | 5A.1 migrations 010–012 | Applied on Supabase |

---

## Related docs

- [WAVE6_PRODUCTION_PLAN.md](./WAVE6_PRODUCTION_PLAN.md) — launch checklist & deferred work
- [FRONTEND_ENGAGEMENT_PLAN.md](./FRONTEND_ENGAGEMENT_PLAN.md) — Waves 1–4
- [PLATFORM_ROADMAP.md](./PLATFORM_ROADMAP.md) — backend features
