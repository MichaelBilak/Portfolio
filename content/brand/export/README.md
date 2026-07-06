# Business card · Canva elements

Generated 2026-07-03 · 17 PNG files

## Canva setup

1. **Create design** → Custom size → **1050 × 600 px** (EU business card, 85×55 mm @ 300 dpi)
2. Upload PNGs from `elements/` and `reference/`
3. Layer order (bottom → top):

| Layer | File |
|-------|------|
| 1 | `elements/bg-card.png` — full bleed background |
| 2 | `elements/glow-gold-top-left.png` — top-left corner (front) |
| 3 | `elements/logo-d-mark.png` |
| 4 | `elements/text-wordmark-full.png` |
| 5 | `elements/text-region-label.png` — bottom |
| 6 | `elements/line-divider-vertical.png` — if building manually |

**Back side:** duplicate page, use `reference/ref-back.png` as guide or stack:
`bg-card` → `text-eyebrow-services` → `text-tagline-it` → `line-divider-horizontal` → `text-contacts` → `text-location` + `dot-emerald` + `text-cta-audit`

## Folders

| Folder | Contents |
|--------|----------|
| `elements/` | Separate layers for Canva |
| `reference/` | Full front/back mockups for alignment |

Regenerate: `npm run export:business-card-canva`

Source: `content/brand/templates/canva-export.html`
