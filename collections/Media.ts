import type { CollectionConfig } from "payload";
import { contentWriteAccess } from "@/lib/payload-access";

export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    group: "Media",
  },
  access: {
    create: contentWriteAccess,
    delete: contentWriteAccess,
    read: () => true,
    update: contentWriteAccess,
  },
  upload: {
    staticDir: "media",
    mimeTypes: ["image/*", "image/svg+xml"],
    imageSizes: [
      { name: "thumbnail", width: 400, height: 300, position: "centre" },
      { name: "card", width: 768, height: 512, position: "centre" },
      { name: "hero", width: 1920, height: undefined, position: "centre" },
    ],
    adminThumbnail: "thumbnail",
  },
  fields: [
    {
      name: "alt",
      type: "text",
      localized: true,
      required: true,
    },
    {
      name: "folder",
      type: "select",
      defaultValue: "general",
      options: [
        { label: "General", value: "general" },
        { label: "Projects", value: "projects" },
        { label: "Services", value: "services" },
        { label: "Before/After", value: "before-after" },
        { label: "Brand / OG", value: "brand" },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ req, operation }) => {
        if (operation === "create" && !req.user) {
          throw new Error("Unauthorized upload");
        }
      },
    ],
  },
};
