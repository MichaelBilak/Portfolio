/**
 * Export Instagram story frames from stories-export.html to PNG.
 * Usage: npm run export:instagram-stories
 */
import { createServer } from "node:http";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../../..");
const TEMPLATES_DIR = path.join(ROOT, "content/instagram/templates");
const EXPORT_DIR = path.join(ROOT, "content/instagram/export");
const PORT = 4567;

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
        const rel = urlPath === "/" ? "/content/instagram/templates/stories-export.html" : urlPath;
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
      "Puppeteer not found. Install once:\n  npm install --save-dev puppeteer\nThen run again:\n  npm run export:instagram-stories"
    );
    process.exit(1);
  }

  const server = await startStaticServer();
  const pageUrl = `http://127.0.0.1:${PORT}/content/instagram/templates/stories-export.html`;

  console.log("Starting export…");
  console.log(`Page: ${pageUrl}`);

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900, deviceScaleFactor: 1 });
  await page.goto(pageUrl, { waitUntil: "networkidle0", timeout: 60000 });
  await page.evaluateHandle("document.fonts.ready");
  await new Promise((r) => setTimeout(r, 1500));

  const frames = await page.$$("[data-export]");
  console.log(`Found ${frames.length} frames`);

  let exported = 0;
  for (const frame of frames) {
    const exportId = await frame.evaluate((el) => el.getAttribute("data-export"));
    if (!exportId) continue;

    const outPath = path.join(EXPORT_DIR, `${exportId}.png`);
    await mkdir(path.dirname(outPath), { recursive: true });

    await frame.screenshot({
      path: outPath,
      type: "png",
    });

    exported += 1;
    console.log(`  ✓ ${exportId}.png`);
  }

  await browser.close();
  server.close();

  const readme = `# Instagram export · @dormup.studio

Generated ${new Date().toISOString().slice(0, 10)} · ${exported} PNG files

## Folders

| Folder | Use |
|--------|-----|
| \`covers/\` | Highlight cover images (Edit highlight → Edit cover) |
| \`work/\` | Stories for **Work** highlight |
| \`services/\` | Stories for **Services** highlight |
| \`audit/\` | Stories for **Audit** highlight |
| \`process/\` | Stories for **Process** highlight |
| \`about/\` | Stories for **About** highlight |

## How to publish

1. Instagram app → **Your story** → upload PNG from phone (AirDrop / Google Drive / cable)
2. After each story → **Highlight** → add to the matching folder name
3. Set cover from \`covers/*.png\`

Regenerate: \`npm run export:instagram-stories\`
`;

  await writeFile(path.join(EXPORT_DIR, "README.md"), readme, "utf8");

  console.log(`\nDone. ${exported} files → content/instagram/export/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
