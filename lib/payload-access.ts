import type { Access, FieldAccess } from "payload";

export type UserRole = "owner" | "editor" | "sales";

type UserWithRole = {
  id: string | number;
  role?: UserRole | null;
};

function getUser(user: unknown): UserWithRole | null {
  if (!user || typeof user !== "object") return null;
  return user as UserWithRole;
}

export const isLoggedIn: Access = ({ req: { user } }) => Boolean(user);

export const isOwner: Access = ({ req: { user } }) => getUser(user)?.role === "owner";

export const isEditorOrOwner: Access = ({ req: { user } }) => {
  const role = getUser(user)?.role;
  return role === "owner" || role === "editor";
};

export const isSalesOrAbove: Access = ({ req: { user } }) => {
  const role = getUser(user)?.role;
  return role === "owner" || role === "editor" || role === "sales";
};

/** Content collections: editors manage, public can read published */
export const contentReadAccess: Access = () => true;

export const contentWriteAccess: Access = isEditorOrOwner;

export const leadsAccess: Access = isSalesOrAbove;

export const ownerOnlyField: FieldAccess = ({ req: { user } }) =>
  getUser(user)?.role === "owner";
