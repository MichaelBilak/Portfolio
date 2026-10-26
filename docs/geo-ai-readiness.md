# GEO / AI search readiness

## Application-layer controls

- Public pages are server-rendered (App Router).
- `robots.txt` allows `*` on `/`; disallows `/studio`.
- No intentional block of search or AI-retrieval bots in app code.
- Entity summary lives in visible About (and homepage) copy, not only JSON-LD.
- Service pages include plain-language Q&A (answer-first).
- Optional `public/llms.txt` lists canonical public URLs factually.

## Language rules

- Customer-facing: “Google & AI Visibility” / Italian equivalents.
- “GEO / Generative Engine Optimization” only in secondary technical notes.
- Never claim guaranteed ChatGPT or Google rankings.

## Measurement template (manual)

| Date | Platform | Prompt | Lang | Mentioned? | Cited URL | Competitors | Notes |
|------|----------|--------|------|------------|-----------|-------------|-------|
| | ChatGPT / Perplexity / Gemini / Copilot | | it/en | Y/N | | | |

Do not scrape commercial AI products against their terms. Scores are not claimed without real runs.

## Owner / infra

CDN/WAF bot rules, Search Console indexing, and third-party citations are **outside** the repository (`docs/seo-owner-actions.md`).
