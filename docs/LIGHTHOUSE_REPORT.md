# Lighthouse Report — EngSols

**Run date:** 2026-06-20  
**Environment:** Local production build (`npm run build` + `next start` on port 3456)  
**Tool:** Lighthouse CLI (Chrome for Testing via Playwright)  
**Note:** `https://engsols.com` was unreachable from the audit environment (connection timeout). Scores below reflect the current codebase built for production on localhost. Deployed scores may differ slightly due to CDN, TLS, third-party scripts, and geographic latency.

## Summary scores

| Page | Form factor | Performance | Accessibility | Best practices | SEO |
|------|-------------|-------------|---------------|----------------|-----|
| `/` (home) | Mobile | **86** | **100** | **100** | **100** |
| `/` (home) | Desktop | **99** | **100** | **100** | **100** |
| `/mentors` | Mobile | **90** | **93** | **100** | **100** |
| `/mentors` | Desktop | **100** | **93** | **100** | **100** |

## Core Web Vitals (selected)

| Page | FCP | LCP | TBT | CLS | Speed index |
|------|-----|-----|-----|-----|-------------|
| Home (mobile) | 1.2 s | 4.3 s | 10 ms | 0 | 1.2 s |
| Home (desktop) | 0.3 s | 0.9 s | 0 ms | 0 | 0.4 s |
| Mentors (mobile) | 1.2 s | 3.7 s | 0 ms | 0 | 1.2 s |
| Mentors (desktop) | 0.3 s | 0.8 s | 0 ms | 0 | 0.3 s |

## Accessibility gaps (`/mentors`)

- Heading order skips levels (e.g. `h1` → `h3` without `h2`)
- Filter `<select>` elements missing associated `<label>` elements

## Raw reports

JSON artifacts: `docs/lighthouse/*.json`

## Re-run locally

```bash
npm run build
npm run start -- -p 3456

# Install browser once (if needed)
PLAYWRIGHT_BROWSERS_PATH=".playwright-browsers" npx playwright install chromium

export CHROME_PATH="$(pwd)/.playwright-browsers/chromium-1228/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing"

npx lighthouse http://localhost:3456 \
  --only-categories=performance,accessibility,best-practices,seo \
  --output=html --output-path=docs/lighthouse/home-mobile.html \
  --form-factor=mobile
```

For production URL audits, run the same command against `https://engsols.com` from a machine with network access to the live site, or use [PageSpeed Insights](https://pagespeed.web.dev/) in the browser.
