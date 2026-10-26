# SEO implementation tracker

Statuses: `DONE` | `NOT_APPLICABLE` | `BLOCKED` | `NEEDS_OWNER_INPUT` | `NOT_VERIFIED`

| Task ID | Category | Priority | Issue | Planned | Status | Verification |
|---------|----------|----------|-------|---------|--------|--------------|
| T01 | Docs | P1 | No SEO docs | Create audit/inventory/map/tracker | DONE | Files in `docs/` |
| T02 | Tech SEO | P0 | Wrong canonicals | `lib/seo/metadata.ts` + page wiring | DONE | typecheck/build |
| T03 | Tech SEO | P0 | booking-flow redirect | Remove redirect; keep page | DONE | next.config + build routes |
| T04 | Tech SEO | P0 | Sitemap/robots | Exclude redirects; disallow studio | DONE | Code |
| T05 | Schema | P1 | Limited JSON-LD | Org+WebSite+Service+Breadcrumb | DONE | Code |
| T06 | Content | P0 | Service hierarchy | Remap + visibility/growth + video elevate | DONE | data + localized-services |
| T07 | Content | P0 | Positioning / Rimini | Hero, about, footer, meta | DONE | translations |
| T08 | Content | P1 | Audit landing | `/audit-digitale` | DONE | build lists route |
| T09 | GEO | P1 | Entity + answer-first | About + service FAQs | DONE | copy |
| T10 | GEO | P2 | llms.txt | Factual index | DONE | `public/llms.txt` |
| T11 | Analytics | P1 | Consent / events | Docs + `audit_submit` | DONE | docs + contact-form |
| T12 | QA | P0 | Build/typecheck/lint | Run CI scripts | DONE | all exit 0 |
| T13 | External | — | GSC / Bing / GBP | Owner | NEEDS_OWNER_INPUT | — |
| T14 | Legal | — | Consent banner | Owner legal | NEEDS_OWNER_INPUT | — |
| T15 | Content | P2 | Thin city landings | Skip until substantive | NOT_APPLICABLE | — |
