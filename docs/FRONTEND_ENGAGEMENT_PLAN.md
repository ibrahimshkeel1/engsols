# Frontend Engagement Plan

> **Goal:** Make EngSols sequential, sticky, and engaging — visitors should know what to do next, explore deeper, and come back.
>
> **North star:** A new visitor picks a goal → sees proof → gets mentor names in 30 seconds → reads a discussion → signs up → books an intro → returns because the homepage remembers them.
>
> *Created: 2026-06-16 · Update checkboxes as work ships.*

---

## How to use this doc

- `[ ]` = not started
- `[x]` = done
- Add date + commit/PR notes inline when completing items
- Prefer **Wave order** — later waves build on discovery loops from earlier ones

---

## Wave 1 — Guided journey (highest ROI)

*Site feels directed immediately; visitors know step 1.*

- [x] **1.1 “Start here” journey strip (homepage)**
  - New visitors: path picker (Find mentor · Prep FE/PE · Ask forum · Watch live · Build portfolio)
  - Each chip links to the right pre-filtered destination

- [x] **1.2 Logged-in “Continue your journey” strip**
  - Replace generic hero for signed-in users
  - Show: saved mentors, unfinished portfolio, open job apps, unread notifications

- [x] **1.3 Reorder homepage for narrative flow**
  - Suggested order: Hero → Start here → Happening now → Featured mentors → How it works → One-off sessions → Social proof → Community → CTA
  - Move company marquee below proof sections

- [x] **1.4 Public career assist preview (no login)**
  - Homepage widget: pick a goal (3 chips) → show 3 mentor matches instantly
  - CTA: “Sign up to save matches & book intro”

- [x] **1.5 Upgrade “Happening now” activity hub**
  - Live session card with Join + viewer count
  - Hot forum thread with reply count + recency
  - Optional: auto-refresh or Realtime on this strip

- [x] **1.6 Clickable company marquee**
  - Logo/name links to `/mentors?company=…` (or equivalent filter)

---

## Wave 2 — Human & alive content

*Proof, personality, and rabbit holes between features.*

- [x] **2.1 Real testimonials section**
  - 2–3 cards: photo, name, discipline, outcome quote
  - Link to mentor or portfolio where relevant
  - Replace or enrich generic `TestimonialCTA`

- [x] **2.2 Forum cards that feel alive**
  - Author avatar, discipline stripe, last reply time
  - Solved badge, reputation chip, top-reply preview

- [x] **2.3 Mentor profile as a story**
  - Sequential sections: Why mentor with me → Reviews → What students ask → Book intro
  - Sticky booking sidebar on desktop
  - Optional: intro video field + player

- [x] **2.4 Cross-link rails on all content types**
  - Forum posts, news, certs, jobs: “Mentors who can help”, related discussions, upcoming live

- [x] **2.5 Onboarding as a 3-step story**
  - Step 1: Photo + goal
  - Step 2: Instant “3 mentors for you” match screen
  - Step 3: Portfolio build (skippable)
  - Progress % visible after signup

---

## Wave 3 — Return visits & personalization

*Reasons to come back tomorrow.*

- [x] **3.1 Personalized logged-in homepage**
  - Welcome by name, goals progress, next suggested action, saved mentors row

- [x] **3.2 `/for-you` weekly digest page**
  - New mentors in discipline, matching forum threads, live this week, jobs, cert milestones

- [x] **3.3 Interactive skill graph visualization**
  - Clickable bubble chart on `/mentors` and `/assist` (size = mentor count, click = filter)

- [x] **3.4 Discipline landing pages**
  - e.g. `/disciplines/reservoir-engineering`: mentors, forum, certs, live, stats

- [x] **3.5 Forum gamification surfaced in UI**
  - Reputation on cards and profiles, “helpful answer” badges, “active this week”

- [x] **3.6 Live session countdown + calendar**
  - “Starts in Xh Ym”, Add to Google Calendar, push reminder hook

- [x] **3.7 Portfolio discovery feed**
  - Open-to-work filter prominent, project thumbnails, “Recently updated” sort

- [x] **3.8 News magazine layout**
  - Hero article, editorial grid, sidebar links to mentors/certs

- [x] **3.9 Search as exploration**
  - Trending, grouped results (mentors / forum / jobs / news), rich previews

- [x] **3.10 Empty states that invite action**
  - Every empty state: one concrete CTA + template actions (e.g. forum prompt chips)

---

## Wave 4 — Premium polish

*Feels finished, shareable, trustworthy.*

- [x] **4.1 Consistent scroll reveals**
  - Use `AnimateIn` / section entry on key pages beyond homepage

- [x] **4.2 Skeleton loaders**
  - Bento skeletons for mentors, forum, live while data loads

- [x] **4.3 Sticky mobile CTA on mentor profiles**
  - Floating “Book free intro” after scroll

- [x] **4.4 Share cards + OG coverage**
  - Share mentor / portfolio / live; OG images where missing

- [x] **4.5 Arabic RTL audit**
  - Nav, bento cards, forms, spacing for AR locale

- [x] **4.6 Micro-copy upgrade**
  - Outcome language site-wide (e.g. “Ask engineers who’ve been there” vs “Forum”)

- [x] **4.7 Video thumbnails on `/videos`**
  - Rich thumbnails for directory click-through

- [x] **4.8 Mentor availability signals**
  - “Responds within 48h” / “Intro calls this week” (manual field OK at first)

- [x] **4.9 Mentor comparison mode**
  - Save 2–3 mentors, side-by-side compare (rate, credentials, goals, company)

- [x] **4.10 Smarter PWA install prompt**
  - Show after engagement (saved mentor, forum post), not on first visit

---

## Explicitly deferred (not this plan)

- [ ] ~~Stripe / payments UI~~ — blocked by product choice
- [ ] ~~Major visual rebrand~~ — current warm editorial system is sufficient
- [ ] ~~Heavy parallax / gimmick animations~~ — hurts performance and trust

---

## Progress summary

| Wave | Total | Done | % |
|------|-------|------|---|
| Wave 1 — Guided journey | 6 | 6 | 100% |
| Wave 2 — Human & alive | 5 | 5 | 100% |
| Wave 3 — Return visits | 10 | 10 | 100% |
| Wave 4 — Premium polish | 10 | 10 | 100% |
| **Total** | **31** | **31** | **100%** |

*Update the table counts when checking boxes above.*

---

## Completion log

| Date | Item | Notes |
|------|------|-------|
| 2026-06-16 | Wave 1 (1.1–1.6) | Start here, continue journey, homepage reorder, assist preview, happening now hub, company filter |
| 2026-06-16 | Wave 2 (2.1–2.5) | Testimonials, alive forum cards, mentor story profile, cross-link rails, 3-step onboarding |
| 2026-06-16 | Wave 3 (3.1–3.10) | Personalized home, /for-you digest, skill graph, discipline hubs, forum gamification, live countdown, portfolio feed, news magazine, search exploration, empty-state chips |
| 2026-06-16 | Wave 4 (4.1–4.10) | Scroll reveals, skeletons, mobile book CTA, share/OG, RTL, micro-copy, video thumbnails, availability signals, mentor compare, engagement-gated PWA |

---

## Related docs

- [PLATFORM_ROADMAP.md](./PLATFORM_ROADMAP.md) — platform features, migrations, backend gaps
