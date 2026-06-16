# EngSols Platform Roadmap & Progress Tracker

> **Living document** — update this file whenever work ships. Mark items ✅ done, 🔄 in progress, or leave ⬜ remaining.
>
> *Last updated: 2026-06-16*

---

## Quick Status

| Area | Progress | Notes |
|------|----------|-------|
| Community shell (forum, live, mentors, news) | ~95% | Realtime, recordings, reputation |
| Business loop (booking → call → pay → review) | ~70% | Inbox + reviews + calendar; **no Stripe** |
| Career verticals (jobs, marketplace, videos) | ~75% | Seller onboarding + admin CMS |
| Trust & security | ~80% | Auth, rate limits, verified badges |
| Ops (tests, CI, SEO, docs) | ~90% | E2E smoke tests, ISR, analytics hooks |

**Next priority:** Run migrations `007` + `008` on Supabase, then Stripe when ready.

---

## Status Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Done — shipped in codebase |
| 🔄 | In progress |
| ⬜ | Remaining |
| 🚫 | Blocked / deferred by choice |
| ⏸️ | Deferred |

---

## Completed Work Log

| Date | Item | Notes |
|------|------|-------|
| 2026-06 | Remove mock data; Supabase-only content | `c6938fc` |
| 2026-06 | Demo cleanup + force-dynamic | `0083101` |
| 2026-06 | Image uploads (avatars, forum, news) | `006_storage_and_images.sql` |
| 2026-06 | UX/accessibility overhaul | `7be317d` |
| 2026-06 | Platform audit doc | `docs/PLATFORM_ROADMAP.md` |
| 2026-06 | Migration 007 — reviews, saved mentors, notes, reports, rate limits | `007_platform_features.sql` |
| 2026-06 | Migration 008 — seller onboarding, push subscriptions | `008_platform_expansion.sql` |
| 2026-06 | Hide fake ratings when review_count === 0 | `MentorRating` component |
| 2026-06 | Password reset + change password | `/forgot-password`, `/settings/password` |
| 2026-06 | Auth required on booking requests + rate limiting | `insertContactRequest` |
| 2026-06 | Mentor booking inbox | `/mentor/bookings` |
| 2026-06 | Email notifications (Resend optional) | `lib/email.ts` |
| 2026-06 | Calendly link on mentor profiles | `calendly_url` column + editor |
| 2026-06 | Mentor reviews system | `mentor_reviews` + trigger |
| 2026-06 | Mentor profile editor | `/mentor/profile` |
| 2026-06 | Featured mentor admin toggle | `FeaturedMentorToggle` |
| 2026-06 | Verified credential badges admin UI | `VerifyMentorToggle` |
| 2026-06 | Portfolio projects + experience builder | `/portfolios/build` |
| 2026-06 | Goals progress tracker | `/settings` |
| 2026-06 | Saved mentors | `saved_mentors` + settings |
| 2026-06 | Session notes (private) | `session_notes` + settings |
| 2026-06 | Forum: mark solved, likes, view count, report | actions + UI |
| 2026-06 | Forum reputation on profiles + replies | `forum_reputation` |
| 2026-06 | Admin forum delete UI | `DeleteForumPostButton` |
| 2026-06 | Supabase Realtime on forum + live | `ForumRealtimeWatcher`, `LiveStatusWatcher` |
| 2026-06 | Live viewer count + recordings UI | `LiveRecordingForm`, `LiveRecordingPlayer` |
| 2026-06 | Admin CMS (jobs, companies, certs, videos, reports) | `/admin/*` |
| 2026-06 | Job posting flow | `/jobs/post` |
| 2026-06 | Marketplace listing + seller onboarding | `/marketplace/sell`, `/marketplace/seller/new` |
| 2026-06 | Global search | `/search` |
| 2026-06 | Engineering skill graph | `engineering-skills.ts` + `SkillGraphFilter` |
| 2026-06 | Certification prep paths UI | `CertificationPrepPath` |
| 2026-06 | Career assist (rule-based matching) | `/assist` |
| 2026-06 | i18n (Arabic + English) | `LocaleProvider` + `LocaleSwitcher` |
| 2026-06 | Push notifications (web push) | `sw.js`, `PushNotificationPrompt` |
| 2026-06 | Analytics hooks | Plausible / GA via env |
| 2026-06 | E2E smoke tests | Playwright `e2e/smoke.spec.ts` |
| 2026-06 | Performance pass (ISR) | `revalidate` on key pages |
| 2026-06 | SEO sitemap + robots + PWA manifest | `sitemap.ts`, `robots.ts`, `manifest.json` |
| 2026-06 | CI pipeline | `.github/workflows/ci.yml` |
| 2026-06 | README + Zod validation on key actions | `lib/validation.ts` |
| 2026-06 | Removed Preview badges from nav | Content flows shipped |
| 2026-06 | Real video playback when `video_url` set | `MediaPlayer` |

---

## Phase 0 — Trust

| Status | Item |
|--------|------|
| ✅ | Hide mentor ratings when `review_count === 0` |
| ✅ | Ship content flows (jobs, marketplace) instead of hiding nav |
| 🚫 | Remove/rotate default admin seed — **deferred per user** |
| ✅ | Password reset / forgot-password flow |
| ✅ | Require auth on `booking_requests` |
| ✅ | Rate limiting on server actions |
| ✅ | Portfolio projects/experience CRUD |

---

## Phase 1 — Core Product

### Mentorship transaction loop

| Status | Item |
|--------|------|
| ✅ | Mentor booking inbox (`/mentor/bookings`) |
| ✅ | Email notifications (Resend when `RESEND_API_KEY` set) |
| ✅ | Calendly / Cal.com link per mentor |
| ✅ | `mentor_reviews` + real ratings |
| 🚫 | Stripe Connect — **deferred per user** |

### Mentor tools

| Status | Item |
|--------|------|
| ✅ | Mentor profile editor |
| ✅ | Featured toggle in admin |
| ✅ | Session history (live sessions on dashboard) |
| 🚫 | Earnings dashboard — needs Stripe |

### Student tools

| Status | Item |
|--------|------|
| ✅ | Portfolio projects + experience builder |
| ✅ | Goals progress tracker |
| ✅ | Saved mentors |
| ✅ | Private session notes |

### Community

| Status | Item |
|--------|------|
| ✅ | Mark forum posts solved |
| ✅ | Forum reply likes + reputation bump |
| ✅ | Forum view count |
| ✅ | Report content flow |
| ✅ | Live viewer count |
| ✅ | Admin forum delete UI |

### Ops

| Status | Item |
|--------|------|
| ✅ | Zod validation on key server actions |
| ✅ | CI pipeline (lint + build) |
| ✅ | E2E smoke tests |
| ✅ | Sitemap + robots + OG on mentor/forum pages |
| ✅ | README + env docs |

---

## Phase 2 — Differentiation

| Status | Item |
|--------|------|
| 🚫 | Stripe Connect |
| ✅ | Live session recordings UI |
| ✅ | Verified credential badges admin UI |
| ✅ | Admin CMS for jobs + companies |
| ✅ | Admin CMS for certifications + videos |
| ✅ | Analytics (Plausible / GA env script) |
| ✅ | Engineering skill graph |
| ✅ | Certification prep paths UI |
| ✅ | Forum reputation display on profiles |
| ✅ | Supabase Realtime on forum + live |

---

## Phase 3 — Platform Expansion

| Status | Item |
|--------|------|
| ✅ | Marketplace seller self-onboarding |
| ✅ | Job posting flow |
| ✅ | Employer verification toggle (admin jobs page) |
| ✅ | Basic cross-entity search |
| ✅ | PWA manifest |
| ✅ | Push notifications |
| ✅ | i18n (Arabic + English) |
| ✅ | AI assist |
| ✅ | Performance pass (ISR, selective `force-dynamic`) |

---

## Migrations (run in order)

| Migration | Status | Purpose |
|-----------|--------|---------|
| `001`–`006` | ✅ | See prior log |
| `007_platform_features.sql` | ⚠️ **Run on Supabase** | Reviews, saved mentors, notes, reports, rate limits, RLS |
| `008_platform_expansion.sql` | ⚠️ **Run on Supabase** | Seller onboarding, push subscriptions |

---

## The North Star

> **Mentor gets the lead → calendar → call → review → payment**

Payment (Stripe) is the main remaining gap for a full business loop. Phase 0–3 roadmap items are complete except Stripe and the deferred admin seed rotation.
