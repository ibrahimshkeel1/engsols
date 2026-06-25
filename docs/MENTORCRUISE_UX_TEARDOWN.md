# Page-by-page UX teardown: EngSols vs MentorCruise

> **Living document** — competitive UX analysis and actionable improvement plan.
>
> *Created: 2026-06-25*

This document compares [EngSols](https://engsols.com) to [MentorCruise](https://mentorcruise.com/) across homepage, mentor browse, mentor profile, and booking flow. MentorCruise optimizes for **fast trust → fast match → fast book**. EngSols has strong engineering-specific bones, but the funnel still feels like a platform in progress.

---

## Executive summary

| Dimension | MentorCruise | EngSols today |
|-----------|--------------|---------------|
| Scale | 7,000+ mentors, 40,500+ matches | Early supply; empty states possible |
| Positioning | General career mentorship | O&G and applied engineering niche |
| Homepage | Pain-first + goal matcher | Platform pitch + many secondary paths |
| Booking | In-platform pay → book → chat | Calendly + request form + login gate |
| Trust | Heavy social proof, no zero-star cards | 0.0 (0) ratings shown on new mentors |
| Differentiators | Brand, liquidity, B2B | Disciplines, compare, certs/jobs stack |

**Bottom line:** MentorCruise wins on trust, scale, payments, and focus. EngSols wins on niche depth and platform breadth — but only if mentor supply grows and the money/booking loop is finished.

---

## 1. Homepage

### MentorCruise does

- **Emotional hook first:** "You don't have to figure it out alone" — speaks to layoffs, feeling stuck, career change.
- **Interactive goal entry:** A text field + chips ("I was laid off", "Start on a budget") that immediately narrow the catalog.
- **Social proof above the fold:** Mentor avatars, "Join 40,500+ people", rotating testimonials, big-company logos.
- **One primary CTA:** "Browse mentors" — everything else is secondary.

### EngSols does today

- Hero: "The career platform to get mentored, certified, and hired"
- Sub: "One place for oil & gas and applied engineers to find mentors and move forward with clarity."
- CTAs: "Find a Mentor" + "How it works"
- Full-screen intro splash ("One stop solution for engineers") before users see the hero
- Components: `Hero`, `ValueProps`, `HowItWorks`, `FeaturedMentors`, `StartHereJourney`, `TestimonialCTA` (×2)

### Gaps

| Issue | Impact |
|-------|--------|
| **Platform pitch, not pain pitch** | "Career platform" is abstract; MentorCruise sells relief from confusion. |
| **No goal input on homepage** | Users must click through to `/mentors` before filtering. `/assist` matcher is login-gated and buried. |
| **Thin stats bar** | "X mentors · Y disciplines · Free intro" — MentorCruise shows thousands of matches and satisfaction %. |
| **Intro splash delays value** | Nice branding, but it blocks first-time users from seeing mentors or proof. |
| **Split attention** | Many sections, many paths, weak single funnel. |

### Fixes (highest leverage)

1. **Replace hero copy with an engineering pain state:** e.g. "Stuck between FE prep, job apps, and O&G career moves?" + chips: `Pass FE/PE` · `Break into O&G` · `Interview prep` · `Career change` → each links to `/mentors?goal=...`.
2. **Move matching up:** A lightweight public goal picker (no login) on the homepage that pre-filters the directory — `MentorFilters` goal dropdown already exists.
3. **Kill or shorten the splash** for returning visitors; show mentor faces + one testimonial in the hero instead.
4. **Lead with proof when you have it:** Even 3 real quotes with company names beats generic "What engineers say" with empty data.

### Suggested homepage wireframe (EngSols-specific, not a clone)

```
[Skip intro splash or 1s max]

H1: "Pass your FE. Land the O&G role. Get a mentor who's done both."
Sub: Free 30-min intro · Vetted engineers · Cancel anytime

[Goal chips: FE/PE prep | Break into O&G | Interview prep | Career change]
[Search: "e.g. reservoir simulation, drilling engineer"]

[3 mentor cards with price + "Free intro" badges]
[1 testimonial with name + company]

CTA: Browse all mentors →
Secondary: How certifications & jobs fit in →
```

---

## 2. Mentor browse (`/mentors`)

### MentorCruise does

- Cards show **photo, name, title, company, rating, top 3 skills, price/mo, "View profile"** — scannable in 2 seconds.
- Category landing pages (Engineering, AI, PM…) for SEO and discovery.
- Infinite-feeling grid; always enough results to scroll.

### EngSols does today

`MentorCard` is more sophisticated in some ways — pixel hover reveal, company logo, skill pills, compare flow, skill graph filter.

Pain points:

- Shows **0.0 (0)** on cards when `reviewCount === 0` (hurts trust)
- Filters are sidebar dropdowns — correct for power users, not as inviting as goal chips
- Low inventory → empty / fallback states
- Hover-to-reveal is desktop-delight; mobile users only see passport photo + name
- PageHero is generic: "Browse vetted mentors"

### Gaps

| Issue | Impact |
|-------|--------|
| **Low inventory = empty / fallback states** | Specialist request modal is good, but MC rarely shows "0 mentors". |
| **0-star display on cards** | Signals "unproven" instead of "new mentor". |
| **Hover-to-reveal on mobile** | Rich detail hidden on mobile. |
| **No category hero on browse page** | MC contextualizes by role. |

### Fixes

1. **Hide rating until `reviewCount > 0`**; show "New mentor" or "Free intro" badge instead.
2. **Default sort to "available this week"** when `introSlotsThisWeek` data exists — urgency MC uses implicitly.
3. **Browse page sub-hero by filter:** When `?goal=fe-prep`, show "Mentors who've helped engineers pass FE/PE" + 1 outcome stat.
4. **Simpler mobile card:** Always show 2 skills + price on the front face; save hover reveal for desktop only.
5. **Surface compare flow more:** "Not sure? Save 2–3 and compare" near the filter bar (MC doesn't have this).

---

## 3. Mentor profile (`/mentors/[slug]`)

### MentorCruise does

- **Price visible immediately** in hero and sticky sidebar.
- **"Starting from $X/month"** + what's included (chats, calls, cadence).
- Reviews with **full names and roles** prominently placed.
- **Free trial** CTA is the default action.
- Booking feels **in-platform** — pick plan, pay, done.

### EngSols does today

Strong structure: hero strip → value bullets → booking card → outcomes → background → reviews → urgency → final CTA. Mobile sticky book bar is good.

Pain points:

**A. Booking is split across two systems**

Users see **Calendly (external)** AND **request form (internal)** AND **login wall**. MentorCruise has one path.

**B. Login required to book**

MC lets you start booking with minimal friction; account comes later.

**C. Generic "Outcomes" block**

Same 4 bullets for every mentor:

- Career roadmap clarity
- Exam preparation guidance
- Portfolio and CV feedback
- Weekly direction with monthly mentorship

**D. "Deep Session" lumps two products**

Study plan ($119) and interview prep ($149) are merged into one "Deep Session" at study-plan price. MC shows them as separate SKUs.

**E. Bio is underweighted**

`mentor.bio` is in metadata but the profile page barely shows the full bio — mostly auto-generated bullets.

### Fixes

1. **Single booking path:** Either Calendly OR in-app checkout — not both. If Stripe is ready, drop external Calendly for paid flows.
2. **Guest booking for intro calls** — email + goal only; create account after confirmation.
3. **Sticky right column on desktop** with price, availability, and primary CTA. Booking card is mid-page; users scroll past credibility before they can act.
4. **Replace static OUTCOMES** with mentor-specific package text from the DB.
5. **Split deep sessions** into Study Plan vs Interview Prep with correct pricing.
6. **Show full bio** in "About" section; keep bullets as "What I help with".

---

## 4. Booking / checkout flow

### MentorCruise does

1. Pick mentor → pick plan (trial / monthly / one-off)
2. Pay in-platform
3. Message mentor in-app
4. Review after session
5. Cancel anytime — clearly stated at every step

### EngSols does today

Flow is: **fill form → "Request sent" → mentor emails you** (or Stripe redirect for monthly if configured).

That's a **lead form**, not a **marketplace booking**. Users don't know what happens next or when.

### Gaps

| Step | MentorCruise | EngSols |
|------|--------------|---------|
| Confirmation | Instant calendar hold | Async email follow-up |
| Payment | Before first call (trial excepted) | Partial Stripe |
| Trust copy | "Cancel anytime", "Free trial" | "No surprises" — vague |
| Post-book | In-app chat | No visible messaging loop on profile |

### Fixes

1. **After submit:** Show a clear timeline — "Mentor typically responds within X hours → You'll get a calendar link → First call is free."
2. **Intro = instant book** when Calendly exists — skip the form entirely for intros; form only for monthly/custom.
3. **Add cancellation / refund policy** next to monthly price (MC repeats this everywhere).
4. **Wire Stripe end-to-end** so "Pay $X/mo" actually completes in one session.
5. **Student inbox** — expose "My bookings" for students with status tracking (mentor side exists at `/mentor/bookings`).

---

## 5. Cross-page patterns MentorCruise nails

### A. Consistent "free" story

- MC: "Free trial with every mentor."
- EngSols: "Free intro calls" in stats, but some mentors have `introCallRate > 0`.
- **Fix:** Align messaging or badge per mentor: **Free intro** vs **$39 intro**.

### B. Testimonials as conversion fuel

MC repeats quotes between sections with photos and job titles. EngSols closing CTA has no social proof — add one quote + avatar above the button.

### C. SEO landing pages

MC has `/engineering-mentors`, `/career-coaches`, etc. EngSols has `/disciplines/[slug]` — use that as the MC-equivalent. Link discipline pages from homepage chips and mentor cards.

---

## Priority matrix

If you only do five things:

| Priority | Change | Why |
|----------|--------|-----|
| **P0** | One booking path + guest intro booking | Removes the biggest conversion cliff |
| **P0** | Hide 0-star ratings; badge "New" / "Free intro" | Trust on browse + profile |
| **P1** | Homepage goal chips → pre-filtered `/mentors` | Matches MC's hero matcher without AI |
| **P1** | Sticky booking sidebar on profile | Keeps CTA visible while reading |
| **P2** | Discipline landing pages as acquisition | SEO + niche positioning MC can't match |

---

## Where EngSols is already ahead

Don't copy everything — these are real advantages:

- **Engineering discipline depth** (O&G, FE/PE, skill graph)
- **Compare mentors** flow (`/mentors/compare`)
- **Specialist request** when filters return zero
- **Integrated career stack** (certs, jobs, forum) — just don't lead with it on the homepage
- **Availability urgency** (`introSlotsThisWeek`) — MC doesn't surface this as clearly

---

## Related files

| Area | Key components |
|------|----------------|
| Homepage | `src/components/home/Hero.tsx`, `HomeIntroSplash.tsx`, `SocialProof.tsx`, `FeaturedMentors.tsx` |
| Browse | `src/components/mentors/MentorsDirectory.tsx`, `MentorCard.tsx`, `MentorFilters.tsx` |
| Profile | `src/app/mentors/[slug]/page.tsx`, `MentorBookingCard.tsx` |
| Booking | `src/components/mentors/BookingRequestForm.tsx` |
| Matching | `src/app/assist/page.tsx` |
| Session types | `src/data/sessionTypes.ts` |

---

## Implementation order (suggested)

### Phase 1 — Quick wins (1–2 days)

- [x] Hide zero ratings on `MentorCard` and `MentorRating`; show "New mentor" / "Free intro" badges
- [x] Homepage goal chips linking to `/mentors?goal=...`
- [x] Per-mentor intro badge (Free vs $X)
- [x] Add testimonial to closing CTA section

### Phase 2 — Conversion (3–5 days)

- [x] Guest intro booking (no login wall for free intros)
- [x] Single booking path (remove Calendly + form duplication)
- [x] Sticky booking sidebar on mentor profile (desktop)
- [x] Post-submit booking timeline / confirmation UX

### Phase 3 — Differentiation (1–2 weeks)

- [x] Split Study Plan vs Interview Prep in booking card
- [x] Mentor-specific outcomes (replace static `OUTCOMES` array)
- [x] Full bio section on profile
- [x] Discipline landing page links from homepage
- [x] Student "My bookings" status page
- [x] Shorten or remove homepage intro splash
