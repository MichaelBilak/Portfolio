# Analytics & measurement plan

## Current wiring

- GA4 via `gtag` when `NEXT_PUBLIC_GA_MEASUREMENT_ID` or CMS `seo_defaults.ga_measurement_id` is set.
- Optional Plausible when domain configured.
- Events: `contact_submit`, `order_proceed` via `trackEvent()` in `components/analytics`.

## Recommended conversion events

| Event | When |
|-------|------|
| `contact_submit` | Successful contact API response |
| `audit_submit` | Same form with `intent=audit` (prop or distinct name) |
| `order_proceed` | User continues from `/order` to contact with cart |
| `service_cta_click` | Optional; prefer form success over click vanity |

Avoid double-firing success events on remount.

## Consent

**NEEDS_OWNER_INPUT:** no consent banner exists. If GA is non-essential under applicable law, implement Consent Mode / banner before production reliance. Privacy copy must match actual processors.

## KPIs (business)

Organic impressions/clicks (GSC), sessions, contact + audit submissions, qualified leads, AI-referral sessions (when attributable). Prefer qualified inquiries over vanity traffic.
