import type { GlobalConfig } from "payload";
import { contentWriteAccess } from "@/lib/payload-access";

/** Marketing copy for all public pages (localized). Replaces translations.ts as source of truth. */
export const SiteCopy: GlobalConfig = {
  slug: "site-copy",
  label: "Site Copy",
  admin: { group: "Pages" },
  access: {
    read: () => true,
    update: contentWriteAccess,
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Nav & Hero",
          fields: [
            {
              name: "nav",
              type: "group",
              fields: [
                { name: "work", type: "text", localized: true },
                { name: "services", type: "text", localized: true },
                { name: "process", type: "text", localized: true },
                { name: "contact", type: "text", localized: true },
                { name: "audit", type: "text", localized: true },
                { name: "buy", type: "text", localized: true },
                { name: "about", type: "text", localized: true },
              ],
            },
            {
              name: "hero",
              type: "group",
              fields: [
                { name: "eyebrow", type: "text", localized: true },
                { name: "headline", type: "textarea", localized: true },
                { name: "subtitle", type: "textarea", localized: true },
                { name: "lead", type: "textarea", localized: true },
                { name: "primaryCta", type: "text", localized: true },
                { name: "secondaryCta", type: "text", localized: true },
                { name: "buyCta", type: "text", localized: true },
                { name: "buyCtaShort", type: "text", localized: true },
                { name: "socialProof", type: "text", localized: true },
                { name: "mockupCaption", type: "text", localized: true },
                { name: "chipHighlight", type: "text", localized: true },
                { name: "chipAvailability", type: "text", localized: true },
                { name: "chipAvailabilitySub", type: "text", localized: true },
              ],
            },
          ],
        },
        {
          label: "Home sections",
          fields: [
            {
              name: "trust",
              type: "array",
              localized: true,
              fields: [{ name: "item", type: "text", required: true }],
            },
            {
              name: "proof",
              type: "group",
              fields: [
                { name: "eyebrow", type: "text", localized: true },
                {
                  name: "items",
                  type: "array",
                  localized: true,
                  fields: [
                    { name: "value", type: "text", required: true },
                    { name: "label", type: "text", required: true },
                  ],
                },
                {
                  name: "footnote",
                  type: "group",
                  fields: [
                    { name: "value", type: "text", localized: true },
                    { name: "label", type: "text", localized: true },
                  ],
                },
              ],
            },
            {
              name: "problem",
              type: "group",
              fields: [
                { name: "eyebrow", type: "text", localized: true },
                { name: "title", type: "text", localized: true },
                { name: "body", type: "textarea", localized: true },
              ],
            },
            {
              name: "servicesLabel",
              type: "text",
              localized: true,
            },
            {
              name: "servicesLead",
              type: "textarea",
              localized: true,
            },
            {
              name: "caseStudies",
              type: "group",
              fields: [
                { name: "label", type: "text", localized: true },
                { name: "viewCaseStudy", type: "text", localized: true },
                {
                  name: "fields",
                  type: "group",
                  fields: [
                    { name: "problem", type: "text", localized: true },
                    { name: "solution", type: "text", localized: true },
                    { name: "businessImpact", type: "text", localized: true },
                  ],
                },
              ],
            },
            {
              name: "impact",
              type: "group",
              fields: [
                { name: "label", type: "text", localized: true },
                {
                  name: "items",
                  type: "array",
                  localized: true,
                  fields: [
                    { name: "title", type: "text", required: true },
                    { name: "body", type: "textarea", required: true },
                    { name: "note", type: "text" },
                  ],
                },
              ],
            },
            {
              name: "audit",
              type: "group",
              fields: [
                { name: "title", type: "text", localized: true },
                { name: "body", type: "textarea", localized: true },
                { name: "cta", type: "text", localized: true },
                { name: "meta", type: "text", localized: true },
                { name: "freeBadge", type: "text", localized: true },
              ],
            },
            {
              name: "processSection",
              type: "group",
              fields: [
                { name: "eyebrow", type: "text", localized: true },
                { name: "title", type: "text", localized: true },
                { name: "subtitle", type: "textarea", localized: true },
                { name: "stepLabel", type: "text", localized: true },
                { name: "footerNote", type: "textarea", localized: true },
              ],
            },
            {
              name: "beforeAfter",
              type: "group",
              fields: [
                { name: "eyebrow", type: "text", localized: true },
                { name: "title", type: "text", localized: true },
                { name: "subtitle", type: "textarea", localized: true },
                { name: "beforeBadge", type: "text", localized: true },
                { name: "afterBadge", type: "text", localized: true },
                { name: "dragHint", type: "text", localized: true },
                { name: "changesTitle", type: "text", localized: true },
                { name: "footerNote", type: "textarea", localized: true },
                { name: "showOnSite", type: "checkbox", defaultValue: false },
              ],
            },
          ],
        },
        {
          label: "About / Contact / Order",
          fields: [
            {
              name: "about",
              type: "group",
              fields: [
                { name: "eyebrow", type: "text", localized: true },
                { name: "title", type: "text", localized: true },
                { name: "bio", type: "textarea", localized: true },
                {
                  name: "pills",
                  type: "array",
                  localized: true,
                  fields: [{ name: "item", type: "text", required: true }],
                },
              ],
            },
            {
              name: "aboutPage",
              type: "group",
              fields: [{ name: "backToHome", type: "text", localized: true }],
            },
            {
              name: "contact",
              type: "group",
              fields: [
                { name: "label", type: "text", localized: true },
                { name: "title", type: "text", localized: true },
                { name: "body", type: "textarea", localized: true },
                { name: "compactTitle", type: "text", localized: true },
                { name: "emailLabel", type: "text", localized: true },
                { name: "whatsappLabel", type: "text", localized: true },
                { name: "availability", type: "text", localized: true },
              ],
            },
            {
              name: "orderPage",
              type: "group",
              fields: [
                { name: "eyebrow", type: "text", localized: true },
                { name: "title", type: "text", localized: true },
                { name: "subtitle", type: "textarea", localized: true },
                { name: "fromLabel", type: "text", localized: true },
                { name: "plusLabel", type: "text", localized: true },
                { name: "selectHint", type: "text", localized: true },
                { name: "proceedCta", type: "text", localized: true },
                { name: "footnote", type: "textarea", localized: true },
                { name: "estimatedLabel", type: "text", localized: true },
                { name: "addonsSectionTitle", type: "text", localized: true },
                { name: "aboutServiceCta", type: "text", localized: true },
              ],
            },
            {
              name: "pricingAddons",
              type: "group",
              fields: [
                { name: "eyebrow", type: "text", localized: true },
                { name: "title", type: "text", localized: true },
                { name: "subtitle", type: "textarea", localized: true },
                { name: "footnote", type: "textarea", localized: true },
              ],
            },
          ],
        },
        {
          label: "Page chrome & Footer",
          fields: [
            {
              name: "servicesPage",
              type: "group",
              fields: [
                { name: "eyebrow", type: "text", localized: true },
                { name: "title", type: "text", localized: true },
                { name: "subtitle", type: "textarea", localized: true },
                { name: "techStack", type: "text", localized: true },
                { name: "viewAll", type: "text", localized: true },
                { name: "pricingNote", type: "textarea", localized: true },
              ],
            },
            {
              name: "servicePage",
              type: "group",
              fields: [
                { name: "backToHome", type: "text", localized: true },
                { name: "deliverables", type: "text", localized: true },
                { name: "howItWorks", type: "text", localized: true },
                { name: "viewService", type: "text", localized: true },
                { name: "otherServices", type: "text", localized: true },
                { name: "sectionEyebrow", type: "text", localized: true },
                { name: "pricingEyebrow", type: "text", localized: true },
                { name: "popularLabel", type: "text", localized: true },
                { name: "orderCta", type: "text", localized: true },
              ],
            },
            {
              name: "workPage",
              type: "group",
              fields: [
                { name: "eyebrow", type: "text", localized: true },
                { name: "title", type: "text", localized: true },
                { name: "subtitle", type: "textarea", localized: true },
                { name: "viewAll", type: "text", localized: true },
                { name: "backToWork", type: "text", localized: true },
                { name: "visitLiveSite", type: "text", localized: true },
                { name: "liveStatus", type: "text", localized: true },
                { name: "techStack", type: "text", localized: true },
                { name: "overview", type: "text", localized: true },
                { name: "otherProjects", type: "text", localized: true },
              ],
            },
            {
              name: "footer",
              type: "group",
              fields: [
                { name: "description", type: "textarea", localized: true },
                { name: "links", type: "text", localized: true },
                { name: "location", type: "text", localized: true },
                { name: "status", type: "text", localized: true },
                { name: "privacy", type: "text", localized: true },
                { name: "built", type: "text", localized: true },
              ],
            },
            {
              name: "privacyPage",
              type: "group",
              fields: [
                { name: "title", type: "text", localized: true },
                { name: "lastUpdated", type: "text", localized: true },
                { name: "backToHome", type: "text", localized: true },
                {
                  name: "sections",
                  type: "array",
                  localized: true,
                  fields: [
                    { name: "heading", type: "text", required: true },
                    { name: "body", type: "textarea", required: true },
                  ],
                },
              ],
            },
            {
              name: "langSelector",
              type: "group",
              fields: [{ name: "label", type: "text", localized: true }],
            },
          ],
        },
      ],
    },
  ],
};
