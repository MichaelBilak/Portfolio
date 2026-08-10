import type { GlobalConfig } from "payload";
import { contentWriteAccess, isEditorOrOwner } from "@/lib/payload-access";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Brand & Site",
  admin: { group: "Settings" },
  access: {
    read: () => true,
    update: contentWriteAccess,
  },
  fields: [
    { name: "brandName", type: "text", required: true, defaultValue: "DormUp Studio" },
    { name: "brandTagline", type: "text", defaultValue: "digital studio" },
    { name: "siteUrl", type: "text", required: true, defaultValue: "https://www.dormup-it.com" },
    { name: "contactEmail", type: "email", required: true, defaultValue: "dormup.it@gmail.com" },
    { name: "instagramUrl", type: "text" },
    { name: "instagramBioLink", type: "text" },
    { name: "footerLocation", type: "text", localized: true },
    { name: "footerStatus", type: "text", localized: true },
  ],
};

export const SeoDefaults: GlobalConfig = {
  slug: "seo-defaults",
  label: "SEO Defaults",
  admin: { group: "Settings" },
  access: {
    read: () => true,
    update: contentWriteAccess,
  },
  fields: [
    { name: "defaultTitle", type: "text", localized: true, required: true },
    { name: "defaultDescription", type: "textarea", localized: true, required: true },
    {
      name: "ogImage",
      type: "upload",
      relationTo: "media",
    },
    { name: "ogImagePath", type: "text", defaultValue: "/images/og-cover.svg" },
    { name: "organizationLogoPath", type: "text", defaultValue: "/images/logo-mark.svg" },
    { name: "gaMeasurementId", type: "text", admin: { description: "GA4 Measurement ID (G-…)" } },
    { name: "plausibleDomain", type: "text" },
    { name: "metaPixelId", type: "text" },
  ],
};

export const Integrations: GlobalConfig = {
  slug: "integrations",
  label: "Integrations",
  admin: { group: "Settings" },
  access: {
    read: isEditorOrOwner,
    update: ({ req: { user } }) =>
      (user as { role?: string } | null)?.role === "owner",
  },
  fields: [
    {
      name: "gmailConfigured",
      type: "checkbox",
      defaultValue: false,
      admin: {
        readOnly: true,
        description: "Set automatically from env (GMAIL_USER + GMAIL_APP_PASSWORD)",
      },
    },
    {
      name: "sheetsConfigured",
      type: "checkbox",
      defaultValue: false,
      admin: {
        readOnly: true,
        description: "Set automatically from env (GOOGLE_SHEETS_*)",
      },
    },
    {
      name: "turnstileEnabled",
      type: "checkbox",
      defaultValue: false,
      admin: { description: "Require Cloudflare Turnstile on contact form when site key is set" },
    },
    {
      name: "leadRetentionDays",
      type: "number",
      defaultValue: 730,
      admin: { description: "GDPR retention hint (days). Soft-delete tooling uses this." },
    },
    {
      name: "notes",
      type: "textarea",
      admin: { description: "Internal ops notes — secrets stay in env, never here" },
    },
  ],
};
