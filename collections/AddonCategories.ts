import type { CollectionConfig } from "payload";
import { contentReadAccess, contentWriteAccess } from "@/lib/payload-access";

export const AddonCategories: CollectionConfig = {
  slug: "addon-categories",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "categoryId", "sortOrder", "updatedAt"],
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
      name: "categoryId",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "sortOrder",
      type: "number",
      defaultValue: 0,
      required: true,
    },
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "items",
      type: "array",
      required: true,
      fields: [
        { name: "itemId", type: "text", required: true },
        { name: "label", type: "text", required: true, localized: true },
        { name: "info", type: "textarea", localized: true },
        {
          name: "priceType",
          type: "select",
          defaultValue: "from",
          options: [
            { label: "From", value: "from" },
            { label: "Plus", value: "plus" },
          ],
        },
        { name: "price", type: "number", min: 0 },
        { name: "enabled", type: "checkbox", defaultValue: true },
      ],
    },
  ],
};
