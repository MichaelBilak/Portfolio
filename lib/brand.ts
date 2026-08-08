/** Single source of truth for brand naming and site URL. */
export const BRAND_NAME = "DormUp Studio";
export const BRAND_TAGLINE = "digital studio";
export const BRAND_FULL = `${BRAND_NAME} ${BRAND_TAGLINE}`;

/** Primary domain (matches Vercel www redirect). */
export const SITE_URL = "https://www.dormup-it.com";

/** Official Instagram profile. */
export const INSTAGRAM_URL = "https://www.instagram.com/dormup.studio/";

/** Link-in-bio target (Italian default locale + audit intent). */
export const INSTAGRAM_BIO_LINK =
  "https://www.dormup-it.com/it/contact?intent=audit&utm_source=instagram&utm_medium=social";

export function pageTitle(segment: string): string {
  return `${segment} · ${BRAND_NAME}`;
}
