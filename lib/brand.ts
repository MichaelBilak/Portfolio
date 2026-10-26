/** Single source of truth for brand naming and site URL. */
export const BRAND_NAME = "DormUp Studio";
/** Compact line next to the wordmark (keep short for layout). */
export const BRAND_TAGLINE = "Creative Studio";
/** Full commercial positioning for copy / docs / schema context. */
export const BRAND_POSITIONING = "Digital Growth & Creative Studio";
export const BRAND_FULL = `${BRAND_NAME} — ${BRAND_POSITIONING}`;

/** Primary domain (matches Vercel www redirect). */
export const SITE_URL = "https://www.dormup-it.com";

/** Official Instagram profile. */
export const INSTAGRAM_URL = "https://www.instagram.com/dormup.studio/";

/** Link-in-bio target (Italian default locale, unprefixed + audit intent). */
export const INSTAGRAM_BIO_LINK =
  "https://www.dormup-it.com/contact?intent=audit&utm_source=instagram&utm_medium=social";

export function pageTitle(segment: string): string {
  return `${segment.replace(/\s*\n\s*/g, " ")} | ${BRAND_NAME}`;
}
