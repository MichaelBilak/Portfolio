import type { Locale, LocalizedProject, LocalizedService, TranslationSet } from "@/lib/translations";
import { translations } from "@/lib/translations";
import { projectsMeta, type ProjectMeta } from "@/data/projects";
import { servicesMeta } from "@/data/services";
import {
  ADDON_CATEGORIES,
  SERVICE_BASE_PRICES,
  SERVICE_MONTHLY,
  SERVICE_TIERS,
  type AddonCategoryConfig,
  type ServiceId,
} from "@/data/pricing";
import { processStepsMeta } from "@/data/process";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";

export type CmsProject = ProjectMeta & {
  featured?: boolean;
  localized?: LocalizedProject;
};

const SERVICE_ICON_BY_ID: Record<string, string> = {
  "booking-flow": "CalendarCheck",
  "premium-site": "Monitor",
  redesign: "RefreshCw",
  "photo-video": "Video",
  "monthly-support": "Wrench",
};

const LOCALES: Locale[] = ["it", "en", "fr", "ru", "de", "es"];

function staticProjects(locale: Locale): CmsProject[] {
  return projectsMeta.map((p) => ({
    ...p,
    featured: true,
    localized: translations[locale].projects.find((x) => x.id === p.id),
  }));
}

function staticServices(locale: Locale) {
  return {
    metas: servicesMeta.map((m) => ({
      id: m.id,
      slug: m.slug,
      image: m.image,
      iconName: SERVICE_ICON_BY_ID[m.id] || "Monitor",
    })),
    localized: translations[locale].services,
    basePrices: { ...SERVICE_BASE_PRICES } as Record<string, number>,
    monthly: { ...SERVICE_MONTHLY } as Record<string, boolean>,
  };
}

function staticAddons(locale: Locale) {
  return {
    structure: ADDON_CATEGORIES,
    localized: translations[locale].pricingAddons.categories,
  };
}

export async function getProjects(locale: Locale = "it"): Promise<CmsProject[]> {
  if (!isSupabaseConfigured()) return staticProjects(locale);

  try {
    const sb = createAdminClient();
    const { data: rows, error } = await sb
      .from("projects")
      .select("*, project_i18n(*)")
      .eq("published", true)
      .order("sort_order", { ascending: true });

    if (error || !rows?.length) return staticProjects(locale);

    const staticById = new Map(projectsMeta.map((p) => [p.id, p]));

    return rows.map((doc) => {
      const projectId = String(doc.project_id);
      const staticMeta = staticById.get(projectId);
      const i18n =
        (doc.project_i18n as Array<Record<string, unknown>> | null)?.find(
          (r) => r.locale === locale,
        ) ||
        (doc.project_i18n as Array<Record<string, unknown>> | null)?.find(
          (r) => r.locale === "it",
        );
      return {
        id: projectId,
        slug: String(doc.slug),
        index: String(doc.index_label),
        tag: String(doc.tag),
        image: String(doc.image_path || `/images/project-${doc.project_id}.png`),
        imagePosition: (doc.image_position as "top" | "center" | undefined) ?? "top",
        tech: Array.isArray(doc.tech) ? (doc.tech as string[]) : [],
        url: String(doc.url),
        displayUrl: String(doc.display_url),
        repoUrl: staticMeta?.repoUrl,
        isLive: Boolean(doc.is_live),
        featured: doc.featured !== false,
        localized: i18n
          ? {
              id: projectId,
              name: String(i18n.name || ""),
              nameTagline: i18n.name_tagline ? String(i18n.name_tagline) : undefined,
              subtitle: String(i18n.subtitle || ""),
              problem: String(i18n.problem || ""),
              solution: String(i18n.solution || ""),
              businessImpact: String(i18n.business_impact || ""),
            }
          : translations[locale].projects.find((x) => x.id === projectId),
      };
    });
  } catch (err) {
    console.warn("[cms] getProjects failed:", err);
    return staticProjects(locale);
  }
}

export async function getServices(locale: Locale = "it"): Promise<{
  metas: Array<{ id: string; slug: string; image: string; iconName: string }>;
  localized: LocalizedService[];
  basePrices: Record<string, number>;
  monthly: Record<string, boolean>;
}> {
  const fallback = staticServices(locale);
  if (!isSupabaseConfigured()) return fallback;

  try {
    const sb = createAdminClient();
    const { data: rows, error } = await sb
      .from("services")
      .select("*, service_i18n(*), service_tiers(*, service_tier_i18n(*))")
      .eq("published", true)
      .order("sort_order", { ascending: true });

    if (error || !rows?.length) return fallback;

    const metas = rows.map((doc) => ({
      id: String(doc.service_id),
      slug: String(doc.slug),
      image: String(doc.image_path || `/images/service-${doc.slug}.png`),
      iconName: String(doc.icon || SERVICE_ICON_BY_ID[String(doc.service_id)] || "Monitor"),
    }));

    const localized: LocalizedService[] = rows.map((doc) => {
      const i18n =
        (doc.service_i18n as Array<Record<string, unknown>> | null)?.find(
          (r) => r.locale === locale,
        ) ||
        (doc.service_i18n as Array<Record<string, unknown>> | null)?.find(
          (r) => r.locale === "it",
        );
      const tiers = (doc.service_tiers as Array<Record<string, unknown>> | null) || [];
      return {
        id: String(doc.service_id),
        title: String(i18n?.title || doc.service_id),
        description: String(i18n?.description || ""),
        details: String(i18n?.details || ""),
        whatYouGet: Array.isArray(i18n?.what_you_get)
          ? (i18n!.what_you_get as string[])
          : [],
        portfolioUrl: i18n?.portfolio_url ? String(i18n.portfolio_url) : undefined,
        portfolioLinkLabel: i18n?.portfolio_link_label
          ? String(i18n.portfolio_link_label)
          : undefined,
        portfolioUrl2: i18n?.portfolio_url_2 ? String(i18n.portfolio_url_2) : undefined,
        portfolioLinkLabel2: i18n?.portfolio_link_label_2
          ? String(i18n.portfolio_link_label_2)
          : undefined,
        pricingSectionTitle: i18n?.pricing_section_title
          ? String(i18n.pricing_section_title)
          : undefined,
        pricingFootnote: i18n?.pricing_footnote ? String(i18n.pricing_footnote) : undefined,
        pricingTiers: tiers.map((tier) => {
          const ti =
            (tier.service_tier_i18n as Array<Record<string, unknown>> | null)?.find(
              (r) => r.locale === locale,
            ) ||
            (tier.service_tier_i18n as Array<Record<string, unknown>> | null)?.find(
              (r) => r.locale === "it",
            );
          return {
            tierId: String(tier.tier_id),
            name: String(ti?.name || tier.tier_id),
            detail: String(ti?.detail || ""),
          };
        }),
      };
    });

    const basePrices: Record<string, number> = {};
    const monthly: Record<string, boolean> = {};
    for (const doc of rows) {
      basePrices[String(doc.service_id)] = Number(doc.base_price) || 0;
      if (doc.is_monthly) monthly[String(doc.service_id)] = true;
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
  const fallback = staticAddons(locale);
  if (!isSupabaseConfigured()) return fallback;

  try {
    const sb = createAdminClient();
    const { data: rows, error } = await sb
      .from("addon_categories")
      .select("*, addon_category_i18n(*), addon_items(*, addon_item_i18n(*))")
      .order("sort_order", { ascending: true });

    if (error || !rows?.length) return fallback;

    return {
      structure: rows.map((doc) => ({
        id: String(doc.category_id),
        items: ((doc.addon_items as Array<Record<string, unknown>> | null) || [])
          .filter((i) => i.enabled !== false)
          .map((i) => ({ id: String(i.item_id) })),
      })),
      localized: rows.map((doc) => {
        const ci =
          (doc.addon_category_i18n as Array<Record<string, unknown>> | null)?.find(
            (r) => r.locale === locale,
          ) ||
          (doc.addon_category_i18n as Array<Record<string, unknown>> | null)?.find(
            (r) => r.locale === "it",
          );
        return {
          id: String(doc.category_id),
          title: String(ci?.title || doc.category_id),
          items: ((doc.addon_items as Array<Record<string, unknown>> | null) || [])
            .filter((i) => i.enabled !== false)
            .map((i) => {
              const ii =
                (i.addon_item_i18n as Array<Record<string, unknown>> | null)?.find(
                  (r) => r.locale === locale,
                ) ||
                (i.addon_item_i18n as Array<Record<string, unknown>> | null)?.find(
                  (r) => r.locale === "it",
                );
              return {
                id: String(i.item_id),
                label: String(ii?.label || i.item_id),
                info: String(ii?.info || ""),
              };
            }),
        };
      }),
    };
  } catch (err) {
    console.warn("[cms] getAddonCategories failed:", err);
    return fallback;
  }
}

export async function getProcessSteps(locale: Locale = "it") {
  const fallback = processStepsMeta.map((m, index) => {
    const copy = translations[locale].process.find((p) => p.id === m.id);
    return {
      ...m,
      sortOrder: index,
      iconName: ["Search", "Compass", "Brush", "Code2", "TrendingUp"][index] || "Search",
      title: copy?.title || m.id,
      summary: copy?.summary || "",
      description: copy?.description || "",
    };
  });

  if (!isSupabaseConfigured()) return fallback;

  try {
    const sb = createAdminClient();
    const { data: rows, error } = await sb
      .from("process_steps")
      .select("*, process_step_i18n(*)")
      .order("sort_order", { ascending: true });

    if (error || !rows?.length) return fallback;

    return rows.map((doc) => {
      const i18n =
        (doc.process_step_i18n as Array<Record<string, unknown>> | null)?.find(
          (r) => r.locale === locale,
        ) ||
        (doc.process_step_i18n as Array<Record<string, unknown>> | null)?.find(
          (r) => r.locale === "it",
        );
      return {
        id: String(doc.step_id),
        number: String(doc.number_label),
        sortOrder: Number(doc.sort_order) || 0,
        iconName: String(doc.icon || "Search"),
        title: String(i18n?.title || doc.step_id),
        summary: String(i18n?.summary || ""),
        description: String(i18n?.description || ""),
      };
    });
  } catch {
    return fallback;
  }
}

export async function getSeoDefaults(locale: Locale = "it") {
  const envFallback = {
    gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || undefined,
    plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || undefined,
    defaultTitle: undefined as string | undefined,
    defaultDescription: undefined as string | undefined,
    ogImagePath: "/images/og-cover.svg",
  };

  if (!isSupabaseConfigured()) return envFallback;

  try {
    const sb = createAdminClient();
    const { data, error } = await sb
      .from("seo_defaults")
      .select("*")
      .eq("locale", locale)
      .maybeSingle();

    if (error || !data) return envFallback;

    return {
      gaMeasurementId: data.ga_measurement_id || envFallback.gaMeasurementId,
      plausibleDomain: data.plausible_domain || envFallback.plausibleDomain,
      defaultTitle: data.default_title || undefined,
      defaultDescription: data.default_description || undefined,
      ogImagePath: data.og_image_path || envFallback.ogImagePath,
    };
  } catch {
    return envFallback;
  }
}

export async function getRedirectMatch(path: string) {
  if (!isSupabaseConfigured()) return null;
  try {
    const sb = createAdminClient();
    const { data, error } = await sb
      .from("redirects")
      .select("to_path, permanent")
      .eq("from_path", path)
      .eq("enabled", true)
      .maybeSingle();
    if (error || !data) return null;
    return { toPath: data.to_path as string, permanent: data.permanent !== false };
  } catch {
    return null;
  }
}

async function getSiteCopyOverlay(locale: Locale): Promise<Partial<TranslationSet>> {
  if (!isSupabaseConfigured()) return {};

  try {
    const sb = createAdminClient();
    const { data: rows, error } = await sb
      .from("site_copy")
      .select("section, data")
      .eq("locale", locale);

    if (error || !rows?.length) return {};

    const overlay: Partial<TranslationSet> = {};
    const bySection = Object.fromEntries(rows.map((r) => [r.section, r.data]));

    const mergeObj = <K extends keyof TranslationSet>(key: K, section = String(key)) => {
      const raw = bySection[section];
      if (raw && typeof raw === "object") {
        (overlay as Record<string, unknown>)[key] = {
          ...(translations[locale][key] as object),
          ...(raw as object),
        };
      }
    };

    mergeObj("nav");
    mergeObj("hero");
    mergeObj("problem");
    mergeObj("caseStudies");
    mergeObj("impact");
    mergeObj("processSection");
    mergeObj("contact");
    mergeObj("aboutPage");
    mergeObj("langSelector");
    mergeObj("footer");
    mergeObj("audit");
    mergeObj("orderPage");
    mergeObj("workPage");
    mergeObj("servicesPage");
    mergeObj("servicePage");

    if (Array.isArray(bySection.trust) && bySection.trust.length) {
      overlay.trust = (bySection.trust as unknown[]).map((x) =>
        typeof x === "string" ? x : String((x as { item?: string })?.item || ""),
      );
    }
    if (typeof bySection.servicesLabel === "string") {
      overlay.servicesLabel = bySection.servicesLabel;
    }
    if (typeof bySection.servicesLead === "string") {
      overlay.servicesLead = bySection.servicesLead;
    }
    if (bySection.about && typeof bySection.about === "object") {
      const about = bySection.about as {
        eyebrow?: string;
        title?: string;
        bio?: string;
        pills?: Array<string | { item?: string }>;
      };
      overlay.about = {
        ...translations[locale].about,
        ...about,
        pills: about.pills?.length
          ? about.pills.map((p) => (typeof p === "string" ? p : String(p.item || "")))
          : translations[locale].about.pills,
      };
    }
    if (bySection.pricingAddons && typeof bySection.pricingAddons === "object") {
      overlay.pricingAddons = {
        ...translations[locale].pricingAddons,
        ...(bySection.pricingAddons as object),
      } as TranslationSet["pricingAddons"];
    }
    if (bySection.privacyPage && typeof bySection.privacyPage === "object") {
      const privacy = bySection.privacyPage as {
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

    void LOCALES;
    return overlay;
  } catch {
    return {};
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
  const [projects, services, addons, siteCopy, processSteps] = await Promise.all([
    getProjects(locale),
    getServices(locale),
    getAddonCategories(locale),
    getSiteCopyOverlay(locale),
    getProcessSteps(locale),
  ]);

  const projectLocalized =
    projects.map((p) => p.localized).filter(Boolean) as LocalizedProject[];

  const t: TranslationSet = {
    ...base,
    ...siteCopy,
    projects: projectLocalized.length ? projectLocalized : base.projects,
    services: services.localized.length ? services.localized : base.services,
    process: processSteps.map((s) => ({
      id: s.id,
      title: s.title,
      summary: s.summary,
      description: s.description,
    })),
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

export function getStaticTierPrice(serviceId: ServiceId, tierId: string): number | undefined {
  return SERVICE_TIERS[serviceId]?.find((t) => t.tierId === tierId)?.price;
}

export async function getTierPrice(
  serviceId: ServiceId,
  tierId: string,
): Promise<number | undefined> {
  if (!isSupabaseConfigured()) return getStaticTierPrice(serviceId, tierId);
  try {
    const sb = createAdminClient();
    const { data: service } = await sb
      .from("services")
      .select("id")
      .eq("service_id", serviceId)
      .maybeSingle();
    if (!service) return getStaticTierPrice(serviceId, tierId);
    const { data: tier } = await sb
      .from("service_tiers")
      .select("price")
      .eq("service_id", service.id)
      .eq("tier_id", tierId)
      .maybeSingle();
    if (tier?.price != null) return Number(tier.price);
  } catch {
    /* fall through */
  }
  return getStaticTierPrice(serviceId, tierId);
}
