export const CONTACT_EMAIL = "dormup.it@gmail.com";

export function contactMailtoHref(): string {
  return `mailto:${CONTACT_EMAIL}`;
}

/** Opens the default mail client — used as a click fallback on mobile webviews. */
export function openContactEmail(): void {
  if (typeof window === "undefined") return;
  window.location.href = contactMailtoHref();
}
