# SEO validation log

| Check | Command / method | Result |
|-------|------------------|--------|
| Typecheck | `npm run typecheck` | PASS (exit 0) |
| Lint | `npm run lint` | PASS (exit 0) |
| Build | `npm run build` | PASS (exit 0) — Next.js 15.2.9 |
| Canonical helper | Code review `lib/seo/metadata.ts` | Present; wired on public pages |
| booking-flow | Redirect removed from `next.config.mjs`; page in static params | Restored |
| Sitemap | Includes services + audit; excludes retired work slugs | Code review |
| Robots | Disallow `/studio/`, `/api/`; sitemap URL | Code review |
| Logo accessible name | `BrandLogo` `aria-label={BRAND_NAME}` | “DormUp Studio” |

External (pending owner): Rich Results Test, PageSpeed, GSC coverage, AI visibility prompts.
