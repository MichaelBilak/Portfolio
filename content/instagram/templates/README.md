# Instagram export templates

HTML/CSS templates aligned with DormUp site design tokens. Open locally in Chrome (file:// or via a static server).

## Files

| File | Size | Purpose |
|------|------|---------|
| `master-portrait.html` | 1080×1350 | Empty portrait frame |
| `master-square.html` | 1080×1080 | Empty square frame |
| `master-story.html` | 1080×1920 | Empty story / highlight cover |
| `posts-export.html` | mixed | All 12 launch posts + 5 highlight covers |
| `stories-export.html` | 1080×1920 | All highlight stories + covers (27 frames) |
| `shared.css` | — | Brand tokens, typography, components |

## Export workflow

1. Open `posts-export.html` in Chrome at 100% zoom.
2. Right-click a `.frame` element → Inspect.
3. DevTools → ⋮ → Capture node screenshot (exact pixel dimensions).
4. Paste caption from [`../launch-pack.md`](../launch-pack.md).

Alternative: import frames into Figma/Canva at 1:1 scale and replace placeholder text/images.

## Asset paths

Templates reference `../../../public/images/` relative to this folder. If images fail to load when opening via `file://`, run a local server from repo root:

```bash
npx serve .
```

Then open `http://localhost:3000/content/instagram/templates/posts-export.html`.

## Export PNG (stories)

From repo root:

```bash
npm run export:instagram-stories
```

Output: `content/instagram/export/` — 27 PNG files ready for Instagram Stories.
