/**
 * Seed Payload CMS from existing static data + translations.
 * Usage: npm run payload:seed
 *
 * Requires PAYLOAD_SECRET and DATABASE_URL (defaults to file:./payload.db).
 * Optional: ADMIN_EMAIL, ADMIN_PASSWORD
 */
import { getPayload } from "payload";
import config from "../payload.config";
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
import { beforeAfterCasesMeta } from "../data/before-after-cases";
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

async function main() {
  const payload = await getPayload({ config });

  const adminEmail = process.env.ADMIN_EMAIL || "dormup.it@gmail.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "ChangeMeNow!123";

  const existingUsers = await payload.find({
    collection: "users",
    where: { email: { equals: adminEmail } },
    limit: 1,
    overrideAccess: true,
  });

  if (!existingUsers.docs.length) {
    await payload.create({
      collection: "users",
      overrideAccess: true,
      data: {
        email: adminEmail,
        password: adminPassword,
        role: "owner",
        name: "DormUp Owner",
      },
    });
    console.log(`Created admin user ${adminEmail}`);
  } else {
    console.log(`Admin user already exists: ${adminEmail}`);
  }

  // ── Services ──────────────────────────────────────────────
  for (const [index, meta] of servicesMeta.entries()) {
    const existing = await payload.find({
      collection: "services",
      where: { serviceId: { equals: meta.id } },
      limit: 1,
      overrideAccess: true,
    });

    const serviceId = meta.id as ServiceId;
    const tiers = SERVICE_TIERS[serviceId] || [];
    const itCopy = translations.it.services.find((s) => s.id === meta.id);

    const baseData = {
      serviceId: meta.id,
      slug: meta.slug,
      sortOrder: index,
      icon: ICON_BY_SERVICE[meta.id] || "Monitor",
      imagePath: meta.image,
      published: true,
      basePrice: SERVICE_BASE_PRICES[serviceId],
      isMonthly: Boolean(SERVICE_MONTHLY[serviceId]),
      title: itCopy?.title || meta.id,
      description: itCopy?.description || "",
      details: itCopy?.details || "",
      whatYouGet: (itCopy?.whatYouGet || []).map((item) => ({ item })),
      portfolioUrl: itCopy?.portfolioUrl,
      portfolioLinkLabel: itCopy?.portfolioLinkLabel,
      portfolioUrl2: itCopy?.portfolioUrl2,
      portfolioLinkLabel2: itCopy?.portfolioLinkLabel2,
      pricingSectionTitle: itCopy?.pricingSectionTitle,
      pricingFootnote: itCopy?.pricingFootnote,
      tiers: tiers.map((tier) => {
        const tierCopy = itCopy?.pricingTiers?.find((t) => t.tierId === tier.tierId);
        return {
          tierId: tier.tierId,
          price: tier.price,
          monthly: Boolean(tier.monthly),
          featured: Boolean(tier.featured),
          name: tierCopy?.name || tier.tierId,
          detail: tierCopy?.detail || "",
        };
      }),
    };

    let docId: string | number;
    if (existing.docs[0]) {
      docId = existing.docs[0].id;
      await payload.update({
        collection: "services",
        id: docId,
        locale: "it",
        overrideAccess: true,
        data: baseData,
      });
    } else {
      const created = await payload.create({
        collection: "services",
        locale: "it",
        overrideAccess: true,
        data: baseData,
      });
      docId = created.id;
    }

    for (const locale of LOCALES.filter((l) => l !== "it")) {
      const copy = translations[locale].services.find((s) => s.id === meta.id);
      if (!copy) continue;
      await payload.update({
        collection: "services",
        id: docId,
        locale,
        overrideAccess: true,
        data: {
          title: copy.title,
          description: copy.description,
          details: copy.details,
          whatYouGet: copy.whatYouGet.map((item) => ({ item })),
          portfolioUrl: copy.portfolioUrl,
          portfolioLinkLabel: copy.portfolioLinkLabel,
          portfolioUrl2: copy.portfolioUrl2,
          portfolioLinkLabel2: copy.portfolioLinkLabel2,
          pricingSectionTitle: copy.pricingSectionTitle,
          pricingFootnote: copy.pricingFootnote,
          tiers: tiers.map((tier) => {
            const tierCopy = copy.pricingTiers?.find((t) => t.tierId === tier.tierId);
            return {
              tierId: tier.tierId,
              price: tier.price,
              monthly: Boolean(tier.monthly),
              featured: Boolean(tier.featured),
              name: tierCopy?.name || tier.tierId,
              detail: tierCopy?.detail || "",
            };
          }),
        },
      });
    }
    console.log(`Seeded service ${meta.id}`);
  }

  // ── Addon categories ──────────────────────────────────────
  for (const [index, cat] of ADDON_CATEGORIES.entries()) {
    const existing = await payload.find({
      collection: "addon-categories",
      where: { categoryId: { equals: cat.id } },
      limit: 1,
      overrideAccess: true,
    });
    const itCat = translations.it.pricingAddons.categories.find((c) => c.id === cat.id);

    const baseData = {
      categoryId: cat.id,
      sortOrder: index,
      title: itCat?.title || cat.id,
      items: cat.items.map((item) => {
        const copy = itCat?.items.find((i) => i.id === item.id);
        return {
          itemId: item.id,
          label: copy?.label || item.id,
          info: copy?.info || "",
          priceType: "from" as const,
          enabled: true,
        };
      }),
    };

    let docId: string | number;
    if (existing.docs[0]) {
      docId = existing.docs[0].id;
      await payload.update({
        collection: "addon-categories",
        id: docId,
        locale: "it",
        overrideAccess: true,
        data: baseData,
      });
    } else {
      const created = await payload.create({
        collection: "addon-categories",
        locale: "it",
        overrideAccess: true,
        data: baseData,
      });
      docId = created.id;
    }

    for (const locale of LOCALES.filter((l) => l !== "it")) {
      const locCat = translations[locale].pricingAddons.categories.find((c) => c.id === cat.id);
      if (!locCat) continue;
      await payload.update({
        collection: "addon-categories",
        id: docId,
        locale,
        overrideAccess: true,
        data: {
          title: locCat.title,
          items: cat.items.map((item) => {
            const copy = locCat.items.find((i) => i.id === item.id);
            return {
              itemId: item.id,
              label: copy?.label || item.id,
              info: copy?.info || "",
              priceType: "from" as const,
              enabled: true,
            };
          }),
        },
      });
    }
    console.log(`Seeded addon category ${cat.id}`);
  }

  // ── Projects ──────────────────────────────────────────────
  for (const [index, meta] of projectsMeta.entries()) {
    const existing = await payload.find({
      collection: "projects",
      where: { projectId: { equals: meta.id } },
      limit: 1,
      overrideAccess: true,
    });
    const itCopy = translations.it.projects.find((p) => p.id === meta.id);

    const baseData = {
      projectId: meta.id,
      slug: meta.slug,
      index: meta.index,
      tag: meta.tag,
      sortOrder: index,
      imagePath: meta.image,
      imagePosition: meta.imagePosition || "top",
      tech: meta.tech.map((label) => ({ label })),
      url: meta.url,
      displayUrl: meta.displayUrl,
      isLive: Boolean(meta.isLive),
      featured: true,
      published: true,
      name: itCopy?.name || meta.id,
      nameTagline: itCopy?.nameTagline,
      subtitle: itCopy?.subtitle || "",
      problem: itCopy?.problem || "",
      solution: itCopy?.solution || "",
      businessImpact: itCopy?.businessImpact || "",
    };

    let docId: string | number;
    if (existing.docs[0]) {
      docId = existing.docs[0].id;
      await payload.update({
        collection: "projects",
        id: docId,
        locale: "it",
        overrideAccess: true,
        data: baseData,
      });
    } else {
      const created = await payload.create({
        collection: "projects",
        locale: "it",
        overrideAccess: true,
        data: baseData,
      });
      docId = created.id;
    }

    for (const locale of LOCALES.filter((l) => l !== "it")) {
      const copy = translations[locale].projects.find((p) => p.id === meta.id);
      if (!copy) continue;
      await payload.update({
        collection: "projects",
        id: docId,
        locale,
        overrideAccess: true,
        data: {
          name: copy.name,
          nameTagline: copy.nameTagline,
          subtitle: copy.subtitle,
          problem: copy.problem,
          solution: copy.solution,
          businessImpact: copy.businessImpact,
        },
      });
    }
    console.log(`Seeded project ${meta.id}`);
  }

  // ── Process steps ─────────────────────────────────────────
  const PROCESS_ICONS = ["Search", "Compass", "Brush", "Code2", "TrendingUp"] as const;
  for (const [index, meta] of processStepsMeta.entries()) {
    const existing = await payload.find({
      collection: "process-steps",
      where: { stepId: { equals: meta.id } },
      limit: 1,
      overrideAccess: true,
    });
    const itCopy = translations.it.process.find((p) => p.id === meta.id);

    const baseData = {
      stepId: meta.id,
      number: meta.number,
      sortOrder: index,
      icon: PROCESS_ICONS[index] || "Search",
      title: itCopy?.title || meta.id,
      summary: itCopy?.summary || "",
      description: itCopy?.description || "",
    };

    let docId: string | number;
    if (existing.docs[0]) {
      docId = existing.docs[0].id;
      await payload.update({
        collection: "process-steps",
        id: docId,
        locale: "it",
        overrideAccess: true,
        data: baseData,
      });
    } else {
      const created = await payload.create({
        collection: "process-steps",
        locale: "it",
        overrideAccess: true,
        data: baseData,
      });
      docId = created.id;
    }

    for (const locale of LOCALES.filter((l) => l !== "it")) {
      const copy = translations[locale].process.find((p) => p.id === meta.id);
      if (!copy) continue;
      await payload.update({
        collection: "process-steps",
        id: docId,
        locale,
        overrideAccess: true,
        data: {
          title: copy.title,
          summary: copy.summary,
          description: copy.description,
        },
      });
    }
  }
  console.log("Seeded process steps");

  // ── Before/after ──────────────────────────────────────────
  for (const [index, meta] of beforeAfterCasesMeta.entries()) {
    const existing = await payload.find({
      collection: "before-after-cases",
      where: { caseId: { equals: meta.id } },
      limit: 1,
      overrideAccess: true,
    });
    const itCase = translations.it.beforeAfter.cases[index];

    const baseData = {
      caseId: meta.id,
      sortOrder: index,
      published: true,
      beforeSrc: meta.beforeSrc,
      afterSrc: meta.afterSrc,
      tab: itCase?.tab || meta.id,
      headline: itCase?.headline || "",
      changes: (itCase?.changes || []).map((item) => ({ item })),
      beforeAlt: itCase?.beforeAlt || "",
      afterAlt: itCase?.afterAlt || "",
    };

    let docId: string | number;
    if (existing.docs[0]) {
      docId = existing.docs[0].id;
      await payload.update({
        collection: "before-after-cases",
        id: docId,
        locale: "it",
        overrideAccess: true,
        data: baseData,
      });
    } else {
      const created = await payload.create({
        collection: "before-after-cases",
        locale: "it",
        overrideAccess: true,
        data: baseData,
      });
      docId = created.id;
    }

    for (const locale of LOCALES.filter((l) => l !== "it")) {
      const locCase = translations[locale].beforeAfter.cases[index];
      if (!locCase) continue;
      await payload.update({
        collection: "before-after-cases",
        id: docId,
        locale,
        overrideAccess: true,
        data: {
          tab: locCase.tab,
          headline: locCase.headline,
          changes: locCase.changes.map((item) => ({ item })),
          beforeAlt: locCase.beforeAlt,
          afterAlt: locCase.afterAlt,
        },
      });
    }
  }
  console.log("Seeded before/after cases");

  // ── Redirects ─────────────────────────────────────────────
  const redirects = [
    { fromPath: "/work/rockisland-rimini", toPath: "/work/porto-sole" },
    { fromPath: "/work/premium-restaurant-local-concept", toPath: "/work/mare-vivo" },
  ];
  for (const r of redirects) {
    const existing = await payload.find({
      collection: "redirects",
      where: { fromPath: { equals: r.fromPath } },
      limit: 1,
      overrideAccess: true,
    });
    if (!existing.docs.length) {
      await payload.create({
        collection: "redirects",
        overrideAccess: true,
        data: { ...r, permanent: true, enabled: true },
      });
    }
  }
  console.log("Seeded redirects");

  // ── Globals ───────────────────────────────────────────────
  await payload.updateGlobal({
    slug: "site-settings",
    overrideAccess: true,
    data: {
      brandName: BRAND_NAME,
      brandTagline: BRAND_TAGLINE,
      siteUrl: SITE_URL,
      contactEmail: CONTACT_EMAIL,
      instagramUrl: INSTAGRAM_URL,
      instagramBioLink: INSTAGRAM_BIO_LINK,
    },
  });

  for (const locale of LOCALES) {
    const t = translations[locale];
    await payload.updateGlobal({
      slug: "seo-defaults",
      locale,
      overrideAccess: true,
      data: {
        defaultTitle: `${BRAND_NAME} · ${t.hero.headline.slice(0, 60)}`,
        defaultDescription: t.hero.lead || t.hero.subtitle,
        ogImagePath: "/images/og-cover.svg",
        organizationLogoPath: "/images/logo-mark.svg",
      },
    });

    await payload.updateGlobal({
      slug: "site-copy",
      locale,
      overrideAccess: true,
      data: {
        nav: t.nav,
        hero: {
          eyebrow: t.hero.eyebrow,
          headline: t.hero.headline,
          subtitle: t.hero.subtitle,
          lead: t.hero.lead,
          primaryCta: t.hero.primaryCta,
          secondaryCta: t.hero.secondaryCta,
          buyCta: t.hero.buyCta,
          buyCtaShort: t.hero.buyCtaShort,
          socialProof: t.hero.socialProof,
          mockupCaption: t.hero.mockupCaption,
          chipHighlight: t.hero.chipHighlight,
          chipAvailability: t.hero.chipAvailability,
          chipAvailabilitySub: t.hero.chipAvailabilitySub,
        },
        trust: t.trust.map((item) => ({ item })),
        servicesLabel: t.servicesLabel,
        servicesLead: t.servicesLead,
        about: {
          eyebrow: t.about.eyebrow,
          title: t.about.title,
          bio: t.about.bio,
          pills: t.about.pills.map((item) => ({ item })),
        },
        aboutPage: t.aboutPage,
        audit: t.audit,
        footer: t.footer,
        orderPage: {
          eyebrow: t.orderPage.eyebrow,
          title: t.orderPage.title,
          subtitle: t.orderPage.subtitle,
          fromLabel: t.orderPage.fromLabel,
          plusLabel: t.orderPage.plusLabel,
          selectHint: t.orderPage.selectHint,
          proceedCta: t.orderPage.proceedCta,
          footnote: t.orderPage.footnote,
          estimatedLabel: t.orderPage.estimatedLabel,
          addonsSectionTitle: t.orderPage.addonsSectionTitle,
          aboutServiceCta: t.orderPage.aboutServiceCta,
        },
        pricingAddons: {
          eyebrow: t.pricingAddons.eyebrow,
          title: t.pricingAddons.title,
          subtitle: t.pricingAddons.subtitle,
          footnote: t.pricingAddons.footnote,
        },
        workPage: t.workPage,
        servicesPage: {
          eyebrow: t.servicesPage.eyebrow,
          title: t.servicesPage.title,
          subtitle: t.servicesPage.subtitle,
          techStack: t.servicesPage.techStack,
          viewAll: t.servicesPage.viewAll,
          pricingNote: t.servicesPage.pricingNote,
        },
        servicePage: t.servicePage,
        privacyPage: {
          title: t.privacyPage.title,
          lastUpdated: t.privacyPage.lastUpdated,
          backToHome: t.privacyPage.backToHome,
          sections: t.privacyPage.sections,
        },
        langSelector: t.langSelector,
        processSection: t.processSection,
        beforeAfter: {
          eyebrow: t.beforeAfter.eyebrow,
          title: t.beforeAfter.title,
          subtitle: t.beforeAfter.subtitle,
          beforeBadge: t.beforeAfter.beforeBadge,
          afterBadge: t.beforeAfter.afterBadge,
          dragHint: t.beforeAfter.dragHint,
          changesTitle: t.beforeAfter.changesTitle,
          footerNote: t.beforeAfter.footerNote,
          showOnSite: false,
        },
        caseStudies: t.caseStudies,
        problem: t.problem,
        impact: {
          label: t.impact.label,
          items: t.impact.items,
        },
        contact: {
          label: t.contact.label,
          title: t.contact.title,
          body: t.contact.body,
          compactTitle: t.contact.compactTitle,
          emailLabel: t.contact.emailLabel,
          whatsappLabel: t.contact.whatsappLabel,
          availability: t.contact.availability,
        },
      },
    });
  }

  await payload.updateGlobal({
    slug: "integrations",
    overrideAccess: true,
    data: {
      gmailConfigured: Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD),
      sheetsConfigured: Boolean(
        process.env.GOOGLE_SHEETS_SPREADSHEET_ID && process.env.GOOGLE_SHEETS_CREDENTIALS_JSON,
      ),
      turnstileEnabled: Boolean(process.env.TURNSTILE_SECRET_KEY),
      leadRetentionDays: 730,
    },
  });

  console.log("Seeded globals");
  console.log("Done.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
