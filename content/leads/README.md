# Rimini restaurant leads (variant B)

Restaurants in **provincia Rimini** without their own website. Facebook / Instagram / TheFork are OK.

## Quick start (auto-scrape)

Full pipeline — scrape Google Maps, filter, export Excel:

```bash
npm run scrape:rimini-leads
```

**Time:** ~1–3 hours for 200 leads (depends on how many places have websites).

**Output:** `content/leads/export/rimini-no-website-200.xlsx`

### Scrape only

```bash
npm run scrape:rimini-restaurants
npm run scrape:rimini-restaurants -- --resume
npm run scrape:rimini-restaurants -- --limit 200 --delay 2500
```

Raw data saved to:

- `content/leads/import/scraped-google-maps-latest.csv`
- `content/leads/import/scraped-google-maps-YYYY-MM-DD.csv`

### Filter + Excel only (from existing scrape)

```bash
npm run export:rimini-leads
# or
node content/leads/scripts/normalize-leads.mjs --input content/leads/import/scraped-google-maps-latest.csv
```

## Filter rules (variant B)

| Website in Google Maps | Included? |
|------------------------|-----------|
| Empty | Yes — `no website` |
| Facebook, Instagram, TheFork, TripAdvisor, … | Yes — `solo social` |
| Own domain (`*.it`, hotel site, …) | No |

## Excel columns

`N | Nome | Indirizzo | Telefono | Email | Google Maps | Rating | Recensioni | Instagram | Facebook | Comune | Note`

## Expectations

| Field | Coverage |
|-------|----------|
| Nome, Indirizzo, Telefono, Google Maps | ~90–100% |
| Rating, Recensioni | ~80–95% |
| **Email** | ~5–15% (Google rarely lists email) |
| Owner names | not available |

## Manual CSV import (optional)

You can still import a purchased SmartScraper/Outscraper CSV into `content/leads/import/` and run `npm run export:rimini-leads`.

SmartScraper `url` column = website (not Google Maps). Do not use `sample-data-Restaurants.csv` (10-row preview, all with websites).

## Privacy / git

`content/leads/import/` and `content/leads/export/*.xlsx` are **gitignored**.

## Troubleshooting

- **Empty Excel:** sample CSV or all scraped places have websites — run `npm run scrape:rimini-leads`.
- **Google captcha / block:** run `npm run scrape:rimini-restaurants -- --resume` later; progress is saved in `scraped-google-maps-latest.csv`.
- **Fewer than 200 rows:** scraper stops when searches are exhausted; re-run with `--resume` or increase `--limit` after adding queries in `scrape-rimini-restaurants.mjs`.
