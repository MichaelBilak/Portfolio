import type { CollectionConfig } from "payload";
import { contentReadAccess, contentWriteAccess } from "@/lib/payload-access";
import { revalidateCatalog, revalidateCatalogOnDelete } from "@/lib/cms/revalidate";

export const Projects: CollectionConfig = {
  slug: "projects",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "index", "isLive", "published", "updatedAt"],
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
      name: "projectId",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
    },
    {
      name: "index",
      type: "text",
      required: true,
      admin: { description: "Display index e.g. 01" },
    },
    {
      name: "tag",
      type: "text",
      required: true,
    },
    {
      name: "sortOrder",
      type: "number",
      defaultValue: 0,
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "imagePath",
      type: "text",
      admin: { description: "Fallback /images/… path" },
    },
    {
      name: "imagePosition",
      type: "select",
      defaultValue: "top",
      options: [
        { label: "Top", value: "top" },
        { label: "Center", value: "center" },
      ],
    },
    {
      name: "tech",
      type: "array",
      fields: [{ name: "label", type: "text", required: true }],
    },
    {
      name: "url",
      type: "text",
      required: true,
    },
    {
      name: "displayUrl",
      type: "text",
      required: true,
    },
    {
      name: "isLive",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: true,
      admin: { description: "Show on homepage Featured Work" },
    },
    {
      name: "published",
      type: "checkbox",
      defaultValue: true,
    },
    {
      name: "name",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "nameTagline",
      type: "text",
      localized: true,
    },
    {
      name: "subtitle",
      type: "textarea",
      required: true,
      localized: true,
    },
    {
      name: "problem",
      type: "textarea",
      required: true,
      localized: true,
    },
    {
      name: "solution",
      type: "textarea",
      required: true,
      localized: true,
    },
    {
      name: "businessImpact",
      type: "textarea",
      required: true,
      localized: true,
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
    afterChange: [revalidateCatalog],
    afterDelete: [revalidateCatalogOnDelete],
  },
};
