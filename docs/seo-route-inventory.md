# Public route inventory

Canonical host: `https://www.dormup-it.com`  
Default locale: `it` (unprefixed). Other locales: `/en`, `/fr`, `/ru`, `/de`, `/es`.

## Indexable marketing routes

| Path (IT) | Purpose | Index |
|-----------|---------|-------|
| `/` | Home | yes |
| `/about` | About / entity | yes |
| `/contact` | Contact + audit intent | yes |
| `/order` | Service selection | yes |
| `/privacy` | Privacy | yes |
| `/services` | Services index | yes |
| `/services/[slug]` | Service detail | yes (live slugs only) |
| `/work` | Portfolio | yes |
| `/work/[slug]` | Case study | yes (live projects) |
| `/audit-digitale` | Digital audit landing | yes |

## Service slugs (target)

| Slug | Service id | Notes |
|------|------------|-------|
| `google-ai-visibility` | `visibility` | New |
| `premium-website` | `premium-site` | Remapped websites |
| `photo-video` | `photo-video` | Video Production |
| `booking-flow` | `booking-flow` | Automation (page restored) |
| `digital-growth` | `digital-growth` | New |
| `monthly-support` | `monthly-support` | Care |
| `redesign` | `redesign` | Supporting |

## Redirects (permanent)

| From | To |
|------|-----|
| `/work/porto-sole` | `/work` |
| `/work/rockisland-rimini` | `/work` |
| `/work/premium-restaurant-local-concept` | `/work/mare-vivo` |

## Non-indexable

| Path | Reason |
|------|--------|
| `/studio/*` | Admin; `robots` disallow + layout noindex |
| `/api/*` | Application endpoints |

## Locale notes

Each path above has equivalents under `/en/...`, `/ru/...`, etc. Italian uses unprefixed URLs. `x-default` → Italian URL.
