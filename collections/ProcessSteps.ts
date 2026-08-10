import type { CollectionConfig } from "payload";
import { contentReadAccess, contentWriteAccess } from "@/lib/payload-access";

export const ProcessSteps: CollectionConfig = {
  slug: "process-steps",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["number", "title", "sortOrder", "updatedAt"],
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
      name: "stepId",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "number",
      type: "text",
      required: true,
    },
    {
      name: "sortOrder",
      type: "number",
      defaultValue: 0,
    },
    {
      name: "icon",
      type: "select",
      required: true,
      options: [
        { label: "Search", value: "Search" },
        { label: "Compass", value: "Compass" },
        { label: "Brush", value: "Brush" },
        { label: "Code2", value: "Code2" },
        { label: "TrendingUp", value: "TrendingUp" },
      ],
    },
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "summary",
      type: "text",
      localized: true,
    },
    {
      name: "description",
      type: "textarea",
      localized: true,
    },
  ],
};
