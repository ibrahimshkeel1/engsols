# EngSols — Architectural Manifesto

> **Phase 7 complete.** This document is the canonical reference for the EngSols engineering mentorship platform as of the current codebase. Any developer or AI agent onboarding to this repository should read this file first.

---

## Platform Overview

EngSols is a **Next.js 16 App Router** application backed by **Supabase PostgreSQL** (auth, RLS, storage) with real-time collaboration via **LiveKit**, monetization via **Stripe**, and a strict TypeScript + Tailwind CSS 4 design system.

### Phase 7 Capabilities (shipped)

| Capability | Primary surfaces |
|------------|------------------|
| Smart mentor filters + specialist fallbacks | `/mentors`, `specialist_mentor_requests` |
| Collaborative live workspaces (whiteboard + 3D CAD) | `/live/[slug]/room`, LiveKit data channels |
| Mentorship roadmaps & milestone tracking | `/mentor/roadmaps`, `/settings`, `/for-you` |
| Mock exams (FE/PE) + admin CMS | `/certifications/exams/[slug]`, `/admin/exams` |
| Mentor portfolio endorsements | `/portfolios/[slug]`, B2B talent pipeline |
| Stripe exam purchases + mentorship subscriptions | Checkout, webhooks, customer portal |
| Revenue analytics dashboards | `/mentor/earnings`, `/admin/revenue` |

### High-level architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  Next.js 16 (App Router) — Server Components + Server Actions   │
├──────────────┬──────────────┬──────────────┬─────────────────────┤
│  Supabase    │  LiveKit     │  Stripe      │  Resend / Web Push  │
│  Auth + PG   │  Video +     │  Checkout +  │  (optional)         │
│  + Storage   │  Data Ch.    │  Portal + WH │                     │
└──────────────┴──────────────┴──────────────┴─────────────────────┘
```

**Key conventions**

- Server Actions live in `src/actions/` (domain-split: `exam.ts`, `stripe.ts`, `roadmap.ts`, `endorsement.ts`, etc.).
- Data access lives in `src/lib/data/` — never query Supabase directly from UI components.
- Types are centralized in `src/types/database.ts` and `src/types/index.ts`.
- Migrations are sequential in `supabase/migrations/001` → `017` — apply in order.

---

## 1. Required Environment Variables

Copy the block below into `.env.local` for local development. In production (e.g. Vercel), set the same keys in your deployment environment.

### Core (required for any real deployment)

| Variable | Example placeholder | Purpose |
|----------|---------------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://abcdefghijklmnop.supabase.co` | Supabase project URL (root only — no `/rest/v1`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Public anon key for client + SSR cookie auth |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Canonical site URL (OG images, redirects, Stripe return URLs) |

### Payments & webhooks (required for Stripe features)

| Variable | Example placeholder | Purpose |
|----------|---------------------|---------|
| `STRIPE_SECRET_KEY` | `sk_test_51AbCdEf...` | Stripe API secret (server-only) |
| `STRIPE_WEBHOOK_SECRET` | `whsec_1a2b3c4d5e6f...` | Signing secret for `/api/webhooks/stripe` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Bypasses RLS for webhooks, admin revenue, purchase ledger writes |

### Live video & real-time collaboration (required for `/live` rooms)

| Variable | Example placeholder | Purpose |
|----------|---------------------|---------|
| `LIVEKIT_URL` | `wss://your-project.livekit.cloud` | LiveKit server WebSocket URL (server token minting) |
| `LIVEKIT_API_KEY` | `APIxxxxxxxxxxxx` | LiveKit API key |
| `LIVEKIT_API_SECRET` | `secret_xxxxxxxxxxxxxxxx` | LiveKit API secret (token minting) |
| `NEXT_PUBLIC_LIVEKIT_URL` | `wss://your-project.livekit.cloud` | Optional client-side fallback when `LIVEKIT_URL` is unset |

### Optional — email notifications

| Variable | Example placeholder | Purpose |
|----------|---------------------|---------|
| `RESEND_API_KEY` | `re_123456789` | Resend API for transactional email |
| `EMAIL_FROM` | `EngSols <notifications@engsols.com>` | Default sender address |

### Optional — web push notifications

| Variable | Example placeholder | Purpose |
|----------|---------------------|---------|
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | `BEl62iUYgUivxIkv69yViEuiBIa-Ib37J8...` | Browser push public key |
| `VAPID_PRIVATE_KEY` | `UUxIko2VD6E7ecij3fLq2Yd3xP7xH8k9...` | Server push private key |
| `VAPID_SUBJECT` | `mailto:notifications@engsols.com` | VAPID contact URI |

### Optional — analytics & observability

| Variable | Example placeholder | Purpose |
|----------|---------------------|---------|
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | `engsols.com` | Plausible analytics domain |
| `NEXT_PUBLIC_GA_ID` | `G-XXXXXXXXXX` | Google Analytics measurement ID |
| `NEXT_PUBLIC_SENTRY_DSN` | `https://abc123@o123.ingest.sentry.io/456` | Sentry error reporting |

### Optional — AI career assist

| Variable | Example placeholder | Purpose |
|----------|---------------------|---------|
| `OPENAI_API_KEY` | `sk-proj-xxxxxxxxxxxxxxxx` | Powers `/assist` AI features |

### Optional — auth hardening

| Variable | Example placeholder | Purpose |
|----------|---------------------|---------|
| `ENFORCE_EMAIL_VERIFICATION` | `true` | Blocks login until email is confirmed |

### Optional — E2E testing (CI / local Playwright)

| Variable | Example placeholder | Purpose |
|----------|---------------------|---------|
| `E2E_TEST_EMAIL` | `student@test.engsols.dev` | Authenticated smoke-test user |
| `E2E_TEST_PASSWORD` | `test-password-change-me` | Password for E2E user |
| `PLAYWRIGHT_BASE_URL` | `http://localhost:3000` | Override Playwright base URL |
| `CI` | `true` | Set automatically in GitHub Actions |

### Full `.env.local` template

```env
# ── Core ──────────────────────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# ── Stripe + service role ─────────────────────────────────────────
STRIPE_SECRET_KEY=sk_test_51XXXXXXXXXXXXXXXXXXXXXXXX
STRIPE_WEBHOOK_SECRET=whsec_XXXXXXXXXXXXXXXXXXXXXXXX
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# ── LiveKit ───────────────────────────────────────────────────────
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=APIxxxxxxxxxxxx
LIVEKIT_API_SECRET=your_livekit_api_secret

# ── Email (optional) ──────────────────────────────────────────────
RESEND_API_KEY=re_xxxxxxxxxxxx
EMAIL_FROM=EngSols <notifications@engsols.com>

# ── Web push (optional) ───────────────────────────────────────────
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
VAPID_SUBJECT=mailto:notifications@engsols.com

# ── Analytics (optional) ─────────────────────────────────────────
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_SENTRY_DSN=

# ── AI assist (optional) ──────────────────────────────────────────
OPENAI_API_KEY=

# ── Auth (optional) ───────────────────────────────────────────────
ENFORCE_EMAIL_VERIFICATION=false
```

---

## 2. Database Schema Directory

Migrations **`001`–`017`** in `supabase/migrations/` define the live schema. RLS is enabled on all user-facing tables.

### Core identity & profiles

| Table | Purpose | Key relationships |
|-------|---------|-------------------|
| **`profiles`** | Extends `auth.users` — role (`student` \| `mentor` \| `admin`), display name, avatar, career goals | `id` → `auth.users.id` |
| **`mentor_profiles`** | Public mentor listing — slug, discipline, skills, `monthly_rate`, approval status | `user_id` → `profiles.id` (1:1) |

### Bookings & mentorship commerce

| Table | Purpose | Key relationships |
|-------|---------|-------------------|
| **`booking_requests`** | Intro calls, monthly mentorship, one-off sessions | `user_id` → `profiles` (student); `mentor_user_id` → `profiles`; `mentor_slug` → `mentor_profiles.slug`; optional `stripe_customer_id`, `stripe_subscription_id` (migration 017) |
| **`specialist_mentor_requests`** | Logged when mentor directory filters return zero results | `user_id` → `profiles` (nullable); may link to `booking_requests.specialist_request_id` |

### Student portfolios & endorsements

| Table | Purpose | Key relationships |
|-------|---------|-------------------|
| **`portfolios`** | Student public portfolio pages | `user_id` → `profiles.id` (1:1) |
| **`portfolio_projects`** | Individual projects within a portfolio | `portfolio_id` → `portfolios.id` |
| **`portfolio_experience`** | Work history entries | `portfolio_id` → `portfolios.id` |
| **`project_endorsements`** | Mentor vouches on a portfolio project | `mentor_profile_id` → `mentor_profiles`; `portfolio_id` → `portfolios`; `portfolio_project_id` → `portfolio_projects` |

### Live collaboration

| Table | Purpose | Key relationships |
|-------|---------|-------------------|
| **`live_sessions`** | Scheduled / live / ended video rooms | `host_id` → `profiles`; optional `mentor_profile_id`, `forum_post_id`, `booking_request_id` |

Real-time whiteboard + CAD sync uses **LiveKit data channels** (`src/lib/livekit-sync.ts`, `src/lib/live-room-state.ts`) — ephemeral coordinates are **not** persisted to Postgres.

### Roadmaps & milestones

| Table | Purpose | Key relationships |
|-------|---------|-------------------|
| **`mentorship_roadmaps`** | Mentor-authored study plans for a student | `mentor_user_id`, `student_user_id` → `profiles`; optional `booking_request_id` → `booking_requests`; status: `active` \| `completed` \| `archived` |
| **`roadmap_milestones`** | Ordered milestones within a roadmap | `roadmap_id` → `mentorship_roadmaps.id` |

### Mock exams & monetization

| Table | Purpose | Key relationships |
|-------|---------|-------------------|
| **`mock_exams`** | Exam definitions — questions stored as JSONB; `is_premium`, `price_cents` (migration 016) | Standalone; referenced by attempts & purchases |
| **`exam_attempts`** | In-progress and completed student exam sessions | `user_id` → `profiles`; `exam_id` → `mock_exams` |
| **`user_purchased_exams`** | Stripe unlock ledger for premium exams | `user_id` → `profiles`; `exam_id` → `mock_exams`; `stripe_session_id` (unique); optional `stripe_customer_id` |

### Entity relationship (Phase 7 focus)

```
profiles ─────┬──── mentor_profiles
              │
              ├──── booking_requests ──── mentorship_roadmaps ──── roadmap_milestones
              │         (Stripe IDs)              │
              │                                 └── archived on subscription cancel
              │
              ├──── portfolios ──── portfolio_projects ──── project_endorsements
              │                                              └── mentor_profiles
              │
              ├──── exam_attempts ──── mock_exams
              │
              └──── user_purchased_exams ──── mock_exams

live_sessions ──── profiles (host)
specialist_mentor_requests ──── profiles (optional)
```

---

## 3. Stripe Webhook Event Matrix

**Endpoint:** `POST /api/webhooks/stripe`  
**Handler:** `src/app/api/webhooks/stripe/route.ts`  
**Runtime:** Node.js (raw body required for signature verification)

Configure these events in the [Stripe Dashboard](https://dashboard.stripe.com/webhooks) (or via Stripe CLI locally):

| Stripe event | Trigger | Handler logic | Side effects |
|--------------|---------|---------------|--------------|
| **`checkout.session.completed`** | Student completes Checkout (exam one-time payment or mentorship subscription) | Reads `metadata.user_id` + either `metadata.exam_id` or `metadata.booking_request_id` | **Exam path:** `recordExamPurchase()` → upsert `user_purchased_exams` with `stripe_session_id` + `stripe_customer_id`. **Mentorship path:** `markMentorshipBookingPaid()` → set `booking_requests.status` = `contacted`, store `stripe_customer_id` + `stripe_subscription_id`, notify mentor. |
| **`customer.subscription.deleted`** | Subscription fully canceled or ended | `closeMentorshipSubscription(subscriptionId, customerId)` | Find active monthly `booking_requests` row → `status` = `closed`; archive linked `mentorship_roadmaps` (`active` → `archived`); email + in-app notification to mentor. |
| **`customer.subscription.updated`** | Plan change, pause, or payment failure | If status ∈ `{canceled, unpaid, incomplete_expired}` → same as deleted | Otherwise no-op (`200 received`). |

### Checkout metadata contract

**Premium exams** (`createExamCheckoutSession`):

```json
{ "user_id": "<uuid>", "exam_id": "<uuid>", "exam_slug": "<slug>" }
```

**Monthly mentorship** (`createMentorshipCheckoutSession`):

```json
{ "user_id": "<uuid>", "booking_request_id": "<uuid>", "mentor_user_id": "<uuid>" }
```

### Related server actions (non-webhook)

| Action | File | Purpose |
|--------|------|---------|
| `createExamCheckoutSession` | `src/actions/stripe.ts` | One-time exam payment |
| `createMentorshipCheckoutSession` | `src/actions/stripe.ts` | Recurring subscription checkout |
| `createBillingPortalSession` | `src/actions/stripe.ts` | Stripe Customer Portal (manage/cancel) |
| `fulfillExamCheckoutSession` | `src/actions/stripe.ts` | Client-side redirect fallback for exam unlock |

---

## 4. Local Verification Checklist

### Install & run

```bash
npm install
npm run dev          # http://localhost:3000
```

### Database migrations

Apply all migrations in order on your Supabase project:

```bash
# Via Supabase CLI (if linked):
supabase db push

# Or paste each file manually in Supabase SQL Editor:
# supabase/migrations/001_live_video.sql … 017_stripe_billing.sql
```

### Lint, unit tests, and production build

```bash
npm run lint         # ESLint — must pass with 0 errors
npm run test:unit    # Vitest — 29 tests (analytics, livekit-sync, filters, etc.)
npm run build        # Next.js production compile + typecheck
```

**Operational standard:** all three commands must pass before merging to `main`.

### End-to-end tests (optional)

```bash
npm run build && npm run start   # terminal 1
npm run test:e2e                 # terminal 2 — requires E2E_TEST_EMAIL/PASSWORD for auth tests
```

### Stripe webhooks (local)

1. Install the [Stripe CLI](https://stripe.com/docs/stripe-cli).

2. Forward events to your local Next.js server:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

3. Copy the webhook signing secret printed by the CLI into `.env.local`:

```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxx  # from `stripe listen` output
```

4. Trigger test events:

```bash
# Simulate a completed checkout (customize with your test session metadata)
stripe trigger checkout.session.completed

# Simulate subscription lifecycle
stripe trigger customer.subscription.deleted
stripe trigger customer.subscription.updated
```

5. For end-to-end payment testing, use Stripe test card `4242 4242 4242 4242` with any future expiry and CVC.

### LiveKit collaboration smoke test

1. Ensure `LIVEKIT_*` env vars are set.
2. Open `/live/[slug]/room` with two browser sessions (or normal + incognito).
3. Switch to **Whiteboard** or **3D Review** tab — confirm `SyncStatusIndicator` shows **Synced** / **Solo Session** appropriately.

### Key admin & mentor routes (manual QA)

| Route | Role | Validates |
|-------|------|-----------|
| `/admin/exams` | admin | Mock exam CMS |
| `/admin/revenue` | admin | Platform revenue dashboard |
| `/mentor/earnings` | mentor | MRR + active mentee roster |
| `/settings` | student | **Manage billing & subscriptions** portal button |
| `/certifications/exams/[slug]` | student | Premium exam lock + checkout |

---

## File Map (quick reference)

| Domain | Location |
|--------|----------|
| Stripe actions | `src/actions/stripe.ts` |
| Exam actions | `src/actions/exam.ts` |
| Webhook | `src/app/api/webhooks/stripe/route.ts` |
| Purchase ledger | `src/lib/exam-purchases.ts`, `src/lib/booking-payments.ts` |
| Analytics | `src/lib/data/analytics.ts` |
| LiveKit sync protocol | `src/lib/livekit-sync.ts`, `src/lib/live-room-state.ts` |
| Collaboration UI | `src/components/live/CollaborationWorkspace.tsx` |
| Types | `src/types/database.ts` |

---

## Maintenance principles

1. **Server Actions for mutations** — never expose service-role keys to the client.
2. **RLS first** — use `SUPABASE_SERVICE_ROLE_KEY` only in webhooks, purchase writes, and admin analytics.
3. **Type guards on LiveKit packets** — all data-channel payloads validated in `livekit-sync.ts`.
4. **Zero-lint builds** — `npm run lint && npm run test:unit && npm run build` before every release.
5. **Migrations are append-only** — never edit applied migration files; add `018_*.sql` for schema changes.

---

*Last updated: Phase 7 completion — filters, live workspaces, roadmaps, mock exams, endorsements, Stripe subscriptions, customer portal, and revenue dashboards.*
