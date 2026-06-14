/** Single source of truth for brand naming and site URL. */
export const BRAND_NAME = "DormUp Group";
export const BRAND_TAGLINE = "digital studio";
export const BRAND_FULL = `${BRAND_NAME} ${BRAND_TAGLINE}`;

export const SITE_URL = "https://dormup-it.com";

export function pageTitle(segment: string): string {
  return `${segment} · ${BRAND_NAME}`;
}
