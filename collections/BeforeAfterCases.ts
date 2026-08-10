import type { CollectionConfig } from "payload";
import { contentReadAccess, contentWriteAccess } from "@/lib/payload-access";

export const BeforeAfterCases: CollectionConfig = {
  slug: "before-after-cases",
  admin: {
    useAsTitle: "caseId",
    defaultColumns: ["caseId", "sortOrder", "published", "updatedAt"],
    group: "Portfolio",
  },
  access: {
    create: contentWriteAccess,
    delete: contentWriteAccess,
    read: contentReadAccess,
    update: contentWriteAccess,
  },
  fields: [
    {
      name: "caseId",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "sortOrder",
      type: "number",
      defaultValue: 0,
    },
    {
      name: "published",
      type: "checkbox",
      defaultValue: true,
    },
    {
      name: "beforeImage",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "afterImage",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "beforeSrc",
      type: "text",
      admin: { description: "Fallback path" },
    },
    {
      name: "afterSrc",
      type: "text",
      admin: { description: "Fallback path" },
    },
    {
      name: "tab",
      type: "text",
      localized: true,
    },
    {
      name: "headline",
      type: "text",
      localized: true,
    },
    {
      name: "changes",
      type: "array",
      localized: true,
      fields: [{ name: "item", type: "text", required: true }],
    },
    {
      name: "beforeAlt",
      type: "text",
      localized: true,
    },
    {
      name: "afterAlt",
      type: "text",
      localized: true,
    },
  ],
};
