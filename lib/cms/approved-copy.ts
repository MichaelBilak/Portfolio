import { sectionHash, serviceI18nHash, serviceI18nPayload } from "@/lib/cms/content-hash";
import { translations, type Locale, type LocalizedService } from "@/lib/translations";

const warned = new Set<string>();

function warnOnce(key: string) {
  if (warned.has(key)) return;
  warned.add(key);
  console.warn(
    `[cms] ${key} does not match the approved release copy. The public page keeps the static copy.`,
  );
}

/** Payload the release sync is allowed to write for one site_copy section. */
export function approvedSectionData(locale: Locale, section: string): unknown {
  const t = translations[locale];
  if (section === "pricingAddons") {
    return {
      eyebrow: t.pricingAddons.eyebrow,
      title: t.pricingAddons.title,
      subtitle: t.pricingAddons.subtitle,
      footnote: t.pricingAddons.footnote,
    };
  }
  return (t as unknown as Record<string, unknown>)[section];
}

export function approvedServicePayload(copy: LocalizedService) {
  return serviceI18nPayload({
    title: copy.title,
    description: copy.description,
    details: copy.details,
    what_you_get: copy.whatYouGet,
    portfolio_url: copy.portfolioUrl,
    portfolio_link_label: copy.portfolioLinkLabel,
    portfolio_url_2: copy.portfolioUrl2,
    portfolio_link_label_2: copy.portfolioLinkLabel2,
    pricing_section_title: copy.pricingSectionTitle,
    pricing_footnote: copy.pricingFootnote,
  });
}

/**
 * CMS may be shown only when it is exactly the approved release copy.
 * The pre-migration snapshot and any unexpected edit, including a small
 * change on top of the old text, stay off the public page.
 */
export function acceptSiteSection(locale: string, section: string, data: unknown): boolean {
  if (data === undefined || data === null) return false;
  const approved = sectionHash(approvedSectionData(locale as Locale, section));
  if (sectionHash(data) === approved) return true;
  warnOnce(`site_copy ${locale}/${section}`);
  return false;
}

export function acceptServiceCopy(
  locale: string,
  serviceId: string,
  row: Parameters<typeof serviceI18nPayload>[0],
): boolean {
  const copy = translations[locale as Locale]?.services.find((service) => service.id === serviceId);
  if (!copy) return false;
  if (serviceI18nHash(row) === serviceI18nHash(approvedServicePayload(copy))) return true;
  warnOnce(`service_i18n ${serviceId}/${locale}`);
  return false;
}
