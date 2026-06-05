/* One-off: convert black-background gem PNGs to luminance-based transparency.
   Run: node scripts/gem-alpha.js  */
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const dir = path.join(process.cwd(), "public", "images");
const files = [
  "service-premium-website.png",
  "service-redesign.png",
  "service-booking-flow.png",
  "service-monthly-support.png",
  "service-photo-video.png",
];

(async () => {
  for (const f of files) {
    const p = path.join(dir, f);
    const { data, info } = await sharp(p)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const { width, height, channels } = info;
    const out = Buffer.alloc(width * height * 4);
    for (let i = 0; i < width * height; i++) {
      const r = data[i * channels];
      const g = data[i * channels + 1];
      const b = data[i * channels + 2];
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      // Slight boost so the gem body stays solid while the black falls away.
      let a = lum * 1.3;
      if (a > 255) a = 255;
      out[i * 4] = r;
      out[i * 4 + 1] = g;
      out[i * 4 + 2] = b;
      out[i * 4 + 3] = Math.round(a);
    }
    await sharp(out, { raw: { width, height, channels: 4 } })
      .png()
      .toFile(p + ".tmp");
    fs.renameSync(p + ".tmp", p);
    console.log("done", f, width + "x" + height);
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
