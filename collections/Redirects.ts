import type { CollectionConfig } from "payload";
import { contentWriteAccess } from "@/lib/payload-access";

export const Redirects: CollectionConfig = {
  slug: "redirects",
  admin: {
    useAsTitle: "fromPath",
    defaultColumns: ["fromPath", "toPath", "permanent", "updatedAt"],
    group: "Settings",
  },
  access: {
    create: contentWriteAccess,
    delete: contentWriteAccess,
    read: () => true,
    update: contentWriteAccess,
  },
  fields: [
    {
      name: "fromPath",
      type: "text",
      required: true,
      unique: true,
      admin: { description: "e.g. /work/old-slug or /en/work/old-slug" },
    },
    {
      name: "toPath",
      type: "text",
      required: true,
    },
    {
      name: "permanent",
      type: "checkbox",
      defaultValue: true,
      admin: { description: "301 if checked, else 302" },
    },
    {
      name: "enabled",
      type: "checkbox",
      defaultValue: true,
    },
  ],
};
