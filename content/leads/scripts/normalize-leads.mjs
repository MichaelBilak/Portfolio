/**
 * Normalize Google Maps CSV → filtered Excel file.
 * Variant B: restaurants without their own website (social/aggregators OK).
 *
 * Usage:
 *   npm run export:rimini-leads
 *   node content/leads/scripts/normalize-leads.mjs --input path/to/file.csv --limit 200
 */
import { readdir, readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  applyVariantBFilter,
  buildExportRows,
  toCsvLine,
  writeExcel,
} from "./lib/leads-shared.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../../..");
const IMPORT_DIR = path.join(ROOT, "content/leads/import");
const EXPORT_DIR = path.join(ROOT, "content/leads/export");
const DEFAULT_OUTPUT = path.join(EXPORT_DIR, "rimini-no-website-200.xlsx");

const COLUMN_ALIASES = {
  name: ["name", "title", "business_name", "company", "company name", "nome"],
  address: [
    "address",
    "full_address",
    "full address",
    "street",
    "location",
    "indirizzo",
  ],
  phone: ["phone", "phone_number", "telephone", "telefono", "formatted_phone"],
  email: ["email", "email_1", "e-mail", "contact_email"],
  mapsUrl: [
    "maps_url",
    "google_maps_url",
    "google_maps_link",
    "place_url",
  ],
  website: ["website", "site", "web", "domain", "website_url"],
  rating: ["rating", "rating_scores", "stars", "average_rating", "star_count"],
  reviews: [
    "review_count",
    "reviews",
    "review count",
    "total_reviews",
    "reviews_count",
    "rating_count",
  ],
  category: [
    "category",
    "categories",
    "type",
    "business_type",
    "subtypes",
    "category_name",
    "primary_category_name",
  ],
  facebook: [
    "facebook",
    "facebook_profile",
    "facebook url",
    "facebook page",
    "facebook profile",
  ],
  instagram: [
    "instagram",
    "instagram_handle",
    "instagram url",
    "instagram profile",
    "instagram handle",
  ],
  placeId: ["place_id", "placeid", "google_place_id"],
  lat: ["lat", "latitude"],
  lng: ["lng", "lon", "longitude"],
  city: ["city", "comune", "town"],
};

function parseArgs(argv) {
  const args = { limit: 200, input: null, output: DEFAULT_OUTPUT };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--limit" && argv[i + 1]) {
      args.limit = Number.parseInt(argv[++i], 10);
    } else if (arg === "--input" && argv[i + 1]) {
      args.input = path.resolve(argv[++i]);
    } else if (arg === "--output" && argv[i + 1]) {
      args.output = path.resolve(argv[++i]);
    } else if (arg === "--help" || arg === "-h") {
      console.log(
        "Usage: node normalize-leads.mjs [--input file.csv] [--limit 200] [--output path.xlsx]",
      );
      process.exit(0);
    }
  }
  return args;
}

function parseCsv(text) {
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

    if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
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

  return rows.filter((r) => r.some((cell) => cell.trim() !== ""));
}

function normalizeHeader(h) {
  return h.replace(/^\uFEFF/, "").trim().toLowerCase();
}

function isGoogleMapsUrl(url) {
  const lower = url.toLowerCase();
  return (
    lower.includes("google.com/maps") ||
    lower.includes("maps.google.") ||
    lower.includes("goo.gl/maps")
  );
}

function resolveGenericUrlColumn(headers, values, indexByAlias) {
  const urlIdx = headers.indexOf("url");
  if (urlIdx < 0) return {};

  const urlVal = (values[urlIdx] ?? "").trim();
  if (!urlVal) return {};

  if (isGoogleMapsUrl(urlVal)) {
    return indexByAlias.mapsUrl === undefined ? { mapsUrl: urlVal } : {};
  }

  return indexByAlias.website === undefined ? { website: urlVal } : {};
}

function buildMapsUrl({ mapsUrl, lat, lng, name, address }) {
  if (mapsUrl) return mapsUrl;
  if (lat && lng) {
    return `https://www.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}`;
  }
  if (name && address) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name}, ${address}`)}`;
  }
  return "";
}

function mapRow(headers, values) {
  const indexByAlias = {};
  for (const [key, aliases] of Object.entries(COLUMN_ALIASES)) {
    for (let i = 0; i < headers.length; i += 1) {
      const h = headers[i];
      if (aliases.includes(h)) {
        indexByAlias[key] = i;
        break;
      }
    }
  }

  const get = (key) => {
    const idx = indexByAlias[key];
    if (idx === undefined) return "";
    return (values[idx] ?? "").trim();
  };

  const row = {
    name: get("name"),
    address: get("address"),
    phone: get("phone"),
    email: get("email"),
    mapsUrl: get("mapsUrl"),
    website: get("website"),
    rating: get("rating"),
    reviews: get("reviews"),
    category: get("category"),
    facebook: get("facebook"),
    instagram: get("instagram"),
    placeId: get("placeId"),
    lat: get("lat"),
    lng: get("lng"),
    city: get("city"),
    ...resolveGenericUrlColumn(headers, values, indexByAlias),
  };

  row.mapsUrl = buildMapsUrl(row);
  return row;
}

async function resolveInputFiles(inputArg) {
  if (inputArg) {
    return [inputArg];
  }

  let entries;
  try {
    entries = await readdir(IMPORT_DIR);
  } catch {
    entries = [];
  }

  const latest = path.join(IMPORT_DIR, "scraped-google-maps-latest.csv");
  if (entries.includes("scraped-google-maps-latest.csv")) {
    return [latest];
  }

  const files = entries
    .filter(
      (f) =>
        f.toLowerCase().endsWith(".csv") &&
        !f.toLowerCase().includes("sample-data"),
    )
    .map((f) => path.join(IMPORT_DIR, f));

  if (files.length === 0) {
    return [path.join(__dirname, "fixtures/sample-rimini.csv")];
  }

  return files.sort();
}

async function loadRowsFromFile(filePath) {
  const raw = await readFile(filePath, "utf8");
  const table = parseCsv(raw);
  if (table.length < 2) return { filePath, rows: [] };

  const headers = table[0].map(normalizeHeader);
  const rows = table.slice(1).map((cells) => mapRow(headers, cells));
  return { filePath, rows };
}

async function main() {
  const args = parseArgs(process.argv);
  const inputFiles = await resolveInputFiles(args.input);

  console.log("Rimini leads · variant B (no own website)\n");

  let totalInput = 0;
  let excludedWebsite = 0;
  let excludedCategory = 0;
  let excludedEmptyName = 0;
  const merged = [];

  for (const filePath of inputFiles) {
    const { rows } = await loadRowsFromFile(filePath);
    console.log(`  Input: ${path.relative(ROOT, filePath)} (${rows.length} rows)`);
    totalInput += rows.length;

    const filtered = applyVariantBFilter(rows);
    excludedWebsite += filtered.excludedWebsite;
    excludedCategory += filtered.excludedCategory;
    excludedEmptyName += filtered.excludedEmptyName;

    const seen = new Set(merged.map((r) => `${r.name}|${r.address}`));
    for (const row of filtered.merged) {
      const key = `${row.name}|${row.address}`;
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(row);
    }
  }

  const limited = merged.slice(0, args.limit);
  const exportRows = buildExportRows(limited);

  await mkdir(EXPORT_DIR, { recursive: true });

  if (args.output.toLowerCase().endsWith(".csv")) {
    const lines = exportRows.map((row) => toCsvLine(row));
    await writeFile(args.output, `\uFEFF${lines.join("\r\n")}\r\n`, "utf8");
  } else {
    const xlsxPath = args.output.toLowerCase().endsWith(".xlsx")
      ? args.output
      : `${args.output.replace(/\.[^.]+$/, "")}.xlsx`;
    writeExcel(xlsxPath, exportRows);
    args.output = xlsxPath;
  }

  const withEmail = limited.filter((r) => r.email).length;
  const withPhone = limited.filter((r) => r.phone).length;
  const withMaps = limited.filter((r) => r.mapsUrl).length;

  const comuneCounts = {};
  for (const row of limited) {
    const c = row.comune || "(unknown)";
    comuneCounts[c] = (comuneCounts[c] || 0) + 1;
  }
  const topComuni = Object.entries(comuneCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  console.log("\n--- Summary ---");
  console.log(`  Total input rows:        ${totalInput}`);
  console.log(`  Excluded (has website):  ${excludedWebsite}`);
  console.log(`  Excluded (category):     ${excludedCategory}`);
  console.log(`  Excluded (empty name):   ${excludedEmptyName}`);
  console.log(`  After filter + dedup:    ${merged.length}`);
  console.log(`  Exported (limit ${args.limit}):     ${limited.length}`);
  console.log(`  With email:              ${withEmail}`);
  console.log(`  With phone:              ${withPhone}`);
  console.log(`  With Google Maps URL:    ${withMaps}`);

  if (topComuni.length) {
    console.log("\n  Top comuni:");
    for (const [comune, count] of topComuni) {
      console.log(`    ${comune}: ${count}`);
    }
  }

  console.log(`\n  Output: ${path.relative(ROOT, args.output)}`);

  if (limited.length < args.limit) {
    console.log(
      `\n  Warning: only ${limited.length} records exported (target ${args.limit}).`,
    );
    console.log("  Run npm run scrape:rimini-leads to collect more from Google Maps.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
