import type { CollectionConfig } from "payload";
import { isOwner, isLoggedIn } from "@/lib/payload-access";

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "role", "updatedAt"],
    group: "Settings",
  },
  auth: true,
  access: {
    admin: ({ req: { user } }) => Boolean(user),
    create: isOwner,
    delete: isOwner,
    read: isLoggedIn,
    update: ({ req: { user }, id }) => {
      if (!user) return false;
      if ((user as { role?: string }).role === "owner") return true;
      return user.id === id;
    },
  },
  fields: [
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "editor",
      options: [
        { label: "Owner", value: "owner" },
        { label: "Editor", value: "editor" },
        { label: "Sales", value: "sales" },
      ],
      access: {
        update: ({ req: { user } }) =>
          (user as { role?: string } | null)?.role === "owner",
      },
      admin: {
        description: "owner: everything · editor: content · sales: leads only",
      },
    },
    {
      name: "name",
      type: "text",
    },
  ],
};
