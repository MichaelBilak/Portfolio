import type { Locale, LocalizedProject, LocalizedService, TranslationSet } from "@/lib/translations";
import { translations } from "@/lib/translations";
import { projectsMeta, type ProjectMeta } from "@/data/projects";
import { servicesMeta, type ServiceMeta } from "@/data/services";
import {
  ADDON_CATEGORIES,
  SERVICE_BASE_PRICES,
  SERVICE_MONTHLY,
  SERVICE_TIERS,
  type AddonCategoryConfig,
  type ServiceId,
} from "@/data/pricing";
import { getPayloadClient } from "@/lib/payload";

export type CmsProject = ProjectMeta & {
  featured?: boolean;
  localized?: LocalizedProject;
};

export type CmsServiceMeta = Omit<ServiceMeta, "icon"> & {
  iconName: string;
  basePrice: number;
  isMonthly: boolean;
};

async function safePayload() {
  try {
    return await getPayloadClient();
  } catch (err) {
    console.warn("[cms] Payload unavailable, using static fallback:", err);
    return null;
  }
}

function mediaUrl(doc: { url?: string | null } | number | null | undefined, fallback: string) {
  if (!doc || typeof doc === "number") return fallback;
  return doc.url || fallback;
}

export async function getProjects(locale: Locale = "it"): Promise<CmsProject[]> {
  const payload = await safePayload();
  if (!payload) {
    return projectsMeta.map((p) => ({
      ...p,
      featured: true,
      localized: translations[locale].projects.find((x) => x.id === p.id),
    }));
  }

  try {
    const result = await payload.find({
      collection: "projects",
      locale,
      where: { published: { equals: true } },
      sort: "sortOrder",
      limit: 100,
      depth: 1,
      overrideAccess: true,
    });

    if (!result.docs.length) {
      return projectsMeta.map((p) => ({
        ...p,
        featured: true,
        localized: translations[locale].projects.find((x) => x.id === p.id),
      }));
    }

    return result.docs.map((doc) => ({
      id: String(doc.projectId),
      slug: String(doc.slug),
      index: String(doc.index),
      tag: String(doc.tag),
      image: mediaUrl(
        doc.image as { url?: string } | null,
        String(doc.imagePath || `/images/project-${doc.projectId}.png`),
      ),
      imagePosition: (doc.imagePosition as "top" | "center" | undefined) ?? "top",
      tech: ((doc.tech as { label?: string }[] | null) || []).map(
        (row: { label?: string }) => String(row.label),
      ),
      url: String(doc.url),
      displayUrl: String(doc.displayUrl),
      isLive: Boolean(doc.isLive),
      featured: doc.featured !== false,
      localized: {
        id: String(doc.projectId),
        name: String(doc.name),
        nameTagline: doc.nameTagline ? String(doc.nameTagline) : undefined,
        subtitle: String(doc.subtitle),
        problem: String(doc.problem),
        solution: String(doc.solution),
        businessImpact: String(doc.businessImpact),
      },
    }));
  } catch (err) {
    console.warn("[cms] getProjects failed:", err);
    return projectsMeta.map((p) => ({
      ...p,
      featured: true,
      localized: translations[locale].projects.find((x) => x.id === p.id),
    }));
  }
}

export async function getServices(locale: Locale = "it"): Promise<{
  metas: Array<{ id: string; slug: string; image: string; iconName: string }>;
  localized: LocalizedService[];
  basePrices: Record<string, number>;
  monthly: Record<string, boolean>;
}> {
  const fallback = {
    metas: servicesMeta.map((m) => ({
      id: m.id,
      slug: m.slug,
      image: m.image,
      iconName: m.icon.displayName || m.id,
    })),
    localized: translations[locale].services,
    basePrices: { ...SERVICE_BASE_PRICES } as Record<string, number>,
    monthly: { ...SERVICE_MONTHLY } as Record<string, boolean>,
  };

  // Fix icon names from known map
  const iconById: Record<string, string> = {
    "booking-flow": "CalendarCheck",
    "premium-site": "Monitor",
    redesign: "RefreshCw",
    "photo-video": "Video",
    "monthly-support": "Wrench",
  };
  fallback.metas = servicesMeta.map((m) => ({
    id: m.id,
    slug: m.slug,
    image: m.image,
    iconName: iconById[m.id] || "Monitor",
  }));

  const payload = await safePayload();
  if (!payload) return fallback;

  try {
    const result = await payload.find({
      collection: "services",
      locale,
      where: { published: { equals: true } },
      sort: "sortOrder",
      limit: 50,
      depth: 1,
      overrideAccess: true,
    });

    if (!result.docs.length) return fallback;

    const metas = result.docs.map((doc) => ({
      id: String(doc.serviceId),
      slug: String(doc.slug),
      image: mediaUrl(
        doc.image as { url?: string } | null,
        String(doc.imagePath || `/images/service-${doc.slug}.png`),
      ),
      iconName: String(doc.icon),
    }));

    const localized: LocalizedService[] = result.docs.map((doc) => ({
      id: String(doc.serviceId),
      title: String(doc.title),
      description: String(doc.description),
      details: String(doc.details || ""),
      whatYouGet: ((doc.whatYouGet as { item?: string }[] | null) || []).map(
        (w: { item?: string }) => String(w.item),
      ),
      portfolioUrl: doc.portfolioUrl ? String(doc.portfolioUrl) : undefined,
      portfolioLinkLabel: doc.portfolioLinkLabel
        ? String(doc.portfolioLinkLabel)
        : undefined,
      portfolioUrl2: doc.portfolioUrl2 ? String(doc.portfolioUrl2) : undefined,
      portfolioLinkLabel2: doc.portfolioLinkLabel2
        ? String(doc.portfolioLinkLabel2)
        : undefined,
      pricingSectionTitle: doc.pricingSectionTitle
        ? String(doc.pricingSectionTitle)
        : undefined,
      pricingFootnote: doc.pricingFootnote ? String(doc.pricingFootnote) : undefined,
      pricingTiers: ((doc.tiers as { tierId?: string; name?: string; detail?: string }[] | null) || []).map(
        (tier: { tierId?: string; name?: string; detail?: string }) => ({
          tierId: String(tier.tierId),
          name: String(tier.name),
          detail: String(tier.detail || ""),
        }),
      ),
    }));

    const basePrices: Record<string, number> = {};
    const monthly: Record<string, boolean> = {};
    for (const doc of result.docs) {
      basePrices[String(doc.serviceId)] = Number(doc.basePrice) || 0;
      if (doc.isMonthly) monthly[String(doc.serviceId)] = true;
    }

    return { metas, localized, basePrices, monthly };
  } catch (err) {
    console.warn("[cms] getServices failed:", err);
    return fallback;
  }
}

export async function getAddonCategories(locale: Locale = "it"): Promise<{
  structure: AddonCategoryConfig[];
  localized: TranslationSet["pricingAddons"]["categories"];
}> {
  const fallback = {
    structure: ADDON_CATEGORIES,
    localized: translations[locale].pricingAddons.categories,
  };

  const payload = await safePayload();
  if (!payload) return fallback;

  try {
    const result = await payload.find({
      collection: "addon-categories",
      locale,
      sort: "sortOrder",
      limit: 50,
      depth: 0,
      overrideAccess: true,
    });

    if (!result.docs.length) return fallback;

    return {
      structure: result.docs.map((doc) => ({
        id: String(doc.categoryId),
        items: ((doc.items as { enabled?: boolean; itemId?: string }[] | null) || [])
          .filter((i: { enabled?: boolean }) => i.enabled !== false)
          .map((i: { itemId?: string }) => ({ id: String(i.itemId) })),
      })),
      localized: result.docs.map((doc) => ({
        id: String(doc.categoryId),
        title: String(doc.title),
        items: ((doc.items as { enabled?: boolean; itemId?: string; label?: string; info?: string }[] | null) || [])
          .filter((i: { enabled?: boolean }) => i.enabled !== false)
          .map((i: { itemId?: string; label?: string; info?: string }) => ({
            id: String(i.itemId),
            label: String(i.label),
            info: String(i.info || ""),
          })),
      })),
    };
  } catch (err) {
    console.warn("[cms] getAddonCategories failed:", err);
    return fallback;
  }
}

/** Merge CMS catalog + site-copy overlays into the static TranslationSet. */
export async function getSiteContent(locale: Locale): Promise<{
  t: TranslationSet;
  projects: CmsProject[];
  serviceMetas: Array<{ id: string; slug: string; image: string; iconName: string }>;
  addonStructure: AddonCategoryConfig[];
  basePrices: Record<string, number>;
}> {
  const base = translations[locale];
  const [projects, services, addons, siteCopy] = await Promise.all([
    getProjects(locale),
    getServices(locale),
    getAddonCategories(locale),
    getSiteCopyOverlay(locale),
  ]);

  const projectLocalized =
    projects.map((p) => p.localized).filter(Boolean) as LocalizedProject[];

  const t: TranslationSet = {
    ...base,
    ...siteCopy,
    projects: projectLocalized.length ? projectLocalized : base.projects,
    services: services.localized.length ? services.localized : base.services,
    pricingAddons: {
      ...base.pricingAddons,
      ...(siteCopy.pricingAddons || {}),
      categories: addons.localized.length
        ? addons.localized
        : base.pricingAddons.categories,
    },
  };

  return {
    t,
    projects,
    serviceMetas: services.metas,
    addonStructure: addons.structure,
    basePrices: services.basePrices,
  };
}

async function getSiteCopyOverlay(locale: Locale): Promise<Partial<TranslationSet>> {
  const payload = await safePayload();
  if (!payload) return {};

  try {
    const doc = await payload.findGlobal({
      slug: "site-copy",
      locale,
      overrideAccess: true,
    });

    if (!doc || typeof doc !== "object") return {};

    const overlay: Partial<TranslationSet> = {};

    if (doc.nav && typeof doc.nav === "object") {
      overlay.nav = { ...translations[locale].nav, ...(doc.nav as object) } as TranslationSet["nav"];
    }
    if (doc.hero && typeof doc.hero === "object") {
      overlay.hero = { ...translations[locale].hero, ...(doc.hero as object) } as TranslationSet["hero"];
    }
    if (Array.isArray(doc.trust) && doc.trust.length) {
      overlay.trust = doc.trust.map((x: { item?: string }) => String(x.item || ""));
    }
    if (doc.servicesLabel) overlay.servicesLabel = String(doc.servicesLabel);
    if (doc.servicesLead) overlay.servicesLead = String(doc.servicesLead);
    if (doc.about && typeof doc.about === "object") {
      const about = doc.about as {
        eyebrow?: string;
        title?: string;
        bio?: string;
        pills?: { item?: string }[];
      };
      overlay.about = {
        ...translations[locale].about,
        ...about,
        pills: about.pills?.map((p) => String(p.item || "")) ?? translations[locale].about.pills,
      };
    }
    if (doc.footer && typeof doc.footer === "object") {
      overlay.footer = {
        ...translations[locale].footer,
        ...(doc.footer as object),
      } as TranslationSet["footer"];
    }
    if (doc.audit && typeof doc.audit === "object") {
      overlay.audit = {
        ...translations[locale].audit,
        ...(doc.audit as object),
      } as TranslationSet["audit"];
    }
    if (doc.orderPage && typeof doc.orderPage === "object") {
      overlay.orderPage = {
        ...translations[locale].orderPage,
        ...(doc.orderPage as object),
      } as TranslationSet["orderPage"];
    }
    if (doc.pricingAddons && typeof doc.pricingAddons === "object") {
      overlay.pricingAddons = {
        ...translations[locale].pricingAddons,
        ...(doc.pricingAddons as object),
      } as TranslationSet["pricingAddons"];
    }
    if (doc.workPage && typeof doc.workPage === "object") {
      overlay.workPage = {
        ...translations[locale].workPage,
        ...(doc.workPage as object),
      } as TranslationSet["workPage"];
    }
    if (doc.servicesPage && typeof doc.servicesPage === "object") {
      overlay.servicesPage = {
        ...translations[locale].servicesPage,
        ...(doc.servicesPage as object),
      } as TranslationSet["servicesPage"];
    }
    if (doc.servicePage && typeof doc.servicePage === "object") {
      overlay.servicePage = {
        ...translations[locale].servicePage,
        ...(doc.servicePage as object),
      } as TranslationSet["servicePage"];
    }
    if (doc.privacyPage && typeof doc.privacyPage === "object") {
      const privacy = doc.privacyPage as {
        title?: string;
        lastUpdated?: string;
        backToHome?: string;
        sections?: { heading?: string; body?: string }[];
      };
      overlay.privacyPage = {
        ...translations[locale].privacyPage,
        ...privacy,
        sections:
          privacy.sections?.map((s) => ({
            heading: String(s.heading || ""),
            body: String(s.body || ""),
          })) ?? translations[locale].privacyPage.sections,
      };
    }

    return overlay;
  } catch {
    return {};
  }
}

export function getStaticTierPrice(serviceId: ServiceId, tierId: string): number | undefined {
  return SERVICE_TIERS[serviceId]?.find((t) => t.tierId === tierId)?.price;
}
