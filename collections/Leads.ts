import type { CollectionConfig } from "payload";
import { isOwner, leadsAccess } from "@/lib/payload-access";

export const Leads: CollectionConfig = {
  slug: "leads",
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "businessName", "intent", "status", "createdAt"],
    group: "CRM",
    listSearchableFields: ["email", "fullName", "businessName", "brief"],
  },
  access: {
    // Public form uses Local API with overrideAccess — do not expose create via REST
    create: () => false,
    delete: isOwner,
    read: leadsAccess,
    update: leadsAccess,
  },
  fields: [
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "new",
      options: [
        { label: "New", value: "new" },
        { label: "Contacted", value: "contacted" },
        { label: "Qualified", value: "qualified" },
        { label: "Proposal", value: "proposal" },
        { label: "Won", value: "won" },
        { label: "Lost", value: "lost" },
        { label: "Spam", value: "spam" },
      ],
      index: true,
    },
    {
      name: "priority",
      type: "select",
      defaultValue: "normal",
      options: [
        { label: "Low", value: "low" },
        { label: "Normal", value: "normal" },
        { label: "High", value: "high" },
      ],
    },
    { name: "fullName", type: "text" },
    { name: "email", type: "email", required: true, index: true },
    { name: "businessName", type: "text" },
    {
      name: "businessType",
      type: "select",
      options: [
        { label: "Restaurant", value: "restaurant" },
        { label: "Hotel", value: "hotel" },
        { label: "Bar / Café", value: "bar" },
        { label: "Other", value: "other" },
      ],
    },
    { name: "siteUrl", type: "text" },
    { name: "brief", type: "textarea" },
    {
      name: "source",
      type: "select",
      options: [
        { label: "Google", value: "google" },
        { label: "Referral", value: "referral" },
        { label: "Social", value: "social" },
        { label: "Other", value: "other" },
      ],
    },
    {
      name: "intent",
      type: "select",
      defaultValue: "contact",
      options: [
        { label: "Audit", value: "audit" },
        { label: "Contact", value: "contact" },
      ],
      index: true,
    },
    {
      name: "locale",
      type: "select",
      options: [
        { label: "IT", value: "it" },
        { label: "EN", value: "en" },
        { label: "FR", value: "fr" },
        { label: "RU", value: "ru" },
        { label: "DE", value: "de" },
        { label: "ES", value: "es" },
      ],
    },
    {
      name: "selectedServices",
      type: "array",
      fields: [{ name: "value", type: "text", required: true }],
    },
    {
      name: "selectedServiceSlugs",
      type: "array",
      fields: [{ name: "value", type: "text", required: true }],
    },
    {
      name: "selectedAddons",
      type: "array",
      fields: [{ name: "value", type: "text", required: true }],
    },
    {
      name: "estimatedTotal",
      type: "number",
      admin: { description: "EUR estimate from cart at submit time" },
    },
    { name: "ip", type: "text", admin: { readOnly: true, position: "sidebar" } },
    { name: "userAgent", type: "text", admin: { readOnly: true, position: "sidebar" } },
    {
      name: "lostReason",
      type: "text",
      admin: { condition: (_, siblingData) => siblingData?.status === "lost" },
    },
    {
      name: "followUpAt",
      type: "date",
      admin: { date: { pickerAppearance: "dayAndTime" } },
    },
    {
      name: "assignee",
      type: "relationship",
      relationTo: "users",
    },
    {
      name: "tags",
      type: "array",
      fields: [{ name: "tag", type: "text", required: true }],
    },
    {
      name: "notes",
      type: "array",
      fields: [
        { name: "body", type: "textarea", required: true },
        {
          name: "author",
          type: "relationship",
          relationTo: "users",
        },
        {
          name: "createdAtNote",
          type: "date",
          admin: { readOnly: true, date: { pickerAppearance: "dayAndTime" } },
        },
      ],
    },
    {
      name: "rawPayload",
      type: "json",
      admin: { readOnly: true },
    },
  ],
  timestamps: true,
};
