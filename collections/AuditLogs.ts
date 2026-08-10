import type { CollectionConfig } from "payload";
import { isOwner, isLoggedIn } from "@/lib/payload-access";

/** Append-only audit of sensitive changes (prices, lead deletes, integrations). */
export const AuditLogs: CollectionConfig = {
  slug: "audit-logs",
  admin: {
    useAsTitle: "action",
    defaultColumns: ["action", "collection", "createdAt"],
    group: "Settings",
  },
  access: {
    create: isLoggedIn,
    delete: isOwner,
    read: isOwner,
    update: () => false,
  },
  fields: [
    { name: "action", type: "text", required: true },
    { name: "collection", type: "text" },
    { name: "documentId", type: "text" },
    { name: "summary", type: "textarea" },
    {
      name: "actor",
      type: "relationship",
      relationTo: "users",
    },
    { name: "meta", type: "json" },
  ],
  timestamps: true,
};
