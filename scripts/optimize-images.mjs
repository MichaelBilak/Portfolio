/**
 * Resize and compress raster assets in public/images.
 * Run: npm run optimize:images
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.join(__dirname, "..", "public", "images");

/** @type {{ file: string; maxWidth: number; quality?: number }[]} */
const targets = [
  { file: "site-restaurant.png", maxWidth: 900 },
  { file: "site-hotel.png", maxWidth: 900 },
  { file: "site-bar.png", maxWidth: 900 },
  { file: "site-cafe.png", maxWidth: 900 },
  { file: "service-premium-website.png", maxWidth: 512 },
  { file: "service-redesign.png", maxWidth: 512 },
  { file: "service-booking-flow.png", maxWidth: 512 },
  { file: "service-monthly-support.png", maxWidth: 512 },
  { file: "service-photo-video.png", maxWidth: 512 },
  { file: "project-porto-sole.png", maxWidth: 1200 },
  { file: "project-hotel-aurelia.png", maxWidth: 1200 },
  { file: "project-podlopuhom.png", maxWidth: 1200 },
  { file: "project-solovyev.png", maxWidth: 1200 },
  { file: "project-mare-vivo.png", maxWidth: 1200 },
  { file: "logo-d-letter.png", maxWidth: 256 },
  { file: "logo-dm-group.png", maxWidth: 512 },
  { file: "question.png", maxWidth: 640 },
];

const unused = [
  "hero-bg-food.png",
  "hero-bg-bar.png",
  "hero-bg-hotel.png",
  "hero-bg-restaurant.png",
  "logo-dm-group-glow.gif",
];

function formatKb(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

async function optimizeOne({ file, maxWidth, quality = 82 }) {
  const input = path.join(imagesDir, file);
  if (!fs.existsSync(input)) {
    console.warn(`skip (missing): ${file}`);
    return;
  }

  const before = fs.statSync(input).size;
  const image = sharp(input);
  const meta = await image.metadata();
  const width = meta.width ?? maxWidth;
  const pipeline = width > maxWidth ? image.resize({ width: maxWidth, withoutEnlargement: true }) : image;

  const buffer = await pipeline
    .png({ compressionLevel: 9, palette: true, quality, effort: 10 })
    .toBuffer();

  fs.writeFileSync(input, buffer);
  const after = buffer.length;
  console.log(`${file}: ${formatKb(before)} → ${formatKb(after)}`);
}

async function main() {
  console.log("Optimizing images…\n");
  for (const target of targets) {
    await optimizeOne(target);
  }

  console.log("\nRemoving unused assets…");
  for (const file of unused) {
    const full = path.join(imagesDir, file);
    if (fs.existsSync(full)) {
      const size = fs.statSync(full).size;
      fs.unlinkSync(full);
      console.log(`deleted ${file} (${formatKb(size)})`);
    }
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
