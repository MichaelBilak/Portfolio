/**
 * Export business card Canva elements from canva-export.html to PNG.
 * Usage: npm run export:business-card-canva
 */
import { createServer } from "node:http";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../../..");
const EXPORT_DIR = path.join(ROOT, "content/brand/export");
const PORT = 4568;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
};

function startStaticServer() {
  return new Promise((resolve) => {
    const server = createServer(async (req, res) => {
      try {
        const urlPath = decodeURIComponent(req.url?.split("?")[0] ?? "/");
        const rel = urlPath === "/" ? "/content/brand/templates/canva-export.html" : urlPath;
        const filePath = path.join(ROOT, rel.replace(/^\//, "").replace(/\//g, path.sep));

        if (!filePath.startsWith(ROOT)) {
          res.writeHead(403);
          res.end("Forbidden");
          return;
        }

        const data = await readFile(filePath);
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { "Content-Type": MIME[ext] ?? "application/octet-stream" });
        res.end(data);
      } catch {
        res.writeHead(404);
        res.end("Not found");
      }
    });

    server.listen(PORT, () => resolve(server));
  });
}

async function main() {
  let puppeteer;
  try {
    puppeteer = require("puppeteer");
  } catch {
    console.error(
      "Puppeteer not found. Install once:\n  npm install --save-dev puppeteer\nThen run again:\n  npm run export:business-card-canva"
    );
    process.exit(1);
  }

  const server = await startStaticServer();
  const pageUrl = `http://127.0.0.1:${PORT}/content/brand/templates/canva-export.html`;

  console.log("Starting business card export…");
  console.log(`Page: ${pageUrl}`);

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1200, deviceScaleFactor: 2 });
  await page.goto(pageUrl, { waitUntil: "networkidle0", timeout: 60000 });
  await page.evaluateHandle("document.fonts.ready");
  await new Promise((r) => setTimeout(r, 1500));

  const frames = await page.$$("[data-export]");
  console.log(`Found ${frames.length} elements`);

  let exported = 0;
  for (const frame of frames) {
    const exportId = await frame.evaluate((el) => el.getAttribute("data-export"));
    if (!exportId) continue;

    const outPath = path.join(EXPORT_DIR, `${exportId}.png`);
    await mkdir(path.dirname(outPath), { recursive: true });

    await frame.screenshot({
      path: outPath,
      type: "png",
      omitBackground: true,
    });

    exported += 1;
    console.log(`  ✓ ${exportId}.png`);
  }

  await browser.close();
  server.close();

  const readme = `# Business card · Canva elements

Generated ${new Date().toISOString().slice(0, 10)} · ${exported} PNG files

## Canva setup

1. **Create design** → Custom size → **1050 × 600 px** (EU business card, 85×55 mm @ 300 dpi)
2. Upload PNGs from \`elements/\` and \`reference/\`
3. Layer order (bottom → top):

| Layer | File |
|-------|------|
| 1 | \`elements/bg-card.png\` — full bleed background |
| 2 | \`elements/glow-gold-top-left.png\` — top-left corner (front) |
| 3 | \`elements/logo-d-mark.png\` |
| 4 | \`elements/text-wordmark-full.png\` |
| 5 | \`elements/text-region-label.png\` — bottom |
| 6 | \`elements/line-divider-vertical.png\` — if building manually |

**Back side:** duplicate page, use \`reference/ref-back.png\` as guide or stack:
\`bg-card\` → \`text-eyebrow-services\` → \`text-tagline-it\` → \`line-divider-horizontal\` → \`text-contacts\` → \`text-location\` + \`dot-emerald\` + \`text-cta-audit\`

## Folders

| Folder | Contents |
|--------|----------|
| \`elements/\` | Separate layers for Canva |
| \`reference/\` | Full front/back mockups for alignment |

Regenerate: \`npm run export:business-card-canva\`

Source: \`content/brand/templates/canva-export.html\`
`;

  await writeFile(path.join(EXPORT_DIR, "README.md"), readme, "utf8");

  console.log(`\nDone. ${exported} files → content/brand/export/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
