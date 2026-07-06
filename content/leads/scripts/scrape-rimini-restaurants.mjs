/**
 * Scrape Google Maps for restaurants in provincia Rimini (variant B target).
 *
 * Usage:
 *   npm run scrape:rimini-restaurants
 *   node content/leads/scripts/scrape-rimini-restaurants.mjs --limit 200 --resume
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import {
  applyVariantBFilter,
  classifyWebsiteStatus,
  rowsToCsvString,
  SCRAPED_CSV_HEADERS,
  sleep,
} from "./lib/leads-shared.mjs";

const require = createRequire(import.meta.url);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../../..");
const IMPORT_DIR = path.join(ROOT, "content/leads/import");
const LATEST_CSV = path.join(IMPORT_DIR, "scraped-google-maps-latest.csv");

const SEARCHES = [
  { comune: "Rimini", query: "ristorante" },
  { comune: "Rimini", query: "pizzeria" },
  { comune: "Rimini", query: "trattoria" },
  { comune: "Rimini", query: "osteria" },
  { comune: "Riccione", query: "ristorante" },
  { comune: "Riccione", query: "pizzeria" },
  { comune: "Cattolica", query: "ristorante" },
  { comune: "Cattolica", query: "pizzeria" },
  { comune: "Bellaria-Igea Marina", query: "ristorante" },
  { comune: "Bellaria-Igea Marina", query: "pizzeria" },
  { comune: "Misano Adriatico", query: "ristorante" },
  { comune: "Misano Adriatico", query: "pizzeria" },
  { comune: "Santarcangelo di Romagna", query: "ristorante" },
  { comune: "Santarcangelo di Romagna", query: "agriturismo" },
  { comune: "Coriano", query: "ristorante" },
  { comune: "Coriano", query: "agriturismo" },
  { comune: "Verucchio", query: "ristorante" },
  { comune: "Verucchio", query: "agriturismo" },
  { comune: "Morciano di Romagna", query: "ristorante" },
  { comune: "Novafeltria", query: "ristorante" },
  { comune: "Novafeltria", query: "agriturismo" },
  { comune: "Gabicce Mare", query: "ristorante" },
  { comune: "San Giovanni in Marignano", query: "ristorante" },
];

function parseArgs(argv) {
  const args = { limit: 200, resume: false, delayMs: 2500 };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--limit" && argv[i + 1]) {
      args.limit = Number.parseInt(argv[++i], 10);
    } else if (arg === "--resume") {
      args.resume = true;
    } else if (arg === "--delay" && argv[i + 1]) {
      args.delayMs = Number.parseInt(argv[++i], 10);
    } else if (arg === "--help" || arg === "-h") {
      console.log(
        "Usage: node scrape-rimini-restaurants.mjs [--limit 200] [--resume] [--delay 2500]",
      );
      process.exit(0);
    }
  }
  return args;
}

function parseCsvLine(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];
    if (inQuotes) {
      if (ch === '"' && next === '"') {
        field += '"';
        i += 1;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        field += ch;
      }
      continue;
    }
    if (ch === '"') inQuotes = true;
    else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\r" && next === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      i += 1;
    } else if (ch === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += ch;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim()));
}

function rowToRecord(values) {
  const record = {};
  SCRAPED_CSV_HEADERS.forEach((key, idx) => {
    record[key] = values[idx] ?? "";
  });
  return {
    name: record.name,
    address: record.address,
    phone: record.phone,
    email: record.email,
    mapsUrl: record.maps_url,
    rating: record.rating,
    reviews: record.review_count,
    website: record.website,
    category: record.category,
    facebook: record.facebook,
    instagram: record.instagram,
    city: record.city,
    placeId: record.place_id,
  };
}

function recordToCsvRow(record) {
  return SCRAPED_CSV_HEADERS.map((key) => {
    if (key === "maps_url") return record.mapsUrl ?? "";
    if (key === "review_count") return record.reviews ?? "";
    if (key === "place_id") return record.placeId ?? "";
    return record[key] ?? "";
  });
}

async function loadExistingRows() {
  try {
    const raw = await readFile(LATEST_CSV, "utf8");
    const table = parseCsvLine(raw.replace(/^\uFEFF/, ""));
    if (table.length < 2) return [];
    return table.slice(1).map(rowToRecord);
  } catch {
    return [];
  }
}

async function saveRows(allRows) {
  await mkdir(IMPORT_DIR, { recursive: true });
  const dataRows = allRows.map(recordToCsvRow);
  const csv = rowsToCsvString(SCRAPED_CSV_HEADERS, dataRows);
  const date = new Date().toISOString().slice(0, 10);
  const datedPath = path.join(IMPORT_DIR, `scraped-google-maps-${date}.csv`);
  await writeFile(datedPath, csv, "utf8");
  await writeFile(LATEST_CSV, csv, "utf8");
  return datedPath;
}

function withItalianLocale(url) {
  try {
    const parsed = new URL(url);
    parsed.searchParams.set("hl", "it");
    return parsed.toString();
  } catch {
    return url.includes("?") ? `${url}&hl=it` : `${url}?hl=it`;
  }
}

function stripLabel(value) {
  return (value ?? "")
    .replace(/^(Address|Indirizzo|Адрес|Telefono|Phone|Телефон):\s*/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizePlaceUrl(url) {
  try {
    const u = new URL(url);
    return `${u.origin}${u.pathname}`;
  } catch {
    return url.split("?")[0];
  }
}

function countVariantB(rows) {
  return applyVariantBFilter(rows).merged.length;
}

async function dismissConsent(page) {
  const labels = ["Accetta tutto", "Accept all", "Accetta", "Accept"];
  for (const label of labels) {
    try {
      const clicked = await page.evaluate((text) => {
        const btn = [...document.querySelectorAll("button")].find((el) =>
          el.textContent?.trim().includes(text),
        );
        if (btn) {
          btn.click();
          return true;
        }
        return false;
      }, label);
      if (clicked) {
        await sleep(1200);
        return;
      }
    } catch {
      /* ignore */
    }
  }
}

async function scrollSearchResults(page) {
  await page.waitForSelector('div[role="feed"]', { timeout: 20000 }).catch(() => null);
  const feed = await page.$('div[role="feed"]');
  if (!feed) return 0;

  let previousCount = 0;
  let stagnant = 0;

  for (let i = 0; i < 30; i += 1) {
    await page.evaluate((el) => {
      el.scrollTop = el.scrollHeight;
    }, feed);
    await sleep(1500);

    const count = await page.evaluate(
      () => document.querySelectorAll('a[href*="/maps/place/"]').length,
    );

    if (count <= previousCount) {
      stagnant += 1;
      if (stagnant >= 4) break;
    } else {
      stagnant = 0;
    }
    previousCount = count;
  }

  return previousCount;
}

async function collectPlaceUrls(page) {
  return page.evaluate(() => {
    const urls = new Set();
    for (const anchor of document.querySelectorAll('a[href*="/maps/place/"]')) {
      urls.add(anchor.href);
    }
    return [...urls];
  });
}

async function extractPlaceDetails(page, placeUrl, cityHint) {
  await page.goto(withItalianLocale(placeUrl), { waitUntil: "domcontentloaded", timeout: 90000 });
  await sleep(2000);

  const details = await page.evaluate(() => {
    const clean = (value) => (value ?? "").replace(/\s+/g, " ").trim();
    const strip = (value) =>
      clean(value).replace(/^(Address|Indirizzo|Адрес|Phone|Telefono|Телефон):\s*/i, "");

    const aria = (selector) => {
      const el = document.querySelector(selector);
      if (!el) return "";
      const label = el.getAttribute("aria-label") || "";
      return clean(label);
    };

    const name = clean(document.querySelector("h1")?.textContent);

    let address = "";
    const addressBtn = document.querySelector('button[data-item-id="address"]');
    if (addressBtn) {
      address = strip(
        addressBtn.getAttribute("aria-label") || addressBtn.textContent || "",
      );
    }

    let phone = "";
    const phoneBtn =
      document.querySelector('button[data-item-id^="phone"]') ||
      document.querySelector('button[data-tooltip="Copy phone number"]');
    if (phoneBtn) {
      phone = strip(phoneBtn.getAttribute("aria-label") || phoneBtn.textContent || "");
    }
    if (!phone) {
      const tel = document.querySelector('a[href^="tel:"]');
      if (tel) phone = clean(tel.getAttribute("href")?.replace(/^tel:/i, ""));
    }

    let website = "";
    const webLink = document.querySelector('a[data-item-id="authority"]');
    if (webLink) website = clean(webLink.href);

    let rating = "";
    const ratingNode = document.querySelector('div.F7nice span[aria-hidden="true"]');
    if (ratingNode) rating = clean(ratingNode.textContent);

    let reviews = "";
    const reviewBtn = [...document.querySelectorAll("button")].find((btn) => {
      const label = btn.getAttribute("aria-label") || btn.textContent || "";
      return /reviews|recensioni/i.test(label);
    });
    if (reviewBtn) {
      const match = (reviewBtn.getAttribute("aria-label") || reviewBtn.textContent || "").match(
        /([\d.,]+)/,
      );
      if (match) reviews = match[1].replace(/\./g, "").replace(",", ".");
    }

    let category = "";
    const catBtn = document.querySelector('button[jsaction*="category"]');
    if (catBtn) category = clean(catBtn.textContent);

    let facebook = "";
    let instagram = "";
    for (const anchor of document.querySelectorAll("a[href]")) {
      const href = anchor.href || "";
      if (!facebook && /facebook\.com/i.test(href)) facebook = href.split("?")[0];
      if (!instagram && /instagram\.com/i.test(href)) instagram = href.split("?")[0];
    }

    let email = "";
    const bodyText = document.body?.innerText || "";
    const emailMatch = bodyText.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
    if (emailMatch) email = emailMatch[0];

    let placeId = "";
    const cidMatch = window.location.href.match(/!1s(0x[a-f0-9]+:0x[a-f0-9]+|ChIJ[\w-]+)/i);
    if (cidMatch) placeId = cidMatch[1];

    return {
      name,
      address,
      phone,
      email,
      website,
      rating,
      reviews,
      category,
      facebook,
      instagram,
      placeId,
      mapsUrl: window.location.href.split("&utm_")[0],
    };
  });

  return {
    ...details,
    city: cityHint,
  };
}

async function main() {
  const args = parseArgs(process.argv);
  let puppeteer;

  try {
    puppeteer = require("puppeteer");
  } catch {
    console.error("Puppeteer not found. Run: npm install --save-dev puppeteer");
    process.exit(1);
  }

  console.log("Google Maps scraper · provincia Rimini · variant B target\n");
  console.log(`  Target filtered leads: ${args.limit}`);
  console.log(`  Delay between places:  ${args.delayMs}ms\n`);

  let allRows = args.resume ? await loadExistingRows() : [];
  const seenUrls = new Set(allRows.map((r) => normalizePlaceUrl(r.mapsUrl)).filter(Boolean));

  if (args.resume && allRows.length) {
    console.log(`  Resumed with ${allRows.length} scraped rows (${countVariantB(allRows)} pass filter B)\n`);
  }

  if (countVariantB(allRows) >= args.limit) {
    console.log("  Target already reached. Run normalize-leads on latest CSV.");
    await saveRows(allRows);
    return;
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--lang=it-IT,it",
    ],
    defaultViewport: { width: 1400, height: 900 },
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  );
  await page.setExtraHTTPHeaders({ "Accept-Language": "it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7" });
  await page.goto("https://www.google.com/maps?hl=it", { waitUntil: "domcontentloaded", timeout: 60000 });
  await sleep(1500);
  await dismissConsent(page);

  let scrapedThisRun = 0;

  try {
    for (const search of SEARCHES) {
      if (countVariantB(allRows) >= args.limit) break;

      const query = encodeURIComponent(`${search.query} ${search.comune} RN Italy`);
      const searchUrl = `https://www.google.com/maps/search/${query}?hl=it`;
      console.log(`\n→ Search: ${search.query} · ${search.comune}`);

      await page.goto(searchUrl, { waitUntil: "domcontentloaded", timeout: 90000 });
      await sleep(2500);
      await dismissConsent(page);

      const resultCount = await scrollSearchResults(page);
      const placeUrls = await collectPlaceUrls(page);
      console.log(`  Results in feed: ~${resultCount}, place links: ${placeUrls.length}`);

      for (const placeUrl of placeUrls) {
        if (countVariantB(allRows) >= args.limit) break;

        const key = normalizePlaceUrl(placeUrl);
        if (seenUrls.has(key)) continue;
        seenUrls.add(key);

        try {
          const record = await extractPlaceDetails(page, placeUrl, search.comune);
          if (!record.name) continue;

          allRows.push(record);
          scrapedThisRun += 1;

          const { include, note } = classifyWebsiteStatus(record.website);
          const marker = include ? `✓ ${note}` : "✗ has website";
          console.log(`    ${marker} · ${record.name}`);

          if (scrapedThisRun % 5 === 0) {
            await saveRows(allRows);
            console.log(
              `    … saved ${allRows.length} rows (${countVariantB(allRows)} pass filter B)`,
            );
          }
        } catch (err) {
          console.log(`    ! failed: ${key} (${err.message})`);
        }

        await sleep(args.delayMs);
      }
    }
  } finally {
    await browser.close();
  }

  const datedPath = await saveRows(allRows);
  const filtered = countVariantB(allRows);

  console.log("\n--- Scrape summary ---");
  console.log(`  Total scraped rows:      ${allRows.length}`);
  console.log(`  Pass variant B filter:   ${filtered}`);
  console.log(`  Scraped this run:        ${scrapedThisRun}`);
  console.log(`  Latest CSV:              ${path.relative(ROOT, LATEST_CSV)}`);
  console.log(`  Dated CSV:               ${path.relative(ROOT, datedPath)}`);

  if (filtered < args.limit) {
    console.log(`\n  Warning: only ${filtered} leads match variant B (target ${args.limit}).`);
    console.log("  Re-run with --resume or add more search queries.");
  } else {
    console.log(`\n  Target reached. Run: npm run export:rimini-leads`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
