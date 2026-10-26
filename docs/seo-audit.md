# SEO audit — DormUp Studio

Date: 2026-10-23  
Site: https://www.dormup-it.com  
Stack: Next.js 15.2 App Router, next-intl, Italian default (`localePrefix: as-needed`).

## Confirmed defects (codebase)

| ID | Issue | Evidence |
|----|--------|----------|
| A1 | Layout metadata set canonical + hreflang to **locale homepage** for all child routes | `app/[locale]/layout.tsx` `generateMetadata` |
| A2 | Sitemap included `/services/booking-flow` while config 301’d it to `/services` | `app/sitemap.ts` + `next.config.mjs` |
| A3 | Weak geo / brand positioning (“Studio Digitale”, footer “Digital Studio”) | layout meta + `lib/translations.ts` |
| A4 | Instagram bio link used `/it/contact` despite as-needed Italian prefix | `lib/brand.ts` |
| A5 | Analytics can load without consent UI | `components/analytics` |
| A6 | No path-specific Service / BreadcrumbList JSON-LD | only Organization in layout |

## Intentionally retained

| Item | Treatment |
|------|-----------|
| `/work/porto-sole`, `/work/rockisland-rimini` | Permanent redirect → `/work` |
| `/work/premium-restaurant-local-concept` | Permanent redirect → `/work/mare-vivo` |
| Contact email `dormup.it@gmail.com` | Verified in repo; no invented domain mailbox |
| No public street address / phone / P.IVA | Do not invent LocalBusiness markup |

## Unreproduced / out of scope without owner

- Soft-404 behaviour on production CDN
- Cloudflare / WAF AI-bot rules
- Google Business Profile eligibility
- Real case-study KPIs and testimonials

## Positioning decision (owner-approved)

Digital Growth & Creative Studio. Primary offers: Google & AI Visibility, Websites & E-commerce, Video Production, AI & Business Automation, Digital Growth & Analytics, Website Care & Support. Plain-language customer copy; “GEO” only secondary.
