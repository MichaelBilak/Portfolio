import type { CollectionConfig } from "payload";
import { contentReadAccess, contentWriteAccess } from "@/lib/payload-access";
import { revalidateCatalog, revalidateCatalogOnDelete } from "@/lib/cms/revalidate";

export const Services: CollectionConfig = {
  slug: "services",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "sortOrder", "published", "updatedAt"],
    group: "Catalog",
  },
  access: {
    create: contentWriteAccess,
    delete: contentWriteAccess,
    read: contentReadAccess,
    update: contentWriteAccess,
  },
  fields: [
    {
      name: "serviceId",
      type: "text",
      required: true,
      unique: true,
      admin: { description: "Stable id matching pricing (e.g. premium-site)" },
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
    },
    {
      name: "sortOrder",
      type: "number",
      required: true,
      defaultValue: 0,
    },
    {
      name: "icon",
      type: "select",
      required: true,
      options: [
        { label: "CalendarCheck", value: "CalendarCheck" },
        { label: "Monitor", value: "Monitor" },
        { label: "RefreshCw", value: "RefreshCw" },
        { label: "Video", value: "Video" },
        { label: "Wrench", value: "Wrench" },
      ],
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "imagePath",
      type: "text",
      admin: {
        description: "Fallback public path (e.g. /images/service-….png) until media uploaded",
      },
    },
    {
      name: "published",
      type: "checkbox",
      defaultValue: true,
    },
    {
      name: "basePrice",
      type: "number",
      required: true,
      min: 0,
      admin: { description: "EUR starting price" },
    },
    {
      name: "isMonthly",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "description",
      type: "textarea",
      required: true,
      localized: true,
    },
    {
      name: "details",
      type: "textarea",
      localized: true,
    },
    {
      name: "whatYouGet",
      type: "array",
      localized: true,
      fields: [{ name: "item", type: "text", required: true }],
    },
    {
      name: "portfolioUrl",
      type: "text",
      localized: true,
    },
    {
      name: "portfolioLinkLabel",
      type: "text",
      localized: true,
    },
    {
      name: "portfolioUrl2",
      type: "text",
      localized: true,
    },
    {
      name: "portfolioLinkLabel2",
      type: "text",
      localized: true,
    },
    {
      name: "pricingSectionTitle",
      type: "text",
      localized: true,
    },
    {
      name: "pricingFootnote",
      type: "textarea",
      localized: true,
    },
    {
      name: "tiers",
      type: "array",
      labels: { singular: "Tier", plural: "Tiers" },
      fields: [
        { name: "tierId", type: "text", required: true },
        { name: "price", type: "number", required: true, min: 0 },
        { name: "monthly", type: "checkbox", defaultValue: false },
        { name: "featured", type: "checkbox", defaultValue: false },
        { name: "name", type: "text", required: true, localized: true },
        { name: "detail", type: "textarea", localized: true },
      ],
    },
    {
      name: "seoTitle",
      type: "text",
      localized: true,
    },
    {
      name: "seoDescription",
      type: "textarea",
      localized: true,
    },
  ],
  hooks: {
    afterChange: [
      revalidateCatalog,
      async ({ doc, previousDoc, req, operation }) => {
        if (operation !== "update" || !req.user) return;
        const priceChanged =
          doc.basePrice !== previousDoc?.basePrice ||
          JSON.stringify(doc.tiers) !== JSON.stringify(previousDoc?.tiers);
        if (!priceChanged) return;
        try {
          await req.payload.create({
            collection: "audit-logs",
            overrideAccess: true,
            data: {
              action: "price_change",
              collection: "services",
              documentId: String(doc.id),
              summary: `Service ${doc.serviceId} price/tiers updated`,
              actor: req.user.id,
              meta: {
                before: { basePrice: previousDoc?.basePrice, tiers: previousDoc?.tiers },
                after: { basePrice: doc.basePrice, tiers: doc.tiers },
              },
            },
          });
        } catch {
          // non-blocking
        }
      },
    ],
    afterDelete: [revalidateCatalogOnDelete],
  },
};
