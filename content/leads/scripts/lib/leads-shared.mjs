import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const XLSX = require("xlsx");

export const SOCIAL_AGGREGATOR_HOSTS = [
  "facebook.com",
  "fb.com",
  "instagram.com",
  "thefork.",
  "tripadvisor.",
  "paginegialle.",
  "sluurpy.",
  "google.com/maps",
  "maps.google.",
  "linktr.ee",
  "wa.me",
  "whatsapp.com",
  "tiktok.com",
  "youtube.com",
  "yelp.",
  "justeat.",
  "deliveroo.",
  "glovo.",
  "ubereats.",
];

export const RESTAURANT_KEYWORDS = [
  "restaurant",
  "ristorante",
  "pizzeria",
  "trattoria",
  "osteria",
  "agriturismo",
  "steakhouse",
  "sushi",
  "pizza",
  "seafood",
  "pesce",
  "grill",
  "bistro",
  "locanda",
  "taverna",
  "enoteca",
  "braceria",
  "food",
];

export const COMUNI_RN = [
  "Bellaria-Igea Marina",
  "Santarcangelo di Romagna",
  "Misano Adriatico",
  "Morciano di Romagna",
  "San Giovanni in Marignano",
  "San Mauro Pascoli",
  "Verucchio",
  "Gemmano",
  "Montefiore Conca",
  "Montegridolfo",
  "Montescudo-Monte Colombo",
  "Saludecio",
  "Torriana",
  "Riccione",
  "Cattolica",
  "Gabicce Mare",
  "Coriano",
  "Novafeltria",
  "San Leo",
  "Mondaino",
  "Rimini",
];

export const EXPORT_HEADERS = [
  "N",
  "Nome",
  "Indirizzo",
  "Telefono",
  "Email",
  "Google Maps",
  "Rating",
  "Recensioni",
  "Instagram",
  "Facebook",
  "Comune",
  "Note",
];

export const SCRAPED_CSV_HEADERS = [
  "name",
  "address",
  "phone",
  "email",
  "maps_url",
  "rating",
  "review_count",
  "website",
  "category",
  "facebook",
  "instagram",
  "city",
  "place_id",
];

export function hostFromUrl(raw) {
  if (!raw) return "";
  try {
    const withProto = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    return new URL(withProto).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return raw.toLowerCase().replace(/^www\./, "").split("/")[0];
  }
}

export function isSocialOrAggregator(url) {
  if (!url) return false;
  const host = hostFromUrl(url);
  const lower = url.toLowerCase();
  return SOCIAL_AGGREGATOR_HOSTS.some(
    (pattern) => host.includes(pattern.replace(/\.$/, "")) || lower.includes(pattern),
  );
}

export function classifyWebsiteStatus(website) {
  const value = (website ?? "").trim();
  if (!value) return { include: true, note: "no website" };
  if (isSocialOrAggregator(value)) return { include: true, note: "solo social" };
  return { include: false, note: "has website" };
}

export function isRestaurantCategory(category, name = "") {
  const cat = (category ?? "").trim();
  const nm = (name ?? "").toLowerCase();

  if (!cat) {
    return RESTAURANT_KEYWORDS.some((kw) => nm.includes(kw)) || /restaurant|ristorante|pizzeria|trattoria|osteria/i.test(nm);
  }

  const lower = cat.toLowerCase();
  if (RESTAURANT_KEYWORDS.some((kw) => lower.includes(kw))) return true;

  // Google Maps RU/UA labels when locale is not IT
  if (/ресторан|пицер|траттор|кафе|барbecue|гриль|суши|бistro|bistro|steakhouse/i.test(cat)) {
    return true;
  }

  return RESTAURANT_KEYWORDS.some((kw) => nm.includes(kw));
}

export function extractComune(address, city = "") {
  if (city.trim()) return city.trim();
  if (!address) return "";
  const sorted = [...COMUNI_RN].sort((a, b) => b.length - a.length);
  for (const comune of sorted) {
    if (address.toLowerCase().includes(comune.toLowerCase())) {
      return comune;
    }
  }
  const rnMatch = address.match(/,\s*(\d{5})\s+([^,(]+)\s*\(RN\)/i);
  if (rnMatch) return rnMatch[2].trim();
  const parts = address.split(",").map((p) => p.trim());
  for (let i = parts.length - 1; i >= 0; i -= 1) {
    if (/\(RN\)/i.test(parts[i]) || /\d{5}/.test(parts[i])) {
      const parsed = parts[i].replace(/\(RN\)/gi, "").replace(/\d{5}/g, "").trim();
      if (parsed) return parsed;
    }
  }
  return "";
}

export function dedupeKey(row) {
  if (row.placeId) return `id:${row.placeId.toLowerCase()}`;
  const name = (row.name ?? "").toLowerCase().replace(/\s+/g, " ").trim();
  const addr = (row.address ?? "").toLowerCase().replace(/\s+/g, " ").trim();
  return `na:${name}|${addr}`;
}

export function applyVariantBFilter(rows) {
  const merged = [];
  const seen = new Set();
  let excludedWebsite = 0;
  let excludedCategory = 0;
  let excludedEmptyName = 0;

  for (const row of rows) {
    if (!(row.name ?? "").trim()) {
      excludedEmptyName += 1;
      continue;
    }
    if (!isRestaurantCategory(row.category, row.name)) {
      excludedCategory += 1;
      continue;
    }

    const { include, note } = classifyWebsiteStatus(row.website);
    if (!include) {
      excludedWebsite += 1;
      continue;
    }

    const key = dedupeKey(row);
    if (seen.has(key)) continue;
    seen.add(key);

    merged.push({
      ...row,
      comune: row.city || extractComune(row.address, row.city),
      note,
    });
  }

  return { merged, excludedWebsite, excludedCategory, excludedEmptyName };
}

export function buildExportRows(limited) {
  const rows = [EXPORT_HEADERS];
  limited.forEach((row, idx) => {
    rows.push([
      idx + 1,
      row.name,
      row.address,
      row.phone,
      row.email,
      row.mapsUrl,
      row.rating,
      row.reviews,
      row.instagram,
      row.facebook,
      row.comune,
      row.note,
    ]);
  });
  return rows;
}

export function writeExcel(outputPath, rows) {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(rows);

  worksheet["!cols"] = [
    { wch: 4 },
    { wch: 34 },
    { wch: 48 },
    { wch: 18 },
    { wch: 28 },
    { wch: 52 },
    { wch: 8 },
    { wch: 10 },
    { wch: 36 },
    { wch: 36 },
    { wch: 22 },
    { wch: 14 },
  ];

  XLSX.utils.book_append_sheet(workbook, worksheet, "Ristoranti");
  XLSX.writeFile(workbook, outputPath);
}

export function escapeCsv(value) {
  const str = String(value ?? "");
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function toCsvLine(cells) {
  return cells.map(escapeCsv).join(",");
}

export function rowsToCsvString(headers, dataRows) {
  const lines = [toCsvLine(headers)];
  for (const row of dataRows) {
    lines.push(toCsvLine(row));
  }
  return `\uFEFF${lines.join("\r\n")}\r\n`;
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
