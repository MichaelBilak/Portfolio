/**
 * Seed Supabase Studio tables from static data + translations.
 * Usage: npm run studio:seed
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
 */
import { createClient } from "@supabase/supabase-js";
import { projectsMeta } from "../data/projects";
import { servicesMeta } from "../data/services";
import {
  ADDON_CATEGORIES,
  SERVICE_BASE_PRICES,
  SERVICE_MONTHLY,
  SERVICE_TIERS,
  type ServiceId,
} from "../data/pricing";
import { processStepsMeta } from "../data/process";
import { translations, type Locale } from "../lib/translations";
import { BRAND_NAME, BRAND_TAGLINE, INSTAGRAM_BIO_LINK, INSTAGRAM_URL, SITE_URL } from "../lib/brand";
import { CONTACT_EMAIL } from "../lib/contact-email";

const LOCALES: Locale[] = ["it", "en", "fr", "ru", "de", "es"];

const ICON_BY_SERVICE: Record<string, string> = {
  "booking-flow": "CalendarCheck",
  "premium-site": "Monitor",
  redesign: "RefreshCw",
  "photo-video": "Video",
  "monthly-support": "Wrench",
};

const PROCESS_ICONS = ["Search", "Compass", "Brush", "Code2", "TrendingUp"] as const;

const COPY_SECTIONS = [
  "nav",
  "hero",
  "trust",
  "servicesLabel",
  "servicesLead",
  "problem",
  "caseStudies",
  "impact",
  "audit",
  "processSection",
  "about",
  "aboutPage",
  "contact",
  "orderPage",
  "pricingAddons",
  "servicesPage",
  "servicePage",
  "workPage",
  "footer",
  "privacyPage",
  "langSelector",
] as const;

function sb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

async function main() {
  const client = sb();
  console.log("Seeding Studio…");

  // Projects
  for (const [index, meta] of projectsMeta.entries()) {
    const { data: existing } = await client
      .from("projects")
      .select("id")
      .eq("project_id", meta.id)
      .maybeSingle();

    const row = {
      project_id: meta.id,
      slug: meta.slug,
      index_label: meta.index,
      tag: meta.tag,
      sort_order: index,
      image_path: meta.image,
      image_position: meta.imagePosition || "top",
      tech: meta.tech,
      url: meta.url,
      display_url: meta.displayUrl,
      is_live: Boolean(meta.isLive),
      featured: true,
      published: true,
      updated_at: new Date().toISOString(),
    };

    let projectUuid = existing?.id as string | undefined;
    if (projectUuid) {
      await client.from("projects").update(row).eq("id", projectUuid);
    } else {
      const { data, error } = await client.from("projects").insert(row).select("id").single();
      if (error) throw error;
      projectUuid = data.id;
    }

    for (const locale of LOCALES) {
      const copy = translations[locale].projects.find((p) => p.id === meta.id);
      if (!copy) continue;
      await client.from("project_i18n").upsert(
        {
          project_id: projectUuid,
          locale,
          name: copy.name,
          name_tagline: copy.nameTagline || null,
          subtitle: copy.subtitle,
          problem: copy.problem,
          solution: copy.solution,
          business_impact: copy.businessImpact,
        },
        { onConflict: "project_id,locale" },
      );
    }
    console.log("project", meta.id);
  }

  // Services
  for (const [index, meta] of servicesMeta.entries()) {
    const serviceId = meta.id as ServiceId;
    const { data: existing } = await client
      .from("services")
      .select("id")
      .eq("service_id", meta.id)
      .maybeSingle();

    const row = {
      service_id: meta.id,
      slug: meta.slug,
      sort_order: index,
      icon: ICON_BY_SERVICE[meta.id] || "Monitor",
      image_path: meta.image,
      published: true,
      base_price: SERVICE_BASE_PRICES[serviceId],
      is_monthly: Boolean(SERVICE_MONTHLY[serviceId]),
      updated_at: new Date().toISOString(),
    };

    let serviceUuid = existing?.id as string | undefined;
    if (serviceUuid) {
      await client.from("services").update(row).eq("id", serviceUuid);
    } else {
      const { data, error } = await client.from("services").insert(row).select("id").single();
      if (error) throw error;
      serviceUuid = data.id;
    }

    for (const locale of LOCALES) {
      const copy = translations[locale].services.find((s) => s.id === meta.id);
      if (!copy) continue;
      await client.from("service_i18n").upsert(
        {
          service_id: serviceUuid,
          locale,
          title: copy.title,
          description: copy.description,
          details: copy.details || "",
          what_you_get: copy.whatYouGet || [],
          portfolio_url: copy.portfolioUrl || null,
          portfolio_link_label: copy.portfolioLinkLabel || null,
          portfolio_url_2: copy.portfolioUrl2 || null,
          portfolio_link_label_2: copy.portfolioLinkLabel2 || null,
          pricing_section_title: copy.pricingSectionTitle || null,
          pricing_footnote: copy.pricingFootnote || null,
        },
        { onConflict: "service_id,locale" },
      );
    }

    const tiers = SERVICE_TIERS[serviceId] || [];
    for (const [ti, tier] of tiers.entries()) {
      const { data: existingTier } = await client
        .from("service_tiers")
        .select("id")
        .eq("service_id", serviceUuid)
        .eq("tier_id", tier.tierId)
        .maybeSingle();

      let tierUuid = existingTier?.id as string | undefined;
      const tierRow = {
        service_id: serviceUuid,
        tier_id: tier.tierId,
        price: tier.price,
        monthly: Boolean(tier.monthly),
        featured: Boolean(tier.featured),
        sort_order: ti,
      };
      if (tierUuid) {
        await client.from("service_tiers").update(tierRow).eq("id", tierUuid);
      } else {
        const { data, error } = await client.from("service_tiers").insert(tierRow).select("id").single();
        if (error) throw error;
        tierUuid = data.id;
      }

      for (const locale of LOCALES) {
        const copy = translations[locale].services.find((s) => s.id === meta.id);
        const tierCopy = copy?.pricingTiers?.find((t) => t.tierId === tier.tierId);
        await client.from("service_tier_i18n").upsert(
          {
            tier_id: tierUuid,
            locale,
            name: tierCopy?.name || tier.tierId,
            detail: tierCopy?.detail || "",
          },
          { onConflict: "tier_id,locale" },
        );
      }
    }
    console.log("service", meta.id);
  }

  // Addons
  for (const [index, cat] of ADDON_CATEGORIES.entries()) {
    const { data: existing } = await client
      .from("addon_categories")
      .select("id")
      .eq("category_id", cat.id)
      .maybeSingle();

    let catUuid = existing?.id as string | undefined;
    if (catUuid) {
      await client.from("addon_categories").update({ sort_order: index }).eq("id", catUuid);
    } else {
      const { data, error } = await client
        .from("addon_categories")
        .insert({ category_id: cat.id, sort_order: index })
        .select("id")
        .single();
      if (error) throw error;
      catUuid = data.id;
    }

    for (const locale of LOCALES) {
      const locCat = translations[locale].pricingAddons.categories.find((c) => c.id === cat.id);
      await client.from("addon_category_i18n").upsert(
        { category_id: catUuid, locale, title: locCat?.title || cat.id },
        { onConflict: "category_id,locale" },
      );
    }

    for (const [ii, item] of cat.items.entries()) {
      const { data: existingItem } = await client
        .from("addon_items")
        .select("id")
        .eq("category_id", catUuid)
        .eq("item_id", item.id)
        .maybeSingle();

      let itemUuid = existingItem?.id as string | undefined;
      const itemRow = {
        category_id: catUuid,
        item_id: item.id,
        price_type: "from",
        enabled: true,
        sort_order: ii,
      };
      if (itemUuid) {
        await client.from("addon_items").update(itemRow).eq("id", itemUuid);
      } else {
        const { data, error } = await client.from("addon_items").insert(itemRow).select("id").single();
        if (error) throw error;
        itemUuid = data.id;
      }

      for (const locale of LOCALES) {
        const locCat = translations[locale].pricingAddons.categories.find((c) => c.id === cat.id);
        const copy = locCat?.items.find((i) => i.id === item.id);
        await client.from("addon_item_i18n").upsert(
          {
            item_id: itemUuid,
            locale,
            label: copy?.label || item.id,
            info: copy?.info || "",
          },
          { onConflict: "item_id,locale" },
        );
      }
    }
    console.log("addon", cat.id);
  }

  // Process
  for (const [index, meta] of processStepsMeta.entries()) {
    const { data: existing } = await client
      .from("process_steps")
      .select("id")
      .eq("step_id", meta.id)
      .maybeSingle();

    const row = {
      step_id: meta.id,
      number_label: meta.number,
      sort_order: index,
      icon: PROCESS_ICONS[index] || "Search",
    };
    let stepUuid = existing?.id as string | undefined;
    if (stepUuid) {
      await client.from("process_steps").update(row).eq("id", stepUuid);
    } else {
      const { data, error } = await client.from("process_steps").insert(row).select("id").single();
      if (error) throw error;
      stepUuid = data.id;
    }

    for (const locale of LOCALES) {
      const copy = translations[locale].process.find((p) => p.id === meta.id);
      if (!copy) continue;
      await client.from("process_step_i18n").upsert(
        {
          step_id: stepUuid,
          locale,
          title: copy.title,
          summary: copy.summary,
          description: copy.description,
        },
        { onConflict: "step_id,locale" },
      );
    }
  }
  console.log("process steps");

  // Redirects
  for (const r of [
    { from_path: "/work/rockisland-rimini", to_path: "/work/porto-sole" },
    { from_path: "/work/premium-restaurant-local-concept", to_path: "/work/mare-vivo" },
  ]) {
    await client.from("redirects").upsert(
      { ...r, permanent: true, enabled: true },
      { onConflict: "from_path" },
    );
  }

  // Settings
  await client.from("site_settings").upsert({
    id: 1,
    brand_name: BRAND_NAME,
    brand_tagline: BRAND_TAGLINE,
    site_url: SITE_URL,
    contact_email: CONTACT_EMAIL,
    instagram_url: INSTAGRAM_URL,
    instagram_bio_link: INSTAGRAM_BIO_LINK,
    updated_at: new Date().toISOString(),
  });

  // SEO + site copy
  for (const locale of LOCALES) {
    const t = translations[locale];
    await client.from("seo_defaults").upsert(
      {
        locale,
        default_title: `${BRAND_NAME} · ${t.hero.headline.slice(0, 60)}`,
        default_description: t.hero.lead || t.hero.subtitle,
        og_image_path: "/images/og-cover.svg",
        organization_logo_path: "/images/logo-mark.svg",
        ga_measurement_id: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || null,
        plausible_domain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "locale" },
    );

    const sectionData: Record<string, unknown> = {
      nav: t.nav,
      hero: t.hero,
      trust: t.trust,
      servicesLabel: t.servicesLabel,
      servicesLead: t.servicesLead,
      problem: t.problem,
      caseStudies: t.caseStudies,
      impact: t.impact,
      audit: t.audit,
      processSection: t.processSection,
      about: t.about,
      aboutPage: t.aboutPage,
      contact: t.contact,
      orderPage: t.orderPage,
      pricingAddons: {
        eyebrow: t.pricingAddons.eyebrow,
        title: t.pricingAddons.title,
        subtitle: t.pricingAddons.subtitle,
        footnote: t.pricingAddons.footnote,
      },
      servicesPage: t.servicesPage,
      servicePage: t.servicePage,
      workPage: t.workPage,
      footer: t.footer,
      privacyPage: t.privacyPage,
      langSelector: t.langSelector,
    };

    for (const section of COPY_SECTIONS) {
      await client.from("site_copy").upsert(
        {
          locale,
          section,
          data: sectionData[section] ?? null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "locale,section" },
      );
    }
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
