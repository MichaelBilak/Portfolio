/** Stable hash for CMS conflict checks. Same input always yields the same hash. */

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`).join(",")}}`;
}

export function hashValue(value: unknown): string {
  const input = stableStringify(value);
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function emptyToNull(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const text = String(value).trim();
  return text ? text : null;
}

/** Fields the content sync is allowed to update on service_i18n. */
export function serviceI18nPayload(row: {
  title?: unknown;
  description?: unknown;
  details?: unknown;
  what_you_get?: unknown;
  portfolio_url?: unknown;
  portfolio_link_label?: unknown;
  portfolio_url_2?: unknown;
  portfolio_link_label_2?: unknown;
  pricing_section_title?: unknown;
  pricing_footnote?: unknown;
}) {
  const whatYouGet = Array.isArray(row.what_you_get)
    ? row.what_you_get.map((item) => String(item))
    : [];
  return {
    title: String(row.title ?? ""),
    description: String(row.description ?? ""),
    details: String(row.details ?? ""),
    what_you_get: whatYouGet,
    portfolio_url: emptyToNull(row.portfolio_url),
    portfolio_link_label: emptyToNull(row.portfolio_link_label),
    portfolio_url_2: emptyToNull(row.portfolio_url_2),
    portfolio_link_label_2: emptyToNull(row.portfolio_link_label_2),
    pricing_section_title: emptyToNull(row.pricing_section_title),
    pricing_footnote: emptyToNull(row.pricing_footnote),
  };
}

export function serviceI18nHash(row: Parameters<typeof serviceI18nPayload>[0]): string {
  return hashValue(serviceI18nPayload(row));
}

export function tierCopyHash(row: { name?: unknown; detail?: unknown }): string {
  return hashValue({
    name: String(row.name ?? ""),
    detail: String(row.detail ?? ""),
  });
}

export function sectionHash(data: unknown): string {
  return hashValue(data ?? null);
}
