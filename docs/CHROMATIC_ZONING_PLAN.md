# Chromatic Zoning — Color & Engagement Plan

> Plan to make EngSols visually colorful and engaging while keeping text readable.  
> Complements the semantic zone tokens in `src/app/globals.css` and `src/lib/zone-routes.ts`.

---

## Diagnosis: why it still feels blue & white

The site has **good accent tokens** but uses them almost only as **thin stripes and 5–10% washes**. Everything else is:

| Layer | Current | Effect |
|--------|---------|--------|
| Page canvas | Cool gray `214 32% 94%` | Reads as “SaaS blue-gray” |
| Cards | Pure white `bg-card` | Flat, clinical |
| Sections | `bg-muted/30` alternating | Two shades of gray |
| Icons/labels | Recruiter blue `primary` | Blue dominates |
| Zone colors | Navbar bar + hero only | Rest of scroll is neutral |

Accents exist, but **surfaces are still neutral** — that’s why it feels monochrome.

---

## Design direction: Chromatic Zoning

Keep the 5 product zones, but give each zone a **full color family** (not just one accent):

```
accent     → buttons, badges, active nav
surface    → section backgrounds (tinted, ~94–96% lightness)
on-surface → headings & labels on that tint (darkened zone hue)
border     → subtle zone-tinted borders
```

**Rule:** Body copy is always `--text-main` on tinted surfaces. Zone accent is for **labels, icons, borders, CTAs** — never full paragraphs in accent color on a similar tint.

---

## Suggested palette

### Core neutrals (warmer, less “hospital white”)

| Token | Light (HSL) | ~Hex | Use |
|--------|-------------|------|-----|
| `--background` | `40 20% 96%` | `#F7F5F2` | Page canvas — warm linen, not blue-gray |
| `--surface` | `40 15% 99%` | `#FDFCFB` | Cards (soft warm white) |
| `--text-main` | `222 47% 11%` | `#0F172A` | All body text |
| `--text-muted` | `215 16% 42%` | `#5C6570` | Secondary text (≥4.5:1 on surfaces) |
| `--border` | `40 12% 88%` | `#E8E4DE` | Warm borders |

### Zone families (light mode)

| Zone | Accent | Surface tint | On-surface text | CTA text |
|------|--------|--------------|-----------------|----------|
| **Mentorship** | `167 65% 36%` · `#1F9A72` | `158 35% 94%` · `#EEF7F3` | `167 50% 22%` · `#1B5C47` | white |
| **Live** | `262 83% 58%` · `#7C3AED` | `265 40% 96%` · `#F3EFFE` | `262 45% 28%` · `#3D2278` | white |
| **Exams** | `35 92% 44%` · `#D97706` | `38 50% 95%` · `#FEF6E8` | `32 70% 22%` · `#5C3D0A` | white |
| **Recruiter** | `224 76% 48%` · `#2563EB` | `220 38% 95%` · `#EEF3FC` | `224 55% 22%` · `#1A3568` | white |
| **News** | `343 82% 49%` · `#E11D48` | `345 40% 96%` · `#FDF0F3` | `343 60% 24%` · `#6B1528` | white |

### Dark mode (same hues, lifted surfaces)

| Token | Value |
|--------|--------|
| `--background` | `222 47% 9%` |
| Zone surfaces | accent hue at **14–18% lightness** |
| Body text | `210 40% 98%` on zone surfaces |
| CTAs | full accent + `text-white` or dark `text-bg-main` where needed |

---

## Readability rules (non-negotiable)

1. **Never** `text-zone-X` on `bg-zone-X/10` for body text — contrast often fails.
2. Use **`text-text-main`** for paragraphs on any tinted section.
3. Use **`text-zone-X-on`** (new token) only for section labels on matching `bg-zone-X-surface`.
4. **CTAs:** saturated accent bg + white text, or outline variant on tinted surface.
5. **Cards on colored sections:** keep `bg-surface` (warm white) so content stays readable.
6. Run **WCAG AA** on every new pair: body ≥ 4.5:1, large headings ≥ 3:1.

---

## Implementation plan (4 phases)

### Phase 1 — Token foundation (`globals.css` + `zone-styles.ts`)

**Goal:** One source of truth for safe color pairs.

- Add per zone: `--color-{zone}-surface`, `--color-{zone}-on-surface`, `--color-{zone}-border`
- Add Tailwind utilities: `bg-zone-mentorship-surface`, `text-zone-mentorship-on`, `border-zone-live-border`
- Shift neutrals to warm linen (table above)
- Add `section-band-mentorship`, `section-band-live`, etc. — full-width tinted sections with built-in padding

**Effort:** ~1 file + small lib update · **Impact:** High

---

### Phase 2 — Home page rhythm (biggest visual win)

**Goal:** Scroll feels colorful, not one gray slab.

Alternate **zone-tinted section bands** on `/`:

| Section | New treatment |
|---------|----------------|
| Hero | Keep mentorship gradient + spectrum bar (already started) |
| Start here | Already zone cards — bump surface tints to new tokens |
| Career assist | `bg-zone-recruiter-surface` band |
| Happening now | Per-card zone left stripe (live purple, news crimson, forum blue) |
| Featured mentors | `bg-zone-mentorship-surface` |
| How it works | 3 step cards: green / amber / purple icon wells (one per step) |
| One-off sessions | `bg-zone-exams-surface` |
| Social proof | neutral warm white |
| Community strip | 4 cards each with zone color (forum/live/news/recruiter) |
| Testimonial CTA | subtle mentorship → recruiter gradient band |

**Effort:** ~8 home components · **Impact:** Very high

---

### Phase 3 — Route shells & interior pages

**Goal:** Every major route feels “owned” by its zone.

| Route | Shell |
|-------|--------|
| `/mentors` | Mentorship surface hero + green card borders on hover |
| `/live` | Purple stage — stronger `bg-zone-live-surface` page bg |
| `/certifications` | Amber exam band + amber progress UI |
| `/news` | Crimson editorial hero + cream-pink article cards |
| `/companies`, `/portfolios` | Cobalt recruiter surface |
| `/forum` | Recruiter blue community band |
| `/settings`, dashboards | Zone tint on sidebar shell only (already partial) |

Also update:

- `ListPageLayout`, `PageHero` — `zone` prop instead of manual class strings
- `NavbarShell` — keep route bar; add subtle zone tint to nav bg on active route
- `Footer` — zone spectrum stripe + warm dark footer (not flat gray)

**Effort:** ~15–20 files · **Impact:** High

---

### Phase 4 — Cleanup & consistency

**Goal:** No rogue hardcoded Tailwind colors.

- Replace `bg-green-500`, `bg-blue-500`, `text-red-600` in ~30 files with zone tokens
- Update `discipline-colors.ts` to map disciplines → zone families
- Add `ZoneCard`, `ZoneSection`, `ZoneBadge` primitives so new pages stay on-system
- Contrast audit script or Storybook page showing every bg/text pair
- Dark mode pass on all new surfaces

**Effort:** Medium · **Impact:** Long-term maintainability

---

## Visual patterns to reuse (engaging but readable)

```
┌─────────────────────────────────────────────┐
│ ▓▓ zone spectrum bar (1–4px)                │
├─────────────────────────────────────────────┤
│  SECTION LABEL (zone-on color)              │
│  Heading (text-main)                        │
│  Body copy (text-main)                      │
│  ┌──────────┐ ┌──────────┐                  │
│  │ white    │ │ white    │  ← cards stay    │
│  │ card     │ │ card     │    warm white    │
│  │ ▌green   │ │ ▌purple  │  ← left stripe   │
│  └──────────┘ └──────────┘                  │
└─────────────────────────────────────────────┘
   ↑ bg-zone-mentorship-surface (tinted band)
```

- **Left border stripe** (`border-l-4 border-zone-live`) on cards — color without flooding background
- **Icon wells** — `bg-zone-X/20` circle + `text-zone-X-on` icon
- **Alternating bands** — breaks monotony without rainbow chaos
- **White cards on tinted bands** — keeps text readable

---

## What to avoid

- Full-page saturated backgrounds (purple page + purple text)
- Using zone accent for both background **and** text
- More than **2 zone colors per viewport** (except home spectrum bar)
- Replacing all neutrals with color — neutrals anchor readability; **bands + cards** do the color work

---

## Recommended order of work

1. **Phase 1** tokens (1 session) — everything else builds on this
2. **Phase 2** home page (1 session) — biggest visible change on first scroll
3. **Phase 3** route shells (1–2 sessions)
4. **Phase 4** cleanup (ongoing)

---

## Related files

| File | Role |
|------|------|
| `src/app/globals.css` | CSS variables + `@theme inline` bindings |
| `src/lib/zone-routes.ts` | Route → zone mapping for navbar |
| `src/lib/zone-styles.ts` | Panel/dashboard zone styles |
| `src/components/shared/PageHero.tsx` | Per-route hero variants |
| `src/components/layout/NavbarShell.tsx` | Route accent bar |
